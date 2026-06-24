const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function analyzeQuizAnswers(answers) {
  const prompt = `You are a senior tech career counsellor in 2025.

A beginner with no GitHub has completed a career interest quiz.
Analyse their answers and return ONLY valid JSON. No markdown, no backticks.

Their answers:
${JSON.stringify(answers, null, 2)}

Return this exact structure:
{
  "careerMatches": [
    { "role": "string", "match": number 0-100, "reason": "why this fits their answers" },
    { "role": "string", "match": number, "reason": "string" },
    { "role": "string", "match": number, "reason": "string" }
  ],
  "detectedRole": "top career match",
  "personalitySummary": "2 sentences describing how they think and what drives them based on answers",
  "whyThisRole": "2 sentences explaining why the top role fits them specifically",
  "detectedSkills": [],
  "missingSkills": ["list of foundational skills they need to learn"],
  "radarScores": {
    "Frontend": number,
    "Backend": number,
    "DevOps": number,
    "DataML": number,
    "SystemDesign": number,
    "SoftSkills": number
  },
  "readinessScore": number 0-100 based on how ready a complete beginner is,
  "readinessBreakdown": {
    "consistency": 0,
    "projectQuality": 0,
    "skillDiversity": 0,
    "documentation": 0
  },
  "recruiterFeedback": {
    "professional": "Encouraging but honest. Acknowledge their interest. Tell them what they need to do to break into this field in 2025.",
    "roast": "Funny take on a person who wants to be a [role] but has never written a line of code. Encouraging underneath the jokes."
  },
  "roadmap": {
    "targetRole": "string",
    "roadmapUrl": "exact roadmap.sh URL",
    "months": [
      { "month": 1, "goal": "first thing to learn", "resource": "free resource or tool" },
      { "month": 2, "goal": "string", "resource": "string" },
      { "month": 3, "goal": "string", "resource": "string" },
      { "month": 4, "goal": "string", "resource": "string" },
      { "month": 5, "goal": "string", "resource": "string" }
    ]
  },
  "marketInsight": "2 sentences about this career path in 2025",
  "firstSteps": [
    "one concrete action they can take today",
    "second action this week",
    "third action this month"
  ],
  "scanMessages": [
    "Reading your answers...",
    "Analysing personality patterns...",
    "Mapping to career paths...",
    "Calculating best matches...",
    "Building your roadmap..."
  ]
}`;

  try {
    const response = await fetch(`${BASE_URL}/api/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Gemini API');
    }

    const data = await response.json();
    console.log('Raw Gemini response (Quiz):', data.result);

    let jsonString = data.result ? data.result.trim() : '';
    
    // Extract JSON block using first '{' and last '}'
    const firstBrace = jsonString.indexOf('{');
    const lastBrace = jsonString.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonString = jsonString.substring(firstBrace, lastBrace + 1);
    }
    
    console.log('Cleaned Gemini Quiz JSON:', jsonString);
    const parsed = JSON.parse(jsonString);
    if (parsed && typeof parsed.recruiterFeedback === 'string') {
      parsed.recruiterFeedback = {
        professional: parsed.recruiterFeedback,
        roast: parsed.roast || ''
      };
    }
    return parsed;
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    throw new Error('GEMINI_PARSE_ERROR');
  }
}
