
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Watchlist } from '@/services/watchlistService';
import WatchlistSettings from '@/components/watchlist/WatchlistSettings';
import StockSearch from '@/components/watchlist/StockSearch';

interface WatchlistHeaderProps {
  watchlists: Watchlist[];
  activeWatchlist: Watchlist | null;
  setActiveWatchlistById: (id: string) => void;
  handleCreateWatchlist: (name: string) => Promise<any>;
  handleUpdateWatchlist: (id: string, name: string) => Promise<any>;
  handleDeleteWatchlist: (id: string) => Promise<void>;
  handleAddStock: (watchlistId: string, symbol: string) => Promise<void>;
}

const WatchlistHeader: React.FC<WatchlistHeaderProps> = ({
  watchlists,
  activeWatchlist,
  setActiveWatchlistById,
  handleCreateWatchlist,
  handleUpdateWatchlist,
  handleDeleteWatchlist,
  handleAddStock
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <div className="flex items-center gap-4">
        <div className="text-lg font-medium">Watchlists</div>
        <Tabs 
          value={activeWatchlist?.watchlist_id} 
          onValueChange={setActiveWatchlistById}
        >
          <TabsList>
            {watchlists.map(watchlist => (
              <TabsTrigger key={watchlist.watchlist_id} value={watchlist.watchlist_id}>
                {watchlist.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex gap-2">
        <WatchlistSettings 
          watchlists={watchlists}
          activeWatchlistId={activeWatchlist?.watchlist_id || ''}
          onCreateWatchlist={handleCreateWatchlist}
          onUpdateWatchlist={handleUpdateWatchlist}
          onDeleteWatchlist={handleDeleteWatchlist}
        />
        
        <StockSearch 
          onAddStock={(symbol) => {
            if (activeWatchlist) {
              return handleAddStock(activeWatchlist.watchlist_id, symbol);
            }
            return Promise.reject('No active watchlist');
          }}
        />
      </div>
    </div>
  );
};

export default WatchlistHeader;
