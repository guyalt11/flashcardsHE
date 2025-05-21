
import { useState, useEffect } from 'react';
import { VocabWord, Gender } from '@/types/vocabulary';
import { useVocab } from '@/context/VocabContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import GenderTag from '@/components/GenderTag';
import { Loader2, AlertCircle, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { translateHebrewWord } from '@/services/translationService';

interface AddWordFormProps {
  editWord?: VocabWord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddWordForm: React.FC<AddWordFormProps> = ({ 
  editWord, 
  open, 
  onOpenChange 
}) => {
  const { addWord, updateWord, currentList } = useVocab();
  
  const [hebrew, setHebrew] = useState(editWord?.hebrew || '');
  const [english, setEnglish] = useState(editWord?.english || '');
  const [gender, setGender] = useState<Gender | undefined>(editWord?.gender);
  const [notes, setNotes] = useState(editWord?.notes || '');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);

  useEffect(() => {
    const debounceTimeout = setTimeout(async () => {
      if (hebrew.trim().length >= 2 && !editWord) {
        setIsTranslating(true);
        setTranslateError(null);
        
        try {
          const result = await translateHebrewWord(hebrew);
          
          if (result.translation) {
            setEnglish(result.translation);
            console.log("Setting translation:", result.translation);
          }
          
          setGender(result.gender);
          console.log("Setting gender:", result.gender);
        } catch (error) {
          console.error("Translation error:", error);
          setTranslateError("Translation failed. Please enter the translation manually.");
        } finally {
          setIsTranslating(false);
        }
      }
    }, 800); // Debounce for 800ms
    
    return () => clearTimeout(debounceTimeout);
  }, [hebrew, editWord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hebrew.trim() || !english.trim()) {
      toast({
        title: "Error",
        description: "Both Hebrew word and English translation are required",
        variant: "destructive",
      });
      return;
    }

    if (editWord) {
      updateWord(editWord.id, {
        hebrew: hebrew.trim(),
        english: english.trim(),
        gender,
        notes: notes.trim() || undefined,
      });
      toast({
        title: "Word updated",
        description: `"${hebrew}" has been updated in your vocabulary list.`,
      });
    } else {
      if (currentList) {
        addWord(currentList.id, {
          hebrew: hebrew.trim(),
          english: english.trim(),
          gender,
          notes: notes.trim() || undefined,
        });
        toast({
          title: "Word added",
          description: `"${hebrew}" has been added to your vocabulary list.`,
        });
      }
    }

    setHebrew('');
    setEnglish('');
    setGender(undefined);
    setNotes('');
    onOpenChange(false);
  };

  const clearGender = () => {
    setGender(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editWord ? 'Edit Word' : 'Add New Word'}</DialogTitle>
          <DialogDescription>
            {editWord 
              ? 'Update this word in your vocabulary list.' 
              : 'Fill in the details to add a new word to your vocabulary list.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hebrew">Hebrew Word</Label>
            <div className="relative">
              <Input
                id="hebrew"
                value={hebrew}
                onChange={(e) => setHebrew(e.target.value)}
                placeholder="e.g. תפוח"
                required
                autoFocus
                dir="rtl"
              />
              {isTranslating && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
            {isTranslating && (
              <p className="text-xs text-muted-foreground">
                Translating...
              </p>
            )}
            {translateError && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Translation Error</AlertTitle>
                <AlertDescription>
                  {translateError}
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Label>Gender (for nouns)</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={clearGender} 
                  className="h-8 flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  <span>Clear</span>
                </Button>
              </div>
            </div>
            <RadioGroup 
              value={gender || ""} 
              onValueChange={(value) => value ? setGender(value as Gender) : setGender(undefined)}
              className="flex space-x-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="m" id="male" />
                <Label htmlFor="male" className="gender-tag-m px-2 rounded">זכר (m)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="f" id="female" />
                <Label htmlFor="female" className="gender-tag-f px-2 rounded">נקבה (f)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="english">English Translation</Label>
            <Input
              id="english"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              placeholder="e.g. apple"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes here..."
            />
          </div>
          
          <DialogFooter>
            <Button type="submit">
              {editWord ? 'Update Word' : 'Add Word'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWordForm;
