
import React from 'react';
import { Button } from '@/components/ui/button';
import GenderTag from '@/components/GenderTag';
import { DirectionFlag } from '@/components/FlagIcon';
import { VocabWord, PracticeDirection } from '@/types/vocabulary';
import { Volume } from 'lucide-react';

interface CardBackProps {
  word: VocabWord;
  direction: PracticeDirection;
}

const CardBack: React.FC<CardBackProps> = ({ word, direction }) => {
  const backText = direction === 'hebrewToEnglish' ? word.english : word.hebrew;
  const showGender = direction === 'englishToHebrew' && word.gender;
  
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
    <div className="mt-8 pt-4 border-t w-full">
      <div className="mb-2 text-muted-foreground text-sm flex items-center justify-center">
        <DirectionFlag direction={direction === 'hebrewToEnglish' ? 'englishToHebrew' : 'hebrewToEnglish'} size={20} />
      </div>
      <div className="flex items-center justify-center gap-2">
        <h3 className="text-xl font-semibold">{backText}</h3>
        {showGender && <GenderTag gender={word.gender!} />}
      </div>
      
      {direction === 'englishToHebrew' && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 flex items-center gap-1"
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

export default CardBack;
