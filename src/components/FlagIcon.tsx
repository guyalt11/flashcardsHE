import { Flag } from 'lucide-react';
import { PracticeDirection } from '@/types/vocabulary';

interface FlagIconProps {
  country: 'israel' | 'uk';
  className?: string;
  size?: number;
}

const FlagIcon: React.FC<FlagIconProps> = ({ country, className = "", size = 16 }) => {
  // Using SVG for proper country flags
  if (country === 'israel') {
    return (
      <svg
        width={size}
        height={(size * 3) / 4} // maintain 8:6 ratio (flag is 8:6 in real life)
        viewBox="0 0 64 48"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* White background */}
        <rect width="64" height="48" fill="#fff" />
  
        {/* Blue stripes */}
        <rect y="4" width="64" height="6" fill="#0038b8" />
        <rect y="38" width="64" height="6" fill="#0038b8" />
  
        {/* Star of David */}
        <g transform="translate(32,24) scale(1.5)" fill="none" stroke="#0038b8" strokeWidth="2">
          <polygon points="0,-10 8.66,5 -8.66,5" />
          <polygon points="0,10 8.66,-5 -8.66,-5" />
        </g>
      </svg>
    );
  } else if (country === 'uk') {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 16 12" 
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="16" height="12" fill="#012169" />
        <path d="M0,0 L16,12 M16,0 L0,12" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M8,0 L8,12 M0,6 L16,6" stroke="#FFFFFF" strokeWidth="4" />
        <path d="M8,0 L8,12 M0,6 L16,6" stroke="#C8102E" strokeWidth="2" />
        <path d="M0,0 L16,12 M16,0 L0,12" stroke="#C8102E" strokeWidth="1" />
      </svg>
    );
  }
  
  // Fallback to generic flag
  return <Flag size={size} className={className} />;
};

// Helper component to show direction with flags
export const DirectionFlag: React.FC<{direction: PracticeDirection, size?: number, className?: string}> = ({ direction, size, className }) => {
  return direction === 'hebrewToEnglish' ? (
    <div className={`flex items-center gap-1 ${className || ''}`}>
      <FlagIcon country="israel" size={size} />
      <span className="text-xs">→</span>
      <FlagIcon country="uk" size={size} />
    </div>
  ) : (
    <div className={`flex items-center gap-1 ${className || ''}`}>
      <FlagIcon country="uk" size={size} />
      <span className="text-xs">→</span>
      <FlagIcon country="israel" size={size} />
    </div>
  );
};

export default FlagIcon;
