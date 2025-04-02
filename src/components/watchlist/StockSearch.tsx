
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search } from 'lucide-react';
import { stocksData } from '@/lib/data/mockData';
import { ScrollArea } from "@/components/ui/scroll-area";

interface StockSearchProps {
  onAddStock: (symbol: string) => Promise<void>;
}

const StockSearch: React.FC<StockSearchProps> = ({ onAddStock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const filteredStocks = searchTerm.trim() === '' 
    ? stocksData.slice(0, 10) // Show first 10 stocks by default
    : stocksData.filter(stock => 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const handleAddStock = async (symbol: string) => {
    setIsSubmitting(true);
    try {
      await onAddStock(symbol);
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <Plus className="h-4 w-4" />
          <span>Add Stock</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Stock to Watchlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by symbol or company name"
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <ScrollArea className="h-56 rounded-md border">
            <div className="p-4 space-y-2">
              {filteredStocks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No stocks found</p>
              ) : (
                filteredStocks.map((stock) => (
                  <div 
                    key={stock.symbol} 
                    className="flex items-center justify-between p-2 rounded-md hover:bg-accent"
                  >
                    <span className="flex-grow">
                      <span className="font-medium">{stock.symbol}</span>
                      <span className="ml-2 text-sm text-muted-foreground">{stock.name}</span>
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAddStock(stock.symbol)}
                      disabled={isSubmitting}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StockSearch;
