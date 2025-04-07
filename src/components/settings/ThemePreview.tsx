
import React from 'react';

interface ThemePreviewProps {
  theme: 'light' | 'dark' | 'system';
  isActive: boolean;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ theme, isActive }) => {
  const getBgColor = () => {
    switch (theme) {
      case 'light':
        return 'bg-white';
      case 'dark':
        return 'bg-slate-900';
      case 'system':
        return 'bg-gradient-to-r from-white to-slate-900';
      default:
        return 'bg-white';
    }
  };

  const getTextColor = () => {
    switch (theme) {
      case 'light':
        return 'bg-slate-900';
      case 'dark':
        return 'bg-white';
      case 'system':
        return 'bg-gradient-to-r from-slate-900 to-white';
      default:
        return 'bg-slate-900';
    }
  };

  return (
    <div className={`w-full mt-2 aspect-video rounded-md border overflow-hidden transition-all duration-200 ${isActive ? 'ring-2 ring-primary shadow-md' : ''}`}>
      <div className={`w-full h-full ${getBgColor()} p-2`}>
        {/* Mock UI elements */}
        <div className={`w-1/2 h-2 rounded-full mb-1 ${getTextColor()} opacity-80`}></div>
        <div className={`w-3/4 h-2 rounded-full mb-1 ${getTextColor()} opacity-60`}></div>
        <div className={`w-2/3 h-2 rounded-full ${getTextColor()} opacity-40`}></div>
        
        <div className="flex gap-1 mt-2 justify-end">
          <div className={`w-3 h-3 rounded-sm ${getTextColor()} opacity-70`}></div>
          <div className={`w-3 h-3 rounded-sm ${getTextColor()} opacity-70`}></div>
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;
