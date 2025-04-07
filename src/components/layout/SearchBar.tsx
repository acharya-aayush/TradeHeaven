
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
        type="search" 
        placeholder="Search TradeHeaven..." 
        className="pl-8 bg-background w-full"
      />
    </div>
  );
};

export default SearchBar;
