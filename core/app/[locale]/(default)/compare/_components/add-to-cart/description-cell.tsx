'use client';

import { useState } from 'react';

interface DescriptionCellProps {
  content: string;
}

const DescriptionCell = ({ content }: DescriptionCellProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const descriptionStyles = {
    maxHeight: isExpanded ? 'none' : '150px',
    overflow: 'hidden',
    position: 'relative' as const,
  };

  const buttonStyles = {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    width: '100%',
    textAlign: 'center' as const,
    marginTop: '4px',
    paddingTop: '30px',
    background: isExpanded 
      ? 'none'
      : 'linear-gradient(180deg, transparent, white 70%)',
  };

  const cleanContent = content.replace(/\s*<table[\s\S]*?<\/table>\s*/gi, '')
    .replace(/^\s+|\s+$/g, '')
    .replace(/\n\s*\n/g, '\n');
    
  const needsReadMore = cleanContent.length > 350;

  return (
    <div className="relative min-h-[150px]">
      <div
        style={descriptionStyles}
        dangerouslySetInnerHTML={{ __html: cleanContent }}
        className="prose prose-sm max-w-none"
      />
      {needsReadMore && (
        <div style={buttonStyles}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 font-medium bg-white px-4 py-1 rounded-full shadow-sm"
          >
            {isExpanded ? 'Close' : 'Read More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DescriptionCell;