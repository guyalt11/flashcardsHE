
import { Gender } from '@/types/vocabulary';

interface TranslationResult {
  translation: string | null;
  gender: Gender | undefined;
}

export async function translateHebrewWord(word: string): Promise<TranslationResult> {
  console.log(`Attempting to translate Hebrew word: "${word}"`);
  
  try {
    // Make API request to Wiktionary with the exact word
    const response = await fetch(
      `https://he.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(word)}&prop=wikitext&format=json&origin=*`
    );
    
    if (!response.ok) {
      throw new Error('Could not get translation data from Wiktionary');
    }
    
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.info || 'Word not found in Wiktionary');
    }
    
    const wikitext = data.parse?.wikitext?.['*'];
    if (!wikitext) {
      throw new Error('No wikitext found for this word');
    }
    
    return extractTranslationData(wikitext);
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

function extractTranslationData(wikitext: string): TranslationResult {
  console.log("Raw wikitext length:", wikitext.length);
  
  let translation: string | null = null;
  let gender: Gender | undefined = undefined;
  
  // Look for gender markers
  const firstFewRows = wikitext.split('\n').slice(0, 10).join('\n');
  if (firstFewRows.includes('זכר') || firstFewRows.includes('masculine')) {
    gender = 'm';
    console.log("Extracted gender: masculine");
  } else if (firstFewRows.includes('נקבה') || firstFewRows.includes('feminine')) {
    gender = 'f';
    console.log("Extracted gender: feminine");
  }
  
  // Look for English translation
  const translationMatch = wikitext.match(/\*\s*אנגלית:\s*(.+?)(?:\n|$)/);
  if (translationMatch && translationMatch[1]) {
    translation = translationMatch[1].trim();
    console.log("Found translation:", translation);
  }
  
  // Alternative pattern for finding translations
  if (!translation || translation.includes('{{ת|אנגלית|')) {
    // Extract from template format {{ת|אנגלית|hummus}}
    const templateMatch = wikitext.match(/\{\{ת\|אנגלית\|([^}|]+)/);
    if (templateMatch && templateMatch[1]) {
      translation = templateMatch[1].trim();
      console.log("Extracted translation from template:", translation);
    }
  }
  
  // If translation still contains template format, extract just the word
  if (translation && translation.includes('{{ת|אנגלית|')) {
    const innerMatch = translation.match(/\{\{ת\|אנגלית\|([^}|]+)/);
    if (innerMatch && innerMatch[1]) {
      translation = innerMatch[1].trim();
      console.log("Setting translation:", translation);
    }
  }
  
  if (gender) {
    console.log("Setting gender:", gender);
  }
  
  return { translation, gender };
}
