
import React, { useState, useEffect } from 'react';
import { VocabWord, PracticeDirection, DifficultyLevel } from '@/types/vocabulary';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CardFront from './CardFront';
import CardBack from './CardBack';
import DifficultyButtons from './DifficultyButtons';

interface PracticeCardProps {
  word: VocabWord;
  direction: PracticeDirection;
  onAnswer: (difficulty: DifficultyLevel) => void;
  onNext: () => void;
  isAnswered: boolean;
}

const PracticeCard: React.FC<PracticeCardProps> = ({
  word,
  direction,
  onAnswer,
  onNext,
  isAnswered,
}) => {
  const [flipped, setFlipped] = useState(false);
  
  // Reset flipped state when word changes
  useEffect(() => {
    setFlipped(false);
  }, [word]);
  
  // Return early if word is undefined
  if (!word) {
    return (
      <Card className="min-h-[200px] flex flex-col justify-center items-center bg-muted/30">
        <CardContent className="text-center">
          <p>Loading word data...</p>
        </CardContent>
      </Card>
    );
  }
  
  const handleFlip = () => {
    if (!flipped) {
      setFlipped(true);
    }
  };

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    onAnswer(difficulty);
  };

  const handleNext = () => {
    onNext();
  };

  // Safeguard against undefined word
  if (!word || !word.hebrew) {
    return (
      <Card className="min-h-[200px] flex flex-col justify-center items-center bg-muted/30">
        <CardContent className="text-center">
          <p>No word available for practice.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card 
        className={`min-h-[200px] flex flex-col cursor-pointer transition-transform bg-muted/30 ${flipped ? 'animate-flip' : ''}`} 
        onClick={handleFlip}
      >
        <CardContent className="flex-1 flex flex-col justify-center items-center p-6">
          <CardFront 
            word={word} 
            direction={direction} 
            flipped={flipped} 
          />
          
          {flipped && (
            <CardBack 
              word={word} 
              direction={direction} 
            />
          )}
          
          {!flipped && (
            <div className="mt-4 text-sm text-muted-foreground">
              Click to reveal the answer
            </div>
          )}
        </CardContent>
        
        {flipped && !isAnswered && (
          <CardFooter className="flex-col space-y-2 pt-0">
            <div className="font-medium text-center w-full mb-2">How well did you know this word?</div>
            <DifficultyButtons
              word={word}
              direction={direction}
              onSelectDifficulty={handleDifficultySelect}
            />
          </CardFooter>
        )}
        
        {isAnswered && (
          <CardFooter>
            <Button className="w-full" onClick={handleNext}>
              Next Word
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default PracticeCard;
