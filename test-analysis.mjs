import fs from 'fs';
import { fetchGitHubProfile } from './src/services/githubService.js';
import { analyzeGitHubProfile } from './src/services/geminiService.js';

// Load .env.local
const envConfig = fs.readFileSync('.env.local', 'utf-8');
envConfig.split(/\r?\n/).forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    process.env[key.trim()] = valueParts.join('=').trim();
  }
});

async function run() {
  const username = 'N-AVTEJ'; // or another user
  console.log('Fetching GitHub profile for:', username);
  try {
    const githubData = await fetchGitHubProfile(username);
    console.log('GitHub data fetched successfully. Total repos:', githubData.totalRepos);
    
    console.log('Calling analyzeGitHubProfile...');
    const result = await analyzeGitHubProfile(githubData);
    console.log('Analysis SUCCESS! Detected role:', result.detectedRole);
  } catch (err) {
    console.error('Caught error during analysis:', err);
  }
}

run();
