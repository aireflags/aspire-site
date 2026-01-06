
import React, { useState } from 'react';
import { ToolItem } from '@/types';

interface ToolCardProps {
  tool: ToolItem;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (tool.url) {
      window.open(tool.url, '_blank');
    }
  };

  return (
    <div 
      className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 items-start shadow-sm hover:border-primary cursor-pointer transition-all duration-200 group active:scale-95"
      onClick={handleClick}
    >
      <div className={`flex items-center justify-center rounded-lg w-10 h-10 ${tool.bgClass} ${tool.colorClass}`}>
        {tool.iconUrl && !imageError ? (
          <img 
            src={tool.iconUrl} 
            alt={tool.title}
            className="w-6 h-6 object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="material-symbols-outlined">{tool.icon}</span>
        )}
      </div>
      <div>
        <h2 className="text-gray-900 text-base font-bold leading-tight group-hover:text-primary transition-colors">
          {tool.title}
        </h2>
        <p className="text-gray-500 text-xs mt-1">
          {tool.subtitle}
        </p>
      </div>
    </div>
  );
};

export default ToolCard;
