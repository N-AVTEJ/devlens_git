const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function analyzeGitHubProfile(repoData) {
  const topLanguage = Object.keys(repoData.languages || {}).length > 0 
    ? Object.keys(repoData.languages).reduce((a, b) => repoData.languages[a] > repoData.languages[b] ? a : b) 
    : 'Unknown';

  const prompt = `You are a senior tech recruiter and career intelligence engine in 2025.

Analyze this developer's real GitHub data and return ONLY a valid JSON object.
No explanation, no markdown, no backticks, no extra text. Raw JSON only.

GitHub Data:
${JSON.stringify(repoData, null, 2)}

Return this exact JSON structure with real analysis based on the data above:
{
  "detectedRole": "most likely role based on languages and repos",
  "careerMatches": [
    { "role": "string", "match": number 0-100, "reason": "specific reason based on their actual repos" },
    { "role": "string", "match": number, "reason": "string" },
    { "role": "string", "match": number, "reason": "string" },
    { "role": "string", "match": number, "reason": "string" },
    { "role": "string", "match": number, "reason": "string" }
  ],
  "detectedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "radarScores": {
    "Frontend": number 0-100,
    "Backend": number 0-100,
    "DevOps": number 0-100,
    "DataML": number 0-100,
    "SystemDesign": number 0-100,
    "SoftSkills": number 0-100
  },
  "benchmarks": [
    { "skill": "string", "percentile": number, "label": "top X% of [role] devs" }
  ],
  "readinessScore": number 0-100,
  "readinessBreakdown": {
    "consistency": number,
    "projectQuality": number,
    "skillDiversity": number,
    "documentation": number
  },
  "recruiterFeedback": {
    "professional": "3-4 sentences. Acknowledge their strengths from real repo data. Then give honest 2025 market reality — if frontend only, say AI is automating it and they need full-stack MERN. Be specific to their actual skills.",
    "roast": "3 punchy brutal sentences. Reference specific things from their repos like last commit date, missing tests, no TypeScript. Be funny but accurate. End with a real recommendation."
  },
  "roadmap": {
    "targetRole": "recommended next role",
    "roadmapUrl": "exact roadmap.sh URL for that role",
    "months": [
      { "month": 1, "goal": "specific skill to learn", "resource": "roadmap.sh/resource or tool name" },
      { "month": 2, "goal": "string", "resource": "string" },
      { "month": 3, "goal": "string", "resource": "string" },
      { "month": 4, "goal": "string", "resource": "string" },
      { "month": 5, "goal": "string", "resource": "string" }
    ]
  },
  "marketInsight": "2 sentences about the current job market for their detected role in 2025. Be honest about AI impact.",
  "scanMessages": [
    "Scanning repositories...",
    "Detected ${repoData.totalRepos} public repositories...",
    "Analysing language distribution...",
    "Top language: ${topLanguage}...",
    "Calculating readiness score...",
    "Generating career intelligence..."
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
    console.log('Raw Gemini response:', data.result);

    let jsonString = data.result ? data.result.trim() : '';
    
    // Extract JSON block using first '{' and last '}'
    const firstBrace = jsonString.indexOf('{');
    const lastBrace = jsonString.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonString = jsonString.substring(firstBrace, lastBrace + 1);
    }
    
    console.log('Cleaned Gemini JSON:', jsonString);
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
