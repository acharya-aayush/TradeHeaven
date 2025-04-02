
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RotateCcw, X, Undo } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SettingChange {
  id: number;
  category: string;
  name: string;
  oldValue: any;
  newValue: any;
  timestamp: Date;
}

interface RecentSettingsPanelProps {
  changes: SettingChange[];
  onUndo: (changeId: number) => void;
  onClose: () => void;
}

const RecentSettingsPanel: React.FC<RecentSettingsPanelProps> = ({ changes, onUndo, onClose }) => {
  const formatValueForDisplay = (name: string, value: any) => {
    if (typeof value === 'boolean') {
      return value ? 'Enabled' : 'Disabled';
    }
    
    return value.toString();
  };
  
  if (changes.length === 0) {
    return null;
  }
  
  return (
    <Card className="relative border-dashed animate-fade-in">
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute right-2 top-2" 
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="p-4">
        <div className="flex items-center mb-3">
          <RotateCcw className="h-4 w-4 mr-2 text-muted-foreground" />
          <h3 className="font-medium">Recent Changes</h3>
        </div>
        
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {changes.map((change) => (
              <div key={change.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="text-sm font-medium">{change.category}: {change.name}</p>
                  <div className="flex text-xs text-muted-foreground gap-1">
                    <span>{formatValueForDisplay(change.name, change.oldValue)}</span>
                    <span>→</span>
                    <span className="font-medium">{formatValueForDisplay(change.name, change.newValue)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(change.timestamp, { addSuffix: true })}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onUndo(change.id)}
                  className="h-8"
                >
                  <Undo className="h-3 w-3 mr-1" />
                  <span className="text-xs">Undo</span>
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default RecentSettingsPanel;
