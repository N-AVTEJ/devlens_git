import { useState } from 'react';
import { fetchGitHubProfile } from '../services/githubService';
import { analyzeGitHubProfile } from '../services/geminiService';

export function useGitHubAnalysis() {
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('done'); // 'github' | 'ai' | 'done'
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [scanStep, setScanStep] = useState(0);
  const [scanMessages, setScanMessages] = useState([
    "Scanning repositories...",
    "Detected public repositories...",
    "Analysing language distribution...",
    "Top language: calculating...",
    "Calculating readiness score...",
    "Generating career intelligence..."
  ]);

  const analyze = async (username) => {
    setLoading(true);
    setLoadingPhase('github');
    setError(null);
    setResult(null);
    setScanStep(0);

    let intervalId;

    try {
      const githubData = await fetchGitHubProfile(username);
      
      const topLanguage = Object.keys(githubData.languages || {}).length > 0 
        ? Object.keys(githubData.languages).reduce((a, b) => githubData.languages[a] > githubData.languages[b] ? a : b) 
        : 'Unknown';

      const initialMessages = [
        "Scanning repositories...",
        `Detected ${githubData.totalRepos} public repositories...`,
        "Analysing language distribution...",
        `Top language: ${topLanguage}...`,
        "Calculating readiness score...",
        "Generating career intelligence..."
      ];
      setScanMessages(initialMessages);

      intervalId = setInterval(() => {
        setScanStep((prev) => {
          if (prev >= 5) {
            return 5;
          }
          return prev + 1;
        });
      }, 1200);

      // Transition to AI analysis phase before Gemini API starts
      setLoadingPhase('ai');
      const geminiResult = await analyzeGitHubProfile(githubData);
      
      if (geminiResult.scanMessages && geminiResult.scanMessages.length > 0) {
        setScanMessages(geminiResult.scanMessages);
      }
      
      clearInterval(intervalId);
      setScanStep(5);
      setResult(geminiResult);
      setLoadingPhase('done');
    } catch (err) {
      if (intervalId) clearInterval(intervalId);
      setLoadingPhase('done');
      
      if (err.message === 'USER_NOT_FOUND') {
        setError('GitHub user not found. Check the username.');
      } else if (err.message === 'NO_REPOS') {
        setError('No public repos found. DevLens needs at least one repo.');
      } else if (err.message === 'RATE_LIMIT_EXCEEDED') {
        setError('GitHub API rate limit exceeded. Please update GITHUB_TOKEN in .env.local.');
      } else if (err.message === 'GITHUB_API_ERROR') {
        setError('Could not reach GitHub. Try again.');
      } else if (err.message === 'GEMINI_PARSE_ERROR') {
        setError('AI analysis failed. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, result, scanStep, scanMessages, loadingPhase, analyze };
}

export default useGitHubAnalysis;
