
import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useThemePreview } from '@/hooks/use-theme-preview';
import ThemePreview from './ThemePreview';

const ThemeSelector = () => {
  const { previewTheme, setPreviewTheme, applyTheme } = useThemePreview();

  const handleThemeSelect = (theme: 'light' | 'dark' | 'system') => {
    setPreviewTheme(theme);
    applyTheme(theme);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Color Theme
      </label>
      <div className="grid grid-cols-3 gap-4">
        <div 
          className={`border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary ${previewTheme === 'light' ? 'border-primary bg-muted' : ''}`} 
          onClick={() => handleThemeSelect('light')}
          data-state={previewTheme === 'light' ? 'active' : 'inactive'}
        >
          <div className="flex gap-1">
            <Sun className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium">Light</span>
          <ThemePreview theme="light" isActive={previewTheme === 'light'} />
        </div>
        
        <div 
          className={`border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary ${previewTheme === 'dark' ? 'border-primary bg-muted' : ''}`}
          onClick={() => handleThemeSelect('dark')}
          data-state={previewTheme === 'dark' ? 'active' : 'inactive'}
        >
          <div className="flex gap-1">
            <Moon className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium">Dark</span>
          <ThemePreview theme="dark" isActive={previewTheme === 'dark'} />
        </div>
        
        <div 
          className={`border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary ${previewTheme === 'system' ? 'border-primary bg-muted' : ''}`}
          onClick={() => handleThemeSelect('system')}
          data-state={previewTheme === 'system' ? 'active' : 'inactive'}
        >
          <div className="flex gap-1">
            <Laptop className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium">System</span>
          <ThemePreview theme="system" isActive={previewTheme === 'system'} />
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
