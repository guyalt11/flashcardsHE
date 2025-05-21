
import React from 'react';
import { Button } from '@/components/ui/button';
import GenderTag from '@/components/GenderTag';
import { DirectionFlag } from '@/components/FlagIcon';
import { VocabWord, PracticeDirection } from '@/types/vocabulary';
import { Volume } from 'lucide-react';

interface CardFrontProps {
  word: VocabWord;
  direction: PracticeDirection;
  flipped: boolean;
}

const CardFront: React.FC<CardFrontProps> = ({ word, direction, flipped }) => {
  const frontText = direction === 'hebrewToEnglish' ? word.hebrew : word.english;
  
  const speak = (text: string, lang: 'he-IL' | 'en-US') => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      
      console.log(`Speaking ${text} in ${lang}`);
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Speech synthesis not supported in this browser");
    }
  };
  
  return (
    <div className="text-center">
      <div className="mb-4 text-muted-foreground text-sm flex items-center justify-center">
        <DirectionFlag direction={direction} size={20} />
      </div>
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-2xl font-bold">{frontText}</h2>
        {direction === 'hebrewToEnglish' && word.gender && (
          <GenderTag gender={word.gender} />
        )}
      </div>

      {direction === 'hebrewToEnglish' && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-4 flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            speak(word.hebrew, 'he-IL');
          }}
        >
          <Volume className="h-4 w-4" /> Listen
        </Button>
      )}
    </div>
  );
};

export default CardFront;
