
import React, { useState, useRef, useEffect } from 'react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SettingsSearchProps {
  setSearchQuery: (query: string) => void;
}

const SettingsSearch: React.FC<SettingsSearchProps> = ({ setSearchQuery }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
    setOpen(false);
  };

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-10 px-0 md:w-auto md:px-2">
          <Search className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Search</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <form onSubmit={handleSearch} className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search settings..."
            className="flex h-10 w-full rounded-md border-0 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </form>
        <div className="p-2">
          <p className="text-xs text-muted-foreground py-2 px-2">
            {query ? 'Type to search settings' : 'Recent searches'}
          </p>
          <div className="mt-2">
            {!query && (
              <div className="text-center py-6 text-sm text-muted-foreground">
                No recent searches
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SettingsSearch;
