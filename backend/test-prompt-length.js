import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI('AIzaSyDRdHWEXJ1SYPDcvd4jA2clZQ_ypj3bcLk');

// Read the geminiService.js file to extract the prompt
const serviceFile = fs.readFileSync('./src/services/geminiService.js', 'utf8');

// Extract the prompt (between the backticks after "const prompt = ")
const promptMatch = serviceFile.match(/const prompt = `([\s\S]*?)`;/);
const prompt = promptMatch ? promptMatch[1] : null;

if (!prompt) {
  console.error('❌ Could not extract prompt from geminiService.js');
  process.exit(1);
}

// Calculate prompt statistics
const promptLength = prompt.length;
const promptWords = prompt.split(/\s+/).length;
const promptLines = prompt.split('\n').length;

// Estimate tokens (rough estimate: 1 token ≈ 4 characters for English)
const estimatedTokens = Math.ceil(promptLength / 4);

console.log('\n📊 PROMPT STATISTICS');
console.log('━'.repeat(60));
console.log(`Characters: ${promptLength.toLocaleString()}`);
console.log(`Words: ${promptWords.toLocaleString()}`);
console.log(`Lines: ${promptLines.toLocaleString()}`);
console.log(`Estimated Tokens: ${estimatedTokens.toLocaleString()}`);
console.log('━'.repeat(60));

// Check against Gemini limits
console.log('\n🔍 GEMINI API LIMITS CHECK');
console.log('━'.repeat(60));

// Gemini Flash limits (as of 2024)
const GEMINI_FLASH_INPUT_LIMIT = 1048576; // 1M tokens
const GEMINI_FLASH_OUTPUT_LIMIT = 8192; // 8K tokens

console.log(`Input Token Limit: ${GEMINI_FLASH_INPUT_LIMIT.toLocaleString()} tokens`);
console.log(`Estimated Prompt Tokens: ${estimatedTokens.toLocaleString()} tokens`);
console.log(`Usage: ${((estimatedTokens / GEMINI_FLASH_INPUT_LIMIT) * 100).toFixed(2)}%`);

if (estimatedTokens < GEMINI_FLASH_INPUT_LIMIT) {
  console.log('✅ Prompt is WELL WITHIN the token limit');
} else {
  console.log('❌ WARNING: Prompt may EXCEED the token limit');
}

console.log('━'.repeat(60));

// Test with actual API
console.log('\n🧪 TESTING WITH GEMINI API');
console.log('━'.repeat(60));

async function testPrompt() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    
    // Create a simple test prompt
    const testPrompt = prompt.replace('${fileName}', 'test-document.pdf');
    
    console.log('Sending test request to Gemini API...');
    const startTime = Date.now();
    
    const result = await model.generateContent(testPrompt + '\n\nNote: This is just a test to verify the prompt works. Respond with a simple JSON: {"test": "success"}');
    const response = await result.response;
    const text = response.text();
    
    const duration = Date.now() - startTime;
    
    console.log(`✅ API Response received in ${duration}ms`);
    console.log('Response preview:', text.substring(0, 200) + '...');
    
    // Try to parse as JSON
    try {
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanText);
      console.log('✅ Response is valid JSON');
    } catch (e) {
      console.log('⚠️  Response is not valid JSON (expected for test)');
    }
    
    console.log('━'.repeat(60));
    console.log('\n✅ SUCCESS: Prompt works with Gemini API!');
    console.log('\n💡 Summary:');
    console.log(`   • Prompt length: ${promptLength.toLocaleString()} characters`);
    console.log(`   • Estimated tokens: ${estimatedTokens.toLocaleString()}`);
    console.log(`   • API limit usage: ${((estimatedTokens / GEMINI_FLASH_INPUT_LIMIT) * 100).toFixed(2)}%`);
    console.log(`   • Response time: ${duration}ms`);
    
  } catch (error) {
    console.error('❌ ERROR testing prompt:', error.message);
    if (error.message.includes('too long') || error.message.includes('token limit')) {
      console.error('\n⚠️  The prompt EXCEEDS the API token limit!');
      console.error('   Consider reducing the prompt length or splitting it into sections.');
    }
    process.exit(1);
  }
}

testPrompt();
