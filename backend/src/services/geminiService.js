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

Analyze this file (${fileName}) thoroughly and provide a detailed verification report in JSON format with the following structure:

{
"isAuthentic": boolean (true if the file appears authentic, false if suspicious or manipulated),
"confidenceScore": number (0-100, your confidence in the assessment),
"riskLevel": string ("low", "medium", "high", or "critical"),
"detectedIssues": [
{
"type": string (e.g., "deepfake", "metadata-manipulation", "pixel-anomaly", "compression-artifacts", "ai-generated", "forgery"),
"severity": string ("low", "medium", "high", "critical"),
"description": string (detailed explanation),
"location": string (optional, where in the file the issue was found)
}
],
  "analysis": string (provide a point-wise detailed explanation — if the file is identified as AI-generated, list specific reasons and forensic indicators supporting that conclusion; if it is determined to be authentic or human-generated, give clear, point-wise reasoning justifying why no AI or manipulation traces were found),
"recommendations": [string] (actionable recommendations),
"metadata": {
"fileType": string,
"estimatedCreationMethod": string,
"possibleManipulations": [string],
"technicalDetails": object (any relevant technical findings)
}
}

IMPORTANT CONSISTENCY RULES:

1. **Severity Matters**: Only mark as inauthentic (isAuthentic=FALSE) if you find HIGH or CRITICAL severity issues, or clear evidence of AI-generation, deepfakes, or deliberate manipulation.

2. **Human Imperfections ARE GOOD SIGNS**: 
   - Typos, spelling errors, grammar mistakes, formatting inconsistencies are POSITIVE indicators of human authenticity
   - DO NOT report typos/spelling errors as "detected issues" - they PROVE it's human-made, not AI-generated
   - AI models produce nearly perfect grammar/spelling - human errors indicate AUTHENTICITY
   - Only report issues that suggest MANIPULATION, DEEPFAKES, or AI-GENERATION
   - Minor metadata inconsistencies, compression artifacts, natural variations = NORMAL for human documents

3. **What to Report as Issues**:
   - ✅ REPORT: AI-generated text patterns, deepfake indicators, pixel manipulation, metadata tampering, forgery evidence
   - ❌ DON'T REPORT: Typos, grammar errors, minor formatting variations, natural human imperfections
   - These human errors should be mentioned in the "analysis" field as POSITIVE authenticity indicators

4. **Risk Level Alignment**: 
   - If isAuthentic is TRUE, riskLevel must be "low" or "medium" only (never "high" or "critical")
   - If isAuthentic is FALSE, riskLevel should be "medium", "high", or "critical"
   - If riskLevel is "high" or "critical", isAuthentic must be FALSE

5. **Issue Count vs Quality**: Focus on severity, not quantity. Only 2+ high/critical severity issues (like AI-generation, deepfakes, tampering) suggest inauthenticity.

6. **Confidence Score**: High confidence (80-100) = very sure, medium (50-79) = somewhat sure, low (0-49) = uncertain.

7. **Purpose Reminder**: You are checking for MANIPULATION, AI-GENERATION, and DEEPFAKES - NOT proofreading or quality checking. Human errors are evidence of authenticity!

For your analysis, consider the following domains and tests as relevant to file type:

A. Visual/Content Analysis (images, videos)

CRITICAL FOR IMAGES: Look for PARTIAL MANIPULATION - where a real photo has been edited using AI tools:
* **Object/Person Removal (Inpainting)**: 
  - Unnatural background patterns or textures in areas where people/objects were removed
  - Inconsistent lighting or shadows (e.g., shadow exists but person is missing)
  - Repeated patterns or cloning artifacts to fill removed areas
  - Color/texture mismatches in background areas
  - Blurred or overly smooth areas that stand out from rest of image
  - Perspective inconsistencies (e.g., railing or line that should continue but is interrupted)
* **Clone Stamp/Content-Aware Fill Detection**:
  - Identical patterns repeating unnaturally (especially in sky, ground, walls)
  - Missing reflections in mirrors, water, or shiny surfaces
  - Interrupted patterns in floors, walls, or architectural elements
  - Seams or boundary artifacts where edited area meets original
* **Lighting and Shadow Analysis**:
  - Shadows that don't match visible light sources
  - Missing shadows where objects were removed
  - Inconsistent shadow directions or intensities
  - Reflections that don't match the scene
* **Perspective and Geometry**:
  - Broken lines or patterns (railings, tiles, architectural features)
  - Inconsistent vanishing points
  - Objects that should be visible but are missing
* **General Manipulation Indicators**:
  - Signs of deepfake manipulation (facial inconsistencies, unnatural movements)
  - AI-generated content indicators (repetition, unnatural textures, patterning)
  - Photo/video editing artifacts (cloning, inconsistent noise)
  - Inconsistent lighting, shadows, or reflections
  - Unnatural textures, smoothing, or pattern repetition
  - Compression artifacts that differ across image regions
  - Noise patterns that vary unnaturally
  
IMPORTANT: An image can be REAL but MANIPULATED - mark as "isAuthentic: false" if significant AI editing is detected, even if base photo is real.

B. Metadata Analysis

* Creation date/time consistency and plausibility
* Software/camera/make/model information
* GPS data authenticity and plausibility
* EXIF/XMP metadata tampering indicators (missing or inconsistent fields)

C. Technical Analysis

* Compression artifacts, quantization anomalies
* Pixel-level anomalies (E LA patterns, frequency domain artifacts)
* File format integrity and structure validation
* Presence/absence of digital signatures or known watermarks
* Error level analysis patterns or recompression footprints

D. Document Analysis (PDFs, DOCX, text files)

* Font inconsistencies and mismatches
* Altered or overlaid text and signatures
* Layering artifacts and content extraction anomalies
* Timestamp manipulation checks and revision histories
* Embedded object anomalies (images inside PDFs, scanned vs generated)

E. Audio Analysis (audio files, video-audio tracks)

* Voice cloning / synthetic voice indicators (phase, harmonic structure)
* Splicing, abrupt transitions, or silence markers
* Background noise inconsistency across segments
* Spectral analysis and waveform continuity checks

F. Combined / Cross-domain Checks

* Cross-verify metadata with visible content (e.g., GPS vs landmarks)
* Temporal consistency across media (timestamps, sequence continuity)
* Correlate digital camera signatures (noise patterns) with EXIF

If the file is a text or written document (including PDFs containing selectable text), apply the following comprehensive AI-Generated Text Detection checklist during your document analysis. Use this list to identify, document, and explain linguistic, structural, stylistic, factual, and formatting indicators that point toward AI generation or heavy AI-assistance.

**CRITICAL REMINDER: Typos, spelling errors, grammar mistakes, and formatting inconsistencies are POSITIVE indicators of human authenticity. AI models produce near-perfect grammar and spelling. If you find human errors, they are EVIDENCE OF AUTHENTICITY - mention them in your analysis as reasons why the document is likely human-made, NOT as detected issues.**

# AI-Generated Text Detection

## Comprehensive Characteristics for Written Documents

**For:** Digital Forensic Document Analysis
**Focus:** Text & Written Content Only
**Goal:** Detect AI-GENERATION, not proofreading errors

---

## Category 1: Linguistic Patterns & Style

### **1.1 Repetitive Patterns**

* Repeated words within short spans (same word appearing multiple times in a paragraph)
* Repeated phrases or sentence structures
* Cyclical reasoning that loops back to same points
* Overuse of specific transition words ("moreover," "furthermore," "however")
* Repeated sentence openings (e.g., multiple sentences starting with "The")
* Formulaic paragraph structure repeated throughout document

### **1.2 Awkward & Unnatural Phrasing**

* Sentences that are grammatically correct but don't "sound right"
* Unnatural word order that humans wouldn't choose
* Overly formal language in casual contexts
* Stilted or wooden phrasing
* Phrases that feel "translated" even in native language
* Lack of idiomatic expressions or colloquialisms
* Overuse of passive voice where active would be natural

### **1.3 Grammar & Mechanics Paradox** (SUSPICIOUS: Too Perfect)

* ⚠️ **SUSPICIOUS**: Perfect grammar with ZERO errors throughout entire document (major AI indicator)
* ⚠️ **SUSPICIOUS**: Flawless punctuation in long documents without any lapses
* ⚠️ **SUSPICIOUS**: No typos whatsoever (humans naturally make typos)
* ⚠️ **SUSPICIOUS**: Consistent capitalization without human lapses
* ⚠️ **SUSPICIOUS**: Perfect sentence structure with no fragments or natural variations
* ⚠️ **SUSPICIOUS**: No comma splices or run-ons that humans naturally make
* ✅ **AUTHENTIC SIGN**: Finding typos, spelling errors, grammar mistakes (proves human creation)
* ✅ **AUTHENTIC SIGN**: Minor inconsistencies in formatting or punctuation
* ✅ **AUTHENTIC SIGN**: Natural human imperfections and variations
* Note: Lack of intentional rule-breaking for emphasis or style
* Missing colloquial contractions (writing "do not" instead of "don't" consistently)

### **1.4 Vocabulary & Word Choice**

* Excessive use of buzzwords and jargon
* Using complex words when simple ones would be more natural
* Overuse of adjectives and adverbs
* Generic descriptors ("very," "really," "quite")
* Lack of specific, concrete language
* Absence of slang or contemporary expressions
* Unnatural synonym variation (using different words for same concept to avoid repetition)
* Academic-sounding words in non-academic contexts

---

## Category 2: Structural & Organizational Issues

### **2.1 Predictable Document Structure**

* Every paragraph follows: Topic sentence → Support → Conclusion pattern
* Introduction-Body-Conclusion structure even when inappropriate
* Unnaturally balanced sections (all paragraphs similar length)
* Consistent paragraph length throughout (typically 4-6 sentences)
* Formulaic transitions between paragraphs
* Symmetrical argument presentation

### **2.2 Content Organization Patterns**

* "On one hand... on the other hand" balanced structure
* Lists of 3-5 points consistently
* Enumeration of all possible perspectives without preference
* Chronological ordering even when thematic would be better
* Artificial segmentation of related ideas
* Overly structured bullet points with parallel structure

### **2.3 Introduction & Conclusion Tells**

* Generic opening statements ("In today's world...", "Throughout history...")
* Obvious thesis statements telegraphing all points
* Conclusions that simply restate introduction
* Summaries that add no new insight
* Call-to-action conclusions that feel obligatory
* "In conclusion" or "In summary" overuse

---

## Category 3: Tone, Voice & Personality

### **3.1 Voiceless Writing**

* No distinct personality or author voice
* Impersonal and detached throughout
* Could be written by anyone about anything
* Lacks individual quirks or style markers
* No personal anecdotes or experiences
* Missing emotional connection to topic
* Sterile, clinical presentation

### **3.2 Tonal Inconsistencies**

* Uniform tone with no natural variation
* Same enthusiasm level from start to finish
* No building of emotion or argument
* Constant formality level regardless of content
* Missing contextual tone shifts (humor, seriousness, urgency)
* Emotionally flat even on emotional topics

### **3.3 Absence of Human Elements**

* No frustration, passion, or strong emotion
* Lacks personal opinion or strong stance
* No authentic awkwardness or self-correction
* Missing "thinking on the page" moments
* No tangents or digressions
* Lacks conversational asides

### **3.4 Cautious & Hedging Language**

* Overly cautious qualifying statements
* Excessive use of "may," "might," "could," "possibly"
* "Some argue that..." without taking position
* Both-sides presentation on every point
* Avoidance of definitive statements
* Non-committal conclusions
* Diplomatic to the point of meaninglessness

---

## Category 4: Content Quality & Depth

### **4.1 Surface-Level Analysis**

* Shallow coverage of complex topics
* Basic, Wikipedia-level information
* Lacks depth and nuance
* Missing specialized knowledge
* No insider perspective or expertise signals
* Generic explanations anyone could write
* Absence of counterintuitive insights

### **4.2 Lack of Specific Details**

* Vague references without specificity
* General statements without examples
* Missing concrete data or statistics
* No specific names, dates, or places
* Abstract concepts without real-world grounding
* Placeholder-like descriptions

### **4.3 Context & Nuance Problems**

* Missing larger context of topics
* Inability to grasp subtle distinctions
* Black-and-white thinking on complex issues
* Missing cultural or historical context
* Lacks awareness of implications
* No acknowledgment of exceptions
* Oversimplification of complex topics

### **4.4 Missing Critical Thinking**

* No questioning of assumptions
* Accepts premises without examination
* Lacks synthesis of disparate ideas
* No original connections between concepts
* Missing "so what?" analysis
* Descriptive rather than analytical

---

## Category 5: Factual Accuracy & References

### **5.1 AI Hallucinations (False Information)**

* Plausible-sounding but incorrect facts
* Made-up statistics or data
* Invented quotations
* False attributions to real people
* Fictional events presented as real
* Confident presentation of wrong information
* Mixing real and fabricated details

### **5.2 Citation & Reference Issues**

* Fake citations that don't exist
* Incorrectly formatted references
* Made-up journal articles or books
* Non-existent URLs or DOIs
* Real authors with fictional works
* Vague attributions ("studies show," "research indicates")
* Outdated sources for recent topics
* Missing page numbers or publication details

### **5.3 Temporal Inaccuracies**

* Information more likely incorrect for post-cutoff events
* Outdated facts presented as current
* Missing recent developments
* References to "recent" events that are years old
* Wrong dates for known events

### **5.4 Placeholder Text**

* "Insert [name/data] here" appearing in output
* Square brackets with instructions visible
* "[Author, Year]" format without actual citation
* Incomplete sentences trailing off
* Meta-references to "the above section" that don't exist

---

## Category 6: Semantic & Logical Flow

### **6.1 Coherence Problems**

* Abrupt topic shifts without transition
* Logical non-sequiturs
* Contradictory statements within same document
* Arguments that don't support conclusions
* Missing logical connections between ideas
* Circular reasoning
* Red herrings or tangents that go nowhere

### **6.2 Sentence-Level Oddities**

* Nonsensical sentences appearing randomly
* Grammatically correct but meaningless statements
* Sentences that seem to start one idea and finish another
* Missing crucial words that would clarify meaning
* Ambiguous pronoun references
* Dangling modifiers that create confusion

### **6.3 Paragraph Unity Issues**

* Multiple unrelated ideas in single paragraph
* Topic sentences that don't match paragraph content
* Concluding sentences that introduce new ideas
* Missing bridging sentences between paragraphs
* Paragraphs that could appear in any order

---

## Category 7: Specific Linguistic Tells

### **7.1 Present Participle Overuse**

* Excessive "-ing" phrases for analysis
* "highlighting the importance of..."
* "underscoring the need for..."
* "demonstrating that..."
* "showcasing how..."
* "emphasizing the role of..."
* "reflecting the impact of..."

### **7.2 Third-Party Attribution**

* "Experts say..." without naming experts
* "According to sources..." without specifying
* "Research shows..." without citation
* "Many believe..." without identifying who
* Passive construction to avoid attribution

### **7.3 Enumeration Patterns**

* Lists all theoretical perspectives without judgment
* "There are several factors: First... Second... Third..."
* Numbered points even in narrative text
* "Various approaches include..."
* Exhaustive listing without prioritization

### **7.4 Transitional Phrase Overuse**

* "It is important to note that..."
* "With this in mind..."
* "Taking into consideration..."
* "In light of this..."
* "Consequently..."
* "As previously mentioned..."

---

## Category 8: Lack of Directionality

### **8.1 Opinion & Stance Avoidance**

* No strong opinions or positions taken
* Always presenting "both sides"
* Refusing to recommend or advise
* Equivocating on every point
* "It depends" as default position
* Missing authorial judgment

### **8.2 Self-Reflection Patterns**

* When asked to identify flaws, lists all theoretical weaknesses
* No commitment to which flaws are actual
* Acknowledges every possible limitation

### **8.3 Future Vision Absence**

* Cannot envision or predict futures convincingly
* Only describes possibilities, never advocates

---

## Category 9: Format & Technical Indicators

### **9.1 Formatting Patterns**

* Perfect, consistent formatting throughout
* Uniform spacing and indentation
* Consistent heading hierarchy
* No formatting errors or inconsistencies

### **9.2 Length Patterns**

* Predictable response lengths
* Sections of similar length
* Sentences averaging 15-25 words consistently

### **9.3 Metadata Clues**

* Creation timestamp suspicious (very recent, late night, rapid production)
* No revision history or edit tracking
* Copy-paste artifacts from AI interfaces
* Consistent font/styling suggesting single-pass creation

---

## Category 10: Domain-Specific Tells

### **10.1 Academic Writing**

* Perfect APA/MLA format but shallow content
* Abstract that perfectly summarizes (written after?)
* Literature review without synthesis

### **10.2 Creative Writing**

* Plot without emotional depth
* Characters lacking complex motivation

### **10.3 Technical Writing**

* Correct terminology without deep understanding
* Missing troubleshooting nuances

### **10.4 Business Writing**

* Generic recommendations applicable to any business
* Missing industry-specific insights

---

## Category 11: Contextual & Cultural Awareness

### **11.1 Cultural Blindness**

* Missing cultural references or idioms

### **11.2 Audience Awareness**

* Same register regardless of intended audience

### **11.3 Temporal Awareness**

* No references to current events (post-cutoff)
* Outdated examples or references

---

## Category 12: Human Writing Markers (ABSENT in AI Text)

### **12.1 Missing Human Imperfections**

* No false starts or self-corrections
* No "thinking out loud" moments

### **12.2 Missing Authenticity Markers**

* No personal experiences or anecdotes

### **12.3 Missing Stylistic Signatures**

* No idiosyncratic phrasings

---

## Detection Strategy for Written Documents

### **Red Flag Combinations** (High Confidence Indicators)

1. Perfect grammar + Shallow content + Generic voice = HIGH SUSPICION
2. Buzzword density + Cautious hedging + Balanced perspectives = HIGH SUSPICION
3. Fake citations + Confident tone + Post-cutoff errors = HIGH SUSPICION
4. Repetitive structure + Surface analysis + No human markers = HIGH SUSPICION
5. Present participle overuse + Third-party attribution + Vague references = HIGH SUSPICION

### **Testing Methods**

1. Ask for specifics: AI struggles with detailed follow-up
2. Check citations: Verify every source actually exists
3. Timeline test: Look for anachronisms or cutoff-date tells
4. Voice consistency: Read multiple pieces by "author" for voice matching
5. Expertise probe: Deep questions reveal surface knowledge
6. NLP tools: Use perplexity and burstiness analysis
7. Human baseline: Compare to verified human writing samples

### **Analysis Approach**

* Look for clusters of indicators, not single tells
* Consider context: Some AI characteristics overlap with ESL writers or neurodivergent authors
* Document specific examples of each indicator found
* Avoid overconfidence: Detection is probabilistic, not certain
* Combine automated and manual analysis methods

### **Critical Limitations**

* AI detection tools have 20-50% false positive rates
* Non-native speakers and neurodivergent writers flagged disproportionately
* Sophisticated users can "humanize" AI text easily
* Human-AI hybrid text is difficult to categorize conclusively

---

When the file is a written document, for each detected linguistic/structural/style/factual indicator you find:

* Quote the smallest representative excerpt from the document that illustrates the issue (no more than 25 words).
* Classify the indicator using the categories above (e.g., "1.3 Grammar & Mechanics Paradox — Perfect grammar").
* Assign a severity (low/medium/high) and explain why that severity was chosen.
* Include whether this indicator alone would be sufficient to label the document as "ai-generated" or whether it must be combined with other indicators.

Cross-check all textual findings with metadata and technical findings (e.g., creation timestamps, file properties, PDF layer analysis). If contradictions exist between metadata and content (e.g., metadata claims creation by "PhoneModel X" but the text references modern events after that phone's release), document the contradiction and its forensic significance.

OUTPUT FORMAT:

* Your final output MUST be valid JSON and conform exactly to the structure defined at the top of this prompt.
* For any fields that are unknown or not applicable, use null or an empty array/object as appropriate.
* Do NOT include any additional text, explanation, or markdown outside of the JSON object.

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
