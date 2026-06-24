import { useState } from 'react';
import { analyzeQuizAnswers } from '../services/quizService';

export function useQuizAnalysis() {
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('done'); // 'github' | 'ai' | 'done'
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [scanStep, setScanStep] = useState(0);
  const [scanMessages, setScanMessages] = useState([
    "Reading your answers...",
    "Analysing personality patterns...",
    "Mapping to career paths...",
    "Calculating best matches...",
    "Building your roadmap..."
  ]);

  const submit = async (answers) => {
    setLoading(true);
    setLoadingPhase('github');
    setError(null);
    setResult(null);
    setScanStep(0);
    
    setScanMessages([
      "Reading your answers...",
      "Analysing personality patterns...",
      "Mapping to career paths...",
      "Calculating best matches...",
      "Building your roadmap..."
    ]);

    const intervalId = setInterval(() => {
      setScanStep((prev) => {
        if (prev >= 4) {
          return 4;
        }
        return prev + 1;
      });
    }, 1200);

    try {
      // Transition to AI analysis phase before Gemini API starts
      setLoadingPhase('ai');
      const geminiResult = await analyzeQuizAnswers(answers);
      
      if (geminiResult.scanMessages && geminiResult.scanMessages.length > 0) {
        setScanMessages(geminiResult.scanMessages);
      }
      
      clearInterval(intervalId);
      setScanStep(4);
      setResult(geminiResult);
      setLoadingPhase('done');
    } catch (err) {
      clearInterval(intervalId);
      setLoadingPhase('done');
      console.error(err);
      setError('Career analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, result, scanStep, scanMessages, loadingPhase, submit };
}

export default useQuizAnalysis;
