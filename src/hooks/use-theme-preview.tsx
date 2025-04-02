
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

type ThemeType = 'light' | 'dark' | 'system';

export function useThemePreview() {
  const [previewTheme, setPreviewTheme] = useState<ThemeType>('light');
  const { toast } = useToast();
  
  // Apply the theme to the document
  const applyTheme = useCallback((theme: ThemeType) => {
    try {
      const htmlElement = document.documentElement;
      
      // Remove existing theme classes
      htmlElement.classList.remove('light', 'dark');
      
      if (theme === 'system') {
        // Check system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        htmlElement.classList.add(systemPrefersDark ? 'dark' : 'light');
      } else {
        // Apply specific theme
        htmlElement.classList.add(theme);
      }
      
      // Save to local storage
      localStorage.setItem('theme', theme);
      
      toast({
        title: "Theme updated",
        description: `Applied ${theme} theme to the application.`,
        duration: 2000
      });
      
      return true;
    } catch (error) {
      console.error('Error applying theme:', error);
      toast({
        title: "Theme update failed",
        description: "There was an error applying the theme.",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);
  
  // Initialize theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType || 'light';
    setPreviewTheme(savedTheme);
    applyTheme(savedTheme);
  }, [applyTheme]);
  
  // Listen for system theme changes if using 'system'
  useEffect(() => {
    if (previewTheme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (previewTheme === 'system') {
        const systemPrefersDark = mediaQuery.matches;
        const htmlElement = document.documentElement;
        
        htmlElement.classList.remove('light', 'dark');
        htmlElement.classList.add(systemPrefersDark ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [previewTheme]);
  
  return {
    previewTheme,
    setPreviewTheme,
    applyTheme
  };
}
