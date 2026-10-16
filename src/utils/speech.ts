import { Language } from '../types';

export function speakText(text: string, lang: Language): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this browser.');
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Assign appropriate language tag
    switch (lang) {
      case 'hi':
        utterance.lang = 'hi-IN';
        break;
      case 'mr':
        utterance.lang = 'mr-IN';
        break;
      case 'pa':
        utterance.lang = 'pa-IN';
        break;
      case 'gu':
        utterance.lang = 'gu-IN';
        break;
      case 'te':
        utterance.lang = 'te-IN';
        break;
      default:
        utterance.lang = 'en-IN';
        break;
    }

    utterance.rate = 0.9; // Slightly slower, easy to understand for farmers
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Speech error:', err);
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
