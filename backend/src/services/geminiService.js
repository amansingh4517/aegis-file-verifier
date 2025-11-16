import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI('AIzaSyDRdHWEXJ1SYPDcvd4jA2clZQ_ypj3bcLk');

/**
 * Get the appropriate Gemini model
 */
const getModel = (modelName = 'gemini-flash-latest') => {
  return genAI.getGenerativeModel({ model: modelName });
};

/**
 * Convert file to Gemini-compatible format
 */
const fileToGenerativePart = (filePath, mimeType) => {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString('base64'),
      mimeType,
    },
  };
};

/**
 * Analyze file for authenticity and potential issues
 */
export const analyzeFile = async (filePath, fileName, mimeType) => {
  try {
    const model = getModel();

    // Prepare the file for Gemini
    const filePart = fileToGenerativePart(filePath, mimeType);

    // Comprehensive analysis prompt
    const prompt = `You are an expert digital forensics analyst specializing in file authenticity verification, deepfake detection, and document validation.

**CURRENT DATE: November 16, 2025** - Use this for all temporal comparisons.

Analyze this file (${fileName}) thoroughly and provide a detailed verification report in JSON format with the following structure:

{
  "isAuthentic": boolean (true if the file appears authentic, false if suspicious or manipulated),
  "confidenceScore": number (0-100, your confidence in the assessment),
  "riskLevel": string ("low", "medium", "high", or "critical"),
  "detectedIssues": [
    {
      "type": string (e.g., "deepfake", "metadata-manipulation", "pixel-anomaly", "compression-artifacts", "ai-generated-text", "ai-generated-image", "forgery", "voice-cloning", "document-tampering", "ai-inpainting", "object-removal"),
      "severity": string ("low", "medium", "high", "critical"),
      "description": string (detailed explanation),
      "location": string (optional, where in the file the issue was found),
      "indicators": [string] (specific characteristics detected),
      "evidence": string (quote or reference to specific finding)
    }
  ],
  "analysis": string (provide a point-wise detailed explanation — if the file is identified as AI-generated, list specific reasons and forensic indicators supporting that conclusion with evidence; if it is determined to be authentic or human-generated, give clear, point-wise reasoning justifying why no AI or manipulation traces were found),
  "recommendations": [string] (actionable recommendations),
  "metadata": {
    "fileType": string,
    "estimatedCreationMethod": string,
    "possibleManipulations": [string],
    "technicalDetails": object (any relevant technical findings)
  }
}

═══════════════════════════════════════════════════════════════════
CRITICAL RULES - AI CAN GENERATE REALISTIC CONTENT
═══════════════════════════════════════════════════════════════════

**IMPORTANT UNDERSTANDING**:
- Modern AI (GPT-4, Claude, Gemini) can generate HIGHLY REALISTIC content
- AI can produce well-structured documents with real data, proper citations, and specific details
- AI can create content that LOOKS human but follows subtle patterns
- Well-formatted ≠ Human-written (AI produces perfect formatting)
- Real data in document ≠ Human-written (AI can incorporate provided information)
- You MUST look beyond surface quality and check for AI linguistic patterns

**DETECTION PHILOSOPHY**:
1. **ASSUME SOPHISTICATION**: Modern AI generates high-quality, realistic content
2. **LOOK FOR PATTERNS**: AI leaves linguistic fingerprints even when content is good
3. **VERIFY EVERYTHING**: Check citations, dates, logical consistency
4. **TRUST CLUSTERS**: Multiple subtle indicators together = high confidence  

**KEY PRINCIPLE**: 
- Perfect content with real data but AI patterns = AI-GENERATED
- Poor content with human errors = HUMAN-WRITTEN
- Quality of content ≠ Authenticity indicator

═══════════════════════════════════════════════════════════════════
CONSISTENCY RULES
═══════════════════════════════════════════════════════════════════

**DETECTION THRESHOLD**:
1. For TEXT: Flag as AI-generated if you find **2+ HIGH or 1 CRITICAL + 2 MEDIUM** severity indicators
2. For IMAGES: Flag as manipulated if you find **ANY manipulation evidence** (inpainting, object removal, editing artifacts)
3. Report ALL detected indicators regardless of severity - let the evidence accumulate

**WHAT TO REPORT AS ISSUES**:
✅ **ALWAYS REPORT THESE**:
- AI linguistic patterns (present participle overuse, hedging, formulaic structure)
- Perfect grammar across entire document with zero natural errors
- Voiceless, generic writing style lacking personality
- Surface-level analysis with real-sounding but shallow content
- Repetitive sentence structures and paragraph patterns
- Fake or suspicious citations
- Placeholder text
- Image manipulation artifacts (inpainting, object removal, cloning)
- Lighting inconsistencies in images
- Unnatural background patterns or textures
- Missing shadows or reflections
- Deepfake indicators in video/images

❌ **DO NOT REPORT** (unless they indicate manipulation):
- Minor typos in otherwise AI-patterned text (AI can add fake typos)
- Good academic structure (AI excels at this)
- Technical terminology (AI knows technical language)

**RISK LEVEL ALIGNMENT**:
- If isAuthentic is TRUE → riskLevel MUST be "low" or "medium"
- If isAuthentic is FALSE → riskLevel should be "medium", "high", or "critical"
- If you detect 2+ high severity issues → isAuthentic MUST be FALSE

**CONFIDENCE SCORE**:
- 90-100: Definitive evidence (fake citations, obvious manipulation, 4+ indicators)
- 70-89: Strong evidence (3 indicators clustering together)
- 50-69: Moderate evidence (2 indicators present)
- Below 50: Insufficient evidence

═══════════════════════════════════════════════════════════════════
TEXT DOCUMENT ANALYSIS (PDF, DOCX, TXT)
═══════════════════════════════════════════════════════════════════

**CRITICAL: AI can generate documents with real data, proper formatting, and accurate information while still being AI-generated. Look for LINGUISTIC PATTERNS, not content quality.**

**HIGH SEVERITY INDICATORS** (Each counts as 1 indicator):

1. **Perfect Grammar Paradox** (CRITICAL if document is 3+ pages):
   - Zero typos across entire document
   - Flawless punctuation throughout
   - No comma splices, run-ons, or natural errors
   - Perfect sentence structure consistency
   - Evidence: Count errors - if zero in 1000+ words = CRITICAL
   - Note: A few scattered typos may be artificially added by AI users

2. **Voiceless Writing** (HIGH):
   - No distinct author personality or voice
   - Completely impersonal and detached
   - No personal anecdotes or experiences
   - Missing emotional connection to topic
   - Could be written by anyone about anything
   - Evidence: Quote 3+ paragraphs showing generic voice

3. **Present Participle Overuse** (HIGH):
   - Count instances of: "highlighting," "underscoring," "demonstrating," "showcasing," "emphasizing," "reflecting"
   - Threshold: 8+ instances in a document = HIGH severity
   - Evidence: List all instances with paragraph numbers

4. **Formulaic Structure** (HIGH):
   - Every paragraph follows: Topic sentence → Support → Conclusion
   - All paragraphs similar length (count sentences per paragraph)
   - Consistent paragraph count: 4-6 sentences repeatedly
   - Symmetrical section organization
   - Evidence: Analyze 5+ consecutive paragraphs for pattern

5. **Hedging Language Overuse** (MEDIUM-HIGH):
   - Excessive: "may," "might," "could," "possibly," "potentially"
   - Count per 100 words - threshold: 5+ = HIGH
   - "Some argue that..." without taking position
   - Both-sides presentation on every point
   - Evidence: Count and quote examples

6. **Surface-Level Analysis** (HIGH if topic is complex):
   - Wikipedia-level information on complex technical topics
   - Missing specialized knowledge or insider perspective
   - Generic explanations anyone could write
   - No counterintuitive insights or original analysis
   - Evidence: Identify specific sections lacking depth

7. **Third-Party Attribution Without Sources** (HIGH):
   - "Experts say..." without naming experts
   - "Studies show..." without citation
   - "Research indicates..." with no reference
   - "Many believe..." without identifying who
   - Threshold: 5+ instances = HIGH
   - Evidence: Quote all instances

8. **Transitional Phrase Overuse** (MEDIUM):
   - "It is important to note that..."
   - "With this in mind..."
   - "Taking into consideration..."
   - "In light of this..."
   - "Building upon this idea..."
   - Threshold: 10+ instances in document = MEDIUM
   - Evidence: Count and list

9. **Enumeration Pattern** (MEDIUM):
   - "First... Second... Third..." structure repeatedly
   - Lists of 3-5 points consistently
   - "Various approaches include..." followed by list
   - "There are several factors:" pattern
   - Evidence: Count enumeration instances

10. **Generic Openings/Closings** (MEDIUM):
    - "In today's world...", "Throughout history...", "In recent years..."
    - "In conclusion," "In summary," "To summarize," overuse
    - Conclusions that restate introduction without new insight
    - Evidence: Quote introduction and conclusion

11. **Balanced Perspective Everywhere** (MEDIUM):
    - "On one hand... on the other hand" structure
    - Never takes strong stance or position
    - Always presents all sides without judgment
    - Evidence: Quote 3+ examples

**CRITICAL SEVERITY INDICATORS** (Immediate AI confirmation):

12. **Fake Citations** (CRITICAL):
    - Non-existent URLs (must verify by checking)
    - Made-up DOIs or journal articles
    - Real authors with fictional works
    - Incorrectly formatted references
    - Evidence: Verify EVERY citation - list fake ones

13. **Placeholder Text** (CRITICAL):
    - "[Insert name]", "[TK]", "[Author, Year]"
    - Incomplete sentences with placeholders
    - Meta-references to non-existent sections
    - Evidence: Quote exact placeholder text

14. **Temporal Inaccuracies** (HIGH):
    - Information incorrect for events after 2021/2025
    - Outdated facts presented as current
    - References to "recent" events from years ago
    - Evidence: Identify specific inaccuracies with dates

15. **AI Hallucinations** (CRITICAL):
    - Plausible-sounding but factually incorrect statements
    - Made-up statistics or data
    - Invented quotations
    - Evidence: Fact-check and document errors

**MISSING HUMAN MARKERS** (Absence = +1 indicator):

16. **No Personal Elements**:
    - No "I/we" statements showing personal involvement
    - No authentic awkwardness or self-correction
    - No "thinking on the page" moments
    - No tangents or casual asides
    - Evidence: Note complete absence across document

17. **No Stylistic Signature**:
    - No idiosyncratic phrases or pet words
    - No unique metaphors or analogies
    - Generic rather than distinctive
    - Evidence: Document lack of personal style

**SPECIAL CASE - ACADEMIC/TECHNICAL DOCUMENTS**:

Even well-structured academic documents can be AI-generated. Check for:
- Perfect structure BUT surface-level analysis = AI
- Proper citations BUT vague attributions = AI
- Technical terms BUT missing nuance/edge cases = AI
- Real data BUT formulaic presentation = AI

**ANALYSIS PROCESS FOR TEXT**:

1. **Count all indicators** - be thorough, check every category
2. **Calculate severity**:
   - 1 CRITICAL indicator = AI-GENERATED (confidence 90+)
   - 2+ HIGH indicators = AI-GENERATED (confidence 85+)
   - 1 HIGH + 3 MEDIUM = AI-GENERATED (confidence 75+)
   - 4+ MEDIUM indicators = AI-GENERATED (confidence 70+)
3. **Provide evidence** for each indicator found
4. **Quote specific examples** from the document
5. **Consider the cluster** - indicators reinforce each other

**DECISION LOGIC**:
- If indicator count meets threshold → isAuthentic=FALSE
- Report ALL indicators found, even if below threshold
- Provide specific evidence and quotes for each
- Calculate confidence based on indicator strength and clustering

═══════════════════════════════════════════════════════════════════
IMAGE ANALYSIS (JPG, PNG, etc.)
═══════════════════════════════════════════════════════════════════

**CRITICAL: ANY evidence of AI editing or manipulation = isAuthentic FALSE**

**PRIORITY 1: AI INPAINTING & OBJECT REMOVAL** (CRITICAL)

Modern AI tools (Photoshop Generative Fill, DALL-E inpainting, etc.) can remove people/objects. Look for:

1. **Background Pattern Anomalies**:
   - Unnatural repetition in backgrounds (walls, sky, ground, floors)
   - Textures that appear "painted" or artificially smooth
   - Patterns that should continue but are interrupted
   - Clone stamp artifacts (identical patterns repeating)
   - Content-aware fill artifacts (blurred or distorted areas)
   - Seams or boundaries where editing meets original
   - Evidence: Identify specific areas with coordinates/description

2. **Shadow & Lighting Inconsistencies**:
   - Shadows present but person/object missing
   - Shadow direction inconsistent across scene
   - Missing shadows where objects should cast them
   - Lighting that doesn't match visible light sources
   - Inconsistent shadow intensity or sharpness
   - Evidence: Describe shadow analysis with locations

3. **Perspective Breaks**:
   - Railings, lines, or architectural elements that break/interrupt
   - Floor tiles or wall patterns that don't align
   - Vanishing points that don't match
   - Objects that should be visible but are missing
   - Geometric inconsistencies
   - Evidence: Identify broken lines or interrupted patterns

4. **Missing Reflections**:
   - Mirrors showing incomplete scene
   - Water reflections missing elements
   - Shiny surfaces not reflecting expected objects
   - Glass or windows with inconsistent reflections
   - Evidence: Describe missing reflection with location

5. **Unnatural Smoothness or Blur**:
   - Areas that are blurred when rest is sharp
   - Overly smooth textures standing out
   - Noise patterns varying across image
   - Compression artifacts differing by region
   - Evidence: Identify smooth/blurred areas

6. **Color & Texture Mismatches**:
   - Background colors don't blend naturally
   - Texture changes abruptly
   - Lighting temperature inconsistencies
   - Saturation differences in adjacent areas
   - Evidence: Describe color/texture mismatches

**PRIORITY 2: AI-GENERATED IMAGE INDICATORS** (CRITICAL)

7. **Anatomical Anomalies**:
   - Extra/missing fingers (not 5 per hand)
   - Impossible finger positions or merged fingers
   - Wrong number of teeth (adult: 28-32 typically)
   - Eyes with different reflections (left vs right)
   - Asymmetrical features beyond natural
   - Evidence: Count fingers, describe anomalies

8. **Technical AI Artifacts**:
   - Checkerboard patterns (GAN-specific)
   - Unusual compression patterns
   - Pixel-level edge distortions
   - Noise inconsistencies
   - Repeated identical elements unnaturally
   - Evidence: Describe technical artifacts

9. **Physical Impossibilities**:
   - Objects defying physics
   - Impossible architecture or geometry
   - Text that's gibberish or distorted
   - Objects morphing or blending
   - Evidence: Identify impossible elements

**ANALYSIS PROCESS FOR IMAGES**:

1. **Examine background carefully** - look for any signs of object removal
2. **Check shadows and lighting** - inconsistencies indicate manipulation
3. **Analyze patterns and textures** - repetition or unnaturalness = AI editing
4. **Look for perspective breaks** - interrupted lines or patterns
5. **Check reflections** - missing or inconsistent = manipulation
6. **If ANY manipulation evidence found** → isAuthentic=FALSE, riskLevel="high" or "critical"

**DECISION LOGIC**:
- ANY inpainting/removal evidence = MANIPULATED (confidence 80+)
- Multiple background anomalies = MANIPULATED (confidence 90+)
- Shadow + perspective inconsistencies = MANIPULATED (confidence 95+)
- Anatomical errors = AI-GENERATED (confidence 95+)

═══════════════════════════════════════════════════════════════════
VIDEO ANALYSIS (MP4, AVI, MOV)
═══════════════════════════════════════════════════════════════════

**DEEPFAKE INDICATORS** (HIGH/CRITICAL):

1. **Facial Manipulation**:
   - Unnatural facial movements
   - Temporal inconsistencies across frames
   - Blending boundaries around face
   - Lip-sync issues (audio doesn't match mouth)
   - Missing micro-expressions
   - Abnormal blinking patterns
   - Face tracking errors during movement

2. **Frame-by-Frame Issues**:
   - Abrupt lighting changes between frames
   - Background inconsistencies
   - Visual continuity breaks
   - Selective compression artifacts

3. **Biological Cues**:
   - Expressions don't match emotions
   - Missing natural head movements
   - Inconsistent jaw movement during speech
   - Unnatural eye movement

**DECISION LOGIC**: Any deepfake indicators = isAuthentic FALSE

═══════════════════════════════════════════════════════════════════
AUDIO ANALYSIS (MP3, WAV, M4A)
═══════════════════════════════════════════════════════════════════

**VOICE CLONING INDICATORS** (HIGH/CRITICAL):

1. **Missing Biological Sounds** (CRITICAL):
   - NO breath sounds during speech
   - Missing swallowing sounds
   - No mouth noises (clicks, lip smacks)
   - Perfectly consistent "breathing" if present

2. **Speech Pattern Anomalies** (HIGH):
   - Unnatural pauses in wrong places
   - Robotic rhythm or too-smooth delivery
   - Missing natural hesitations ("um," "uh")
   - No cognitive processing pauses

3. **Prosodic Issues** (MEDIUM-HIGH):
   - Misplaced syllable accents
   - Flat or emotionless delivery
   - Inconsistent emotional tone
   - Wrong word emphasis

4. **Technical Artifacts** (HIGH):
   - Strange distortions or noises
   - Frequencies outside human voice range
   - Background noise inconsistencies
   - Overly clear audio in noisy environment
   - Repetitive waveform patterns

**DECISION LOGIC**: Absence of breathing + prosodic issues = CLONED (confidence 90+)

═══════════════════════════════════════════════════════════════════
METADATA & TECHNICAL ANALYSIS (ALL FILES)
═══════════════════════════════════════════════════════════════════

Check for:
- Creation timestamp anomalies (very recent, rapid production)
- Modified dates inconsistent with content
- Software information (AI tools in metadata)
- Missing EXIF data where expected
- GPS data inconsistencies
- File property anomalies

═══════════════════════════════════════════════════════════════════
OUTPUT REQUIREMENTS
═══════════════════════════════════════════════════════════════════

For EVERY detected issue:
1. **Type**: Specific issue category
2. **Severity**: low/medium/high/critical
3. **Description**: Detailed explanation
4. **Location**: Where in file (page, paragraph, coordinates, timestamp)
5. **Indicators**: List of specific characteristics
6. **Evidence**: Quotes, measurements, specific findings

For TEXT documents:
- Count and report ALL indicators found
- Quote specific examples (max 25 words per quote)
- Provide paragraph/page numbers
- Calculate indicator totals
- Show threshold comparison

For IMAGES:
- Describe manipulation evidence with locations
- Identify background anomalies specifically
- Document shadow/lighting analysis
- Note any perspective breaks or pattern interruptions

**ANALYSIS FIELD MUST INCLUDE**:
- Point-by-point breakdown of findings
- Evidence summary for each indicator
- Threshold calculation (for text)
- Confidence justification
- Clear reasoning for authenticity determination

Provide your response ONLY as valid JSON, with no additional text or markdown formatting.`;
    // Generate analysis
    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    let analysisResult;
    try {
      // Remove markdown code blocks if present
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisResult = JSON.parse(cleanText);
      
      // Enforce logical consistency between isAuthentic, riskLevel, and detectedIssues
      
      // Check for AI-generated content detection
      const hasAIGeneratedIssue = analysisResult.detectedIssues?.some(issue => 
        issue.type === 'ai-generated' || 
        issue.description?.toLowerCase().includes('ai-generated') ||
        issue.description?.toLowerCase().includes('ai generated') ||
        issue.description?.toLowerCase().includes('artificial intelligence')
      );
      
      // Check for high/critical severity issues
      const hasHighSeverityIssue = analysisResult.detectedIssues?.some(issue => 
        issue.severity === 'high' || issue.severity === 'critical'
      );
      
      // RULE 1: If AI-generated content is detected, file cannot be authentic
      if (hasAIGeneratedIssue && analysisResult.isAuthentic === true) {
        console.warn('Inconsistent AI response: AI-generated content detected but isAuthentic=true. Correcting to false.');
        analysisResult.isAuthentic = false;
        // AI-generated content should be at least medium risk
        if (analysisResult.riskLevel === 'low') {
          analysisResult.riskLevel = 'medium';
        }
      }
      
      // RULE 2: If file is not authentic, risk level should be at least medium
      if (analysisResult.isAuthentic === false) {
        if (analysisResult.riskLevel === 'low') {
          console.warn('Inconsistent AI response: isAuthentic=false but riskLevel=low. Correcting to medium.');
          analysisResult.riskLevel = 'medium';
        }
      }
      
      // RULE 3: If file is authentic, risk level should not be high or critical
      if (analysisResult.isAuthentic === true) {
        if (analysisResult.riskLevel === 'high' || analysisResult.riskLevel === 'critical') {
          console.warn('Inconsistent AI response: isAuthentic=true but riskLevel=high/critical. Correcting isAuthentic to false.');
          analysisResult.isAuthentic = false;
        }
      }
      
      // RULE 4: If high/critical severity issues exist, file cannot be authentic
      if (hasHighSeverityIssue && analysisResult.isAuthentic === true) {
        console.warn('Inconsistent AI response: High/critical severity issues detected but isAuthentic=true. Correcting to false.');
        analysisResult.isAuthentic = false;
        // Ensure risk level matches severity
        if (analysisResult.riskLevel === 'low' || analysisResult.riskLevel === 'medium') {
          analysisResult.riskLevel = 'high';
        }
      }
      
      // RULE 5: Ensure riskLevel and isAuthentic alignment
      if ((analysisResult.riskLevel === 'high' || analysisResult.riskLevel === 'critical') && analysisResult.isAuthentic === true) {
        analysisResult.isAuthentic = false;
      }
      
      // RULE 5b: Check confidence score with medium risk - if confidence is low with medium risk and issues, mark as suspicious
      if (analysisResult.isAuthentic === true && 
          analysisResult.riskLevel === 'medium' && 
          analysisResult.confidenceScore < 80 &&
          analysisResult.detectedIssues?.length > 0) {
        console.warn('Low confidence ('+analysisResult.confidenceScore+'%) with medium risk and issues detected. Marking as suspicious.');
        analysisResult.isAuthentic = false;
      }
      
      // RULE 6: Only mark as inauthentic if multiple HIGH or CRITICAL severity issues detected
      // Minor issues (low/medium severity) alone shouldn't make a file inauthentic
      const highCriticalIssues = analysisResult.detectedIssues?.filter(issue => 
        issue.severity === 'high' || issue.severity === 'critical'
      ) || [];
      
      if (highCriticalIssues.length >= 2 && analysisResult.isAuthentic === true) {
        console.warn('Inconsistent AI response: Multiple high/critical severity issues detected but isAuthentic=true. Correcting to false.');
        analysisResult.isAuthentic = false;
        analysisResult.riskLevel = 'high';
      }
      
      // RULE 6b: If only low/medium severity issues exist and file is marked as inauthentic, verify it's justified
      const onlyMinorIssues = analysisResult.detectedIssues?.every(issue => 
        issue.severity === 'low' || issue.severity === 'medium'
      );
      
      if (onlyMinorIssues && analysisResult.detectedIssues?.length > 0 && analysisResult.detectedIssues?.length <= 3) {
        // Minor issues alone shouldn't make a file suspicious - could be legitimate human variations
        if (analysisResult.isAuthentic === false && !hasAIGeneratedIssue) {
          console.warn('Reconsidering: Only minor issues detected without AI-generation evidence. May be authentic with minor flaws.');
          // Don't force to true, but suggest medium risk
          if (analysisResult.riskLevel === 'high' || analysisResult.riskLevel === 'critical') {
            analysisResult.riskLevel = 'medium';
          }
        }
      }
      
      // RULE 7: Adjust confidence score based on issues detected
      // High confidence should only be for files that are clearly authentic OR clearly problematic
      // Medium confidence for uncertain cases
      if (analysisResult.isAuthentic === false) {
        // For non-authentic files, confidence represents how certain we are it's problematic
        const issueCount = analysisResult.detectedIssues?.length || 0;
        const hasCriticalIssue = analysisResult.detectedIssues?.some(issue => issue.severity === 'critical');
        
        // If we have strong evidence (AI-generated, critical issues, many issues)
        if (hasAIGeneratedIssue || hasCriticalIssue || issueCount >= 3) {
          // Keep high confidence (we're very sure it's not authentic)
          if (analysisResult.confidenceScore < 75) {
            console.warn('Adjusting confidence score: Strong evidence of inauthenticity detected.');
            analysisResult.confidenceScore = Math.max(analysisResult.confidenceScore, 80);
          }
        }
      } else if (analysisResult.isAuthentic === true) {
        // For authentic files, they should have few/no issues
        const issueCount = analysisResult.detectedIssues?.length || 0;
        
        // If marked authentic but has issues, lower confidence
        if (issueCount > 0) {
          console.warn('Adjusting confidence score: File marked authentic but has issues detected.');
          analysisResult.confidenceScore = Math.min(analysisResult.confidenceScore, 70);
        }
      }
      
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.log('Raw response:', text);
      
      // Fallback response if parsing fails
      analysisResult = {
        isAuthentic: null,
        confidenceScore: 0,
        riskLevel: 'medium',
        detectedIssues: [{
          type: 'analysis-error',
          severity: 'medium',
          description: 'Unable to complete full analysis. Response format error.',
          location: null
        }],
        analysis: text.substring(0, 500),
        recommendations: ['Manual review recommended'],
        metadata: {
          fileType: mimeType,
          estimatedCreationMethod: 'unknown',
          possibleManipulations: [],
          technicalDetails: { rawResponse: text }
        }
      };
    }

    return {
      success: true,
      data: analysisResult,
      rawResponse: text,
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`File analysis failed: ${error.message}`);
  }
};

/**
 * Quick scan for basic file validation
 */
export const quickScan = async (filePath, fileName, mimeType) => {
  try {
    const model = getModel();
    const filePart = fileToGenerativePart(filePath, mimeType);

    const prompt = `Perform a quick authenticity check on this file (${fileName}). 
Respond with JSON only:
{
  "isAuthentic": boolean,
  "confidenceScore": number (0-100),
  "riskLevel": "low"|"medium"|"high"|"critical",
  "summary": string (brief 1-2 sentence assessment)
}`;

    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    const text = response.text();

    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Quick scan error:', error);
    throw new Error(`Quick scan failed: ${error.message}`);
  }
};

/**
 * Generate detailed report text
 */
export const generateReport = async (verificationData) => {
  try {
    const model = getModel();

    const prompt = `Based on the following file verification data, generate a professional, detailed verification report in markdown format:

${JSON.stringify(verificationData, null, 2)}

The report should include:
1. Executive Summary
2. File Information
3. Verification Results
4. Detailed Findings
5. Risk Assessment
6. Recommendations
7. Technical Details

Make it professional and easy to understand for both technical and non-technical readers.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Report generation error:', error);
    throw new Error(`Report generation failed: ${error.message}`);
  }
};

export default {
  analyzeFile,
  quickScan,
  generateReport,
};
