import fs from 'fs';
import path from 'path';
import { fetchGitHubProfile } from '../services/githubService.js';
import { analyzeGitHubProfile } from '../services/geminiService.js';
import { analyzeQuizAnswers } from '../services/quizService.js';

// Load .env.local if it exists
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=');
        process.env[key.trim()] = value.trim();
      }
    });
  }
} catch (err) {
  console.warn('Could not load .env.local:', err.message);
}

// Redirect relative fetch URLs to localhost:3000 in Node
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  if (typeof url === 'string' && url.startsWith('/api/gemini')) {
    url = `http://127.0.0.1:3000${url}`;
  }
  return originalFetch(url, options);
};

// Helper for 500ms delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log("Starting DevLens AI backend tests...");
  console.log("Make sure npm run dev is running before starting\n");

  let passedCount = 0;
  let failedCount = 0;
  const failedTests = [];

  let test5Result = null;
  let test7Result = null;
  let isGeminiAvailable = true;

  // =====================================================
  // TEST 1 — GitHub Service: Valid username
  // =====================================================
  console.log("=== TEST 1: GitHub Service - Valid Username ===");
  try {
    const result = await fetchGitHubProfile('N-AVTEJ');
    console.log("✓ Username: " + result.username);
    console.log("✓ Total Repos: " + result.totalRepos);
    console.log("✓ Languages detected: " + Object.keys(result.languages).join(', '));
    console.log("✓ Top repos count: " + result.topRepos.length);
    console.log("✓ Account age (days): " + result.accountAgeDays);
    console.log("✓ Total stars: " + result.totalStars);
    console.log("✓ TEST 1 PASSED\n");
    passedCount++;
  } catch (error) {
    console.log("✗ TEST 1 FAILED: " + error.message + "\n");
    failedCount++;
    failedTests.push("TEST 1 — GitHub Service: Valid username");
  }

  // =====================================================
  // TEST 2 — GitHub Service: Invalid username
  // =====================================================
  console.log("=== TEST 2: GitHub Service - Invalid Username ===");
  try {
    await fetchGitHubProfile('this-user-does-not-exist-xyz-123');
    console.log("✗ TEST 2 FAILED — did not throw USER_NOT_FOUND\n");
    failedCount++;
    failedTests.push("TEST 2 — GitHub Service: Invalid username");
  } catch (error) {
    if (error.message === 'USER_NOT_FOUND') {
      console.log("✓ Correctly threw USER_NOT_FOUND");
      console.log("✓ TEST 2 PASSED\n");
      passedCount++;
    } else {
      console.log("✗ TEST 2 FAILED — expected USER_NOT_FOUND got: " + error.message + "\n");
      failedCount++;
      failedTests.push("TEST 2 — GitHub Service: Invalid username");
    }
  }

  // =====================================================
  // TEST 3 — GitHub Service: Data structure check
  // =====================================================
  console.log("=== TEST 3: GitHub Data Structure Check ===");
  try {
    const result = await fetchGitHubProfile('N-AVTEJ');
    let test3Failed = false;

    const checks = [
      { field: 'username', type: 'string', validate: (v) => typeof v === 'string' },
      { field: 'totalRepos', type: 'number', validate: (v) => typeof v === 'number' },
      { field: 'languages', type: 'object', validate: (v) => typeof v === 'object' && Object.keys(v).length >= 1 },
      { field: 'topRepos', type: 'array', validate: (v) => Array.isArray(v) && v.length > 0 },
      { field: 'accountAgeDays', type: 'number > 0', validate: (v) => typeof v === 'number' && v > 0 },
      { field: 'recentActivity', type: 'array', validate: (v) => Array.isArray(v) },
      { field: 'totalStars', type: 'number', validate: (v) => typeof v === 'number' },
      { field: 'readmeCount', type: 'number', validate: (v) => typeof v === 'number' }
    ];

    checks.forEach((check) => {
      const val = result[check.field];
      if (check.validate(val)) {
        console.log(`✓ ${check.field}: ${JSON.stringify(val)}`);
      } else {
        console.log(`✗ ${check.field} missing or wrong type`);
        test3Failed = true;
      }
    });

    if (!test3Failed) {
      console.log("✓ TEST 3 PASSED\n");
      passedCount++;
    } else {
      console.log("✗ TEST 3 FAILED\n");
      failedCount++;
      failedTests.push("TEST 3 — GitHub Service: Data structure check");
    }
  } catch (error) {
    console.log("✗ TEST 3 FAILED: " + error.message + "\n");
    failedCount++;
    failedTests.push("TEST 3 — GitHub Service: Data structure check");
  }

  // =====================================================
  // TEST 4 — Gemini API Route: Basic call
  // =====================================================
  console.log("=== TEST 4: Gemini API Route - Basic Call ===");
  try {
    const response = await originalFetch('http://127.0.0.1:3000/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Return only this exact JSON: {"test": "success", "status": "gemini working"}' })
    });

    console.log("✓ Status: " + response.status);
    const data = await response.json();
    console.log("✓ Raw response: " + data.result);

    if (data.result && data.result.includes('success')) {
      console.log("✓ TEST 4 PASSED\n");
      passedCount++;
    } else {
      console.log("✗ TEST 4 FAILED — unexpected response\n");
      failedCount++;
      failedTests.push("TEST 4 — Gemini API Route: Basic call");
    }
  } catch (error) {
    console.log("✗ TEST 4 FAILED — is the dev server running on 127.0.0.1:3000?\n");
    console.log("⚠ Skipping Gemini tests — start dev server with npm run dev first\n");
    isGeminiAvailable = false;
    failedCount++;
    failedTests.push("TEST 4 — Gemini API Route: Basic call");
    
    // Skip dependent tests
    failedCount += 5; // TEST 5, 6, 7, 8, 10 all skip
    failedTests.push("TEST 5 — Gemini Service: Full GitHub analysis (Skipped)");
    failedTests.push("TEST 6 — Gemini Service: JSON structure validation (Skipped)");
    failedTests.push("TEST 7 — Quiz Service: Full analysis (Skipped)");
    failedTests.push("TEST 8 — Quiz Service: Structure validation (Skipped)");
    failedTests.push("TEST 10 — Full end to end flow (Skipped)");
  }

  if (isGeminiAvailable) {
    // Add a 500ms delay between TEST 4 and TEST 5
    await delay(500);

    // =====================================================
    // TEST 5 — Gemini Service: Full GitHub analysis
    // =====================================================
    console.log("=== TEST 5: Gemini Service - Full GitHub Analysis ===");
    try {
      const realGitHubData = await fetchGitHubProfile('N-AVTEJ');
      const result = await analyzeGitHubProfile(realGitHubData);
      test5Result = result;

      console.log("✓ Detected role: " + result.detectedRole);
      console.log("✓ Career matches count: " + result.careerMatches.length);
      console.log("✓ Top match: " + result.careerMatches[0].role + " — " + result.careerMatches[0].match + "%");
      console.log("✓ Detected skills: " + result.detectedSkills.join(', '));
      console.log("✓ Missing skills: " + result.missingSkills.join(', '));
      console.log("✓ Readiness score: " + result.readinessScore);
      console.log("✓ Radar scores: " + JSON.stringify(result.radarScores));
      console.log("✓ Recruiter feedback (professional): " + result.recruiterFeedback.professional.slice(0, 100) + "...");
      console.log("✓ Roast: " + result.recruiterFeedback.roast.slice(0, 100) + "...");
      console.log("✓ Target role: " + result.roadmap.targetRole);
      console.log("✓ Roadmap URL: " + result.roadmap.roadmapUrl);
      console.log("✓ Roadmap months: " + result.roadmap.months.length);
      console.log("✓ Market insight: " + result.marketInsight.slice(0, 100) + "...");
      console.log("✓ TEST 5 PASSED\n");
      passedCount++;
    } catch (error) {
      console.log("✗ TEST 5 FAILED: " + error.message);
      if (error.message === 'GEMINI_PARSE_ERROR') {
        console.log("✗ Raw Gemini response was captured in console logs above.");
      }
      console.log("");
      failedCount++;
      failedTests.push("TEST 5 — Gemini Service: Full GitHub analysis");
    }

    // =====================================================
    // TEST 6 — Gemini Service: JSON structure validation
    // =====================================================
    console.log("=== TEST 6: Gemini Service: JSON Structure Validation ===");
    if (test5Result) {
      try {
        let validFields = 0;
        let totalFields = 23;

        const checkField = (name, isValid, val) => {
          if (isValid) {
            console.log(`✓ ${name}: ${JSON.stringify(val).slice(0, 80)}`);
            validFields++;
          } else {
            console.log(`✗ ${name} MISSING OR INVALID`);
          }
        };

        const res = test5Result;
        checkField("detectedRole", typeof res.detectedRole === 'string' && res.detectedRole.length > 0, res.detectedRole);
        checkField("careerMatches", Array.isArray(res.careerMatches) && res.careerMatches.length >= 3, res.careerMatches);
        if (Array.isArray(res.careerMatches) && res.careerMatches.length > 0) {
          checkField("careerMatches[0].role", typeof res.careerMatches[0].role === 'string', res.careerMatches[0].role);
          checkField("careerMatches[0].match", typeof res.careerMatches[0].match === 'number' && res.careerMatches[0].match >= 0 && res.careerMatches[0].match <= 100, res.careerMatches[0].match);
          checkField("careerMatches[0].reason", typeof res.careerMatches[0].reason === 'string', res.careerMatches[0].reason);
        } else {
          validFields += 3;
        }
        checkField("detectedSkills", Array.isArray(res.detectedSkills) && res.detectedSkills.length >= 1, res.detectedSkills);
        checkField("missingSkills", Array.isArray(res.missingSkills) && res.missingSkills.length >= 1, res.missingSkills);
        
        if (res.radarScores) {
          checkField("radarScores.Frontend", typeof res.radarScores.Frontend === 'number', res.radarScores.Frontend);
          checkField("radarScores.Backend", typeof res.radarScores.Backend === 'number', res.radarScores.Backend);
          checkField("radarScores.DevOps", typeof res.radarScores.DevOps === 'number', res.radarScores.DevOps);
          checkField("radarScores.DataML", typeof res.radarScores.DataML === 'number', res.radarScores.DataML);
          checkField("radarScores.SystemDesign", typeof res.radarScores.SystemDesign === 'number', res.radarScores.SystemDesign);
          checkField("radarScores.SoftSkills", typeof res.radarScores.SoftSkills === 'number', res.radarScores.SoftSkills);
        } else {
          console.log("✗ radarScores MISSING");
        }

        checkField("readinessScore", typeof res.readinessScore === 'number' && res.readinessScore >= 0 && res.readinessScore <= 100, res.readinessScore);
        
        if (res.readinessBreakdown) {
          checkField("readinessBreakdown.consistency", typeof res.readinessBreakdown.consistency === 'number', res.readinessBreakdown.consistency);
          checkField("readinessBreakdown.projectQuality", typeof res.readinessBreakdown.projectQuality === 'number', res.readinessBreakdown.projectQuality);
        } else {
          console.log("✗ readinessBreakdown MISSING");
        }

        if (res.recruiterFeedback) {
          checkField("recruiterFeedback.professional", typeof res.recruiterFeedback.professional === 'string' && res.recruiterFeedback.professional.length > 50, res.recruiterFeedback.professional);
          checkField("recruiterFeedback.roast", typeof res.recruiterFeedback.roast === 'string' && res.recruiterFeedback.roast.length > 50, res.recruiterFeedback.roast);
        } else {
          console.log("✗ recruiterFeedback MISSING");
        }

        if (res.roadmap) {
          checkField("roadmap.targetRole", typeof res.roadmap.targetRole === 'string', res.roadmap.targetRole);
          checkField("roadmap.roadmapUrl", typeof res.roadmap.roadmapUrl === 'string' && res.roadmap.roadmapUrl.startsWith('https://roadmap.sh'), res.roadmap.roadmapUrl);
          checkField("roadmap.months", Array.isArray(res.roadmap.months) && res.roadmap.months.length >= 3, res.roadmap.months);
        } else {
          console.log("✗ roadmap MISSING");
        }

        checkField("marketInsight", typeof res.marketInsight === 'string' && res.marketInsight.length > 50, res.marketInsight);
        checkField("scanMessages", Array.isArray(res.scanMessages) && res.scanMessages.length >= 5, res.scanMessages);

        console.log(`✓ ${validFields}/${totalFields} fields valid`);
        if (validFields === totalFields) {
          console.log("✓ TEST 6 PASSED\n");
          passedCount++;
        } else {
          console.log("✗ TEST 6 FAILED — fix missing fields in Gemini prompt\n");
          failedCount++;
          failedTests.push("TEST 6 — Gemini Service: JSON structure validation");
        }
      } catch (error) {
        console.log("✗ TEST 6 FAILED: " + error.message + "\n");
        failedCount++;
        failedTests.push("TEST 6 — Gemini Service: JSON structure validation");
      }
    } else {
      console.log("✗ TEST 6 FAILED — dependent on TEST 5 success\n");
      failedCount++;
      failedTests.push("TEST 6 — Gemini Service: JSON structure validation");
    }

    // =====================================================
    // TEST 7 — Quiz Service: Full analysis
    // =====================================================
    console.log("=== TEST 7: Quiz Service - Full Analysis ===");
    try {
      const dummyAnswers = [
        { question: "When you solve a problem what feels most satisfying?", selectedOption: "Making something look beautiful and easy to use", careers: ["UI/UX Designer", "Frontend Developer"] },
        { question: "Which sounds like your ideal work day?", selectedOption: "Designing interfaces and user flows in Figma", careers: ["UI/UX Designer", "Frontend Developer"] },
        { question: "What type of problems excite you?", selectedOption: "Why does this button feel wrong to click?", careers: ["UI/UX Designer"] },
        { question: "Pick the tool you would enjoy learning", selectedOption: "Figma + React — design and build UIs", careers: ["UI/UX Designer", "Frontend Developer"] },
        { question: "How do you prefer to think?", selectedOption: "Visually — I think in layouts colors flows", careers: ["UI/UX Designer", "Frontend Developer"] },
        { question: "What kind of impact do you want?", selectedOption: "Making apps that millions of people enjoy using", careers: ["Frontend Developer", "UI/UX Designer"] },
        { question: "Free weekend — what do you build?", selectedOption: "A beautifully designed portfolio or app UI", careers: ["Frontend Developer", "UI/UX Designer"] },
        { question: "Which describes you best?", selectedOption: "I notice bad UX everywhere and it bothers me", careers: ["UI/UX Designer", "Frontend Developer"] }
      ];

      const result = await analyzeQuizAnswers(dummyAnswers);
      test7Result = result;

      console.log("✓ Detected role: " + result.detectedRole);
      console.log("✓ Career matches: " + result.careerMatches.map(c => c.role + ' ' + c.match + '%').join(', '));
      console.log("✓ Personality summary: " + result.personalitySummary.slice(0, 100) + "...");
      console.log("✓ Why this role: " + result.whyThisRole.slice(0, 100) + "...");
      console.log("✓ Roadmap URL: " + result.roadmap.roadmapUrl);
      console.log("✓ First steps count: " + result.firstSteps.length);
      console.log("✓ Scan messages: " + result.scanMessages.join(' | '));
      console.log("✓ TEST 7 PASSED\n");
      passedCount++;
    } catch (error) {
      console.log("✗ TEST 7 FAILED: " + error.message + "\n");
      failedCount++;
      failedTests.push("TEST 7 — Quiz Service: Full analysis");
    }

    // =====================================================
    // TEST 8 — Quiz Service: Structure validation
    // =====================================================
    console.log("=== TEST 8: Quiz JSON Structure Validation ===");
    if (test7Result) {
      try {
        let test8Failed = false;
        const res = test7Result;

        const check = (name, cond) => {
          if (cond) {
            console.log(`✓ ${name} matches specification`);
          } else {
            console.log(`✗ ${name} INVALID`);
            test8Failed = true;
          }
        };

        check("detectedRole", typeof res.detectedRole === 'string');
        check("careerMatches", Array.isArray(res.careerMatches) && res.careerMatches.length >= 2);
        check("personalitySummary", typeof res.personalitySummary === 'string' && res.personalitySummary.length > 30);
        check("whyThisRole", typeof res.whyThisRole === 'string' && res.whyThisRole.length > 30);
        check("missingSkills", Array.isArray(res.missingSkills) && res.missingSkills.length >= 1);
        check("radarScores has all 6 axes", res.radarScores && 
          typeof res.radarScores.Frontend === 'number' && 
          typeof res.radarScores.Backend === 'number' && 
          typeof res.radarScores.DevOps === 'number' && 
          typeof res.radarScores.DataML === 'number' && 
          typeof res.radarScores.SystemDesign === 'number' && 
          typeof res.radarScores.SoftSkills === 'number'
        );
        check("roadmap.roadmapUrl", typeof res.roadmap.roadmapUrl === 'string' && res.roadmap.roadmapUrl.startsWith('https://roadmap.sh'));
        check("roadmap.months", Array.isArray(res.roadmap.months) && res.roadmap.months.length >= 3);
        check("firstSteps", Array.isArray(res.firstSteps) && res.firstSteps.length >= 2);
        check("scanMessages", Array.isArray(res.scanMessages) && res.scanMessages.length >= 4);
        check("recruiterFeedback.professional", typeof res.recruiterFeedback.professional === 'string');
        check("recruiterFeedback.roast", typeof res.recruiterFeedback.roast === 'string');

        if (!test8Failed) {
          console.log("✓ TEST 8 PASSED\n");
          passedCount++;
        } else {
          console.log("✗ TEST 8 FAILED\n");
          failedCount++;
          failedTests.push("TEST 8 — Quiz Service: Structure validation");
        }
      } catch (error) {
        console.log("✗ TEST 8 FAILED: " + error.message + "\n");
        failedCount++;
        failedTests.push("TEST 8 — Quiz Service: Structure validation");
      }
    } else {
      console.log("✗ TEST 8 FAILED — dependent on TEST 7 success\n");
      failedCount++;
      failedTests.push("TEST 8 — Quiz Service: Structure validation");
    }
  }

  // =====================================================
  // TEST 9 — Error handling: NO_REPOS
  // =====================================================
  console.log("=== TEST 9: Error Handling - NO_REPOS ===");
  try {
    const originalFetch = globalThis.fetch;
    // Intercept fetches to return user with 0 repos, and an empty array for repos list
    globalThis.fetch = async (url, options) => {
      if (typeof url === 'string' && url.includes('/users/') && url.includes('/repos')) {
        return {
          ok: true,
          status: 200,
          json: async () => []
        };
      }
      if (typeof url === 'string' && url.includes('/users/')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ public_repos: 0, created_at: new Date().toISOString() })
        };
      }
      return originalFetch(url, options);
    };

    try {
      await fetchGitHubProfile('user-with-zero-repos');
      console.log("✗ NO_REPOS not handled — did not throw NO_REPOS error\n");
      failedCount++;
      failedTests.push("TEST 9 — Error handling: NO_REPOS");
    } catch (err) {
      if (err.message === 'NO_REPOS') {
        console.log("✓ NO_REPOS error correctly thrown");
        console.log("✓ TEST 9 PASSED\n");
        passedCount++;
      } else {
        console.log("✗ NO_REPOS not handled — threw unexpected error: " + err.message + "\n");
        failedCount++;
        failedTests.push("TEST 9 — Error handling: NO_REPOS");
      }
    } finally {
      globalThis.fetch = originalFetch;
    }
  } catch (error) {
    console.log("✗ TEST 9 FAILED: " + error.message + "\n");
    failedCount++;
    failedTests.push("TEST 9 — Error handling: NO_REPOS");
  }

  // =====================================================
  // TEST 10 — Full end to end flow
  // =====================================================
  console.log("=== TEST 10: Full End to End — Flow A ===");
  if (isGeminiAvailable) {
    try {
      console.log("Starting E2E pipeline for user N-AVTEJ...");
      const step1Result = await fetchGitHubProfile('N-AVTEJ');
      console.log("✓ Step 1 GitHub fetch: PASSED");

      const step2Result = await analyzeGitHubProfile(step1Result);
      console.log("✓ Step 2 Gemini analysis: PASSED");

      const hasDashboardFields = step2Result.detectedRole && step2Result.readinessScore && step2Result.roadmap && step2Result.roadmap.roadmapUrl;
      if (hasDashboardFields) {
        console.log("✓ Step 3 Dashboard data ready: PASSED");
        console.log("✓ detectedRole: " + step2Result.detectedRole);
        console.log("✓ readinessScore: " + step2Result.readinessScore);
        console.log("✓ careerMatches: " + step2Result.careerMatches.length + " roles");
        console.log("✓ roadmapUrl: " + step2Result.roadmap.roadmapUrl);
        console.log("✓ FULL FLOW A COMPLETE — BACKEND IS READY\n");
        passedCount++;
      } else {
        console.log("✗ Step 3 Dashboard data validation failed: Missing critical fields\n");
        failedCount++;
        failedTests.push("TEST 10 — Full end to end flow");
      }
    } catch (error) {
      console.log("✗ FLOW A FAILED at step: " + error.message + "\n");
      failedCount++;
      failedTests.push("TEST 10 — Full end to end flow");
    }
  } else {
    console.log("✗ FLOW A FAILED — Gemini not available\n");
  }

  // =====================================================
  // FINAL SUMMARY
  // =====================================================
  console.log("=====================================");
  console.log("DEVLENS AI — BACKEND TEST RESULTS");
  console.log("=====================================");
  console.log("Tests passed: " + passedCount + "/10");
  console.log("Tests failed: " + failedCount + "/10");
  
  if (passedCount === 10) {
    console.log("✓ BACKEND IS FULLY READY — build the frontend");
  } else {
    console.log("✗ Fix failing tests before building frontend");
    failedTests.forEach((testName) => {
      console.log("  - " + testName);
    });
  }
  console.log("=====================================");
}

runTests();
