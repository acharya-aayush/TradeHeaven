import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import { Watchlist } from '@/services/watchlistService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WatchlistSettingsProps {
  watchlists: Watchlist[];
  activeWatchlistId: string;
  onCreateWatchlist: (name: string) => Promise<any>;
  onUpdateWatchlist: (id: string, name: string) => Promise<any>;
  onDeleteWatchlist: (id: string) => Promise<void>;
}

const WatchlistSettings: React.FC<WatchlistSettingsProps> = ({
  watchlists,
  activeWatchlistId,
  onCreateWatchlist,
  onUpdateWatchlist,
  onDeleteWatchlist
}) => {
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editWatchlistId, setEditWatchlistId] = useState<string | null>(null);
  const [editWatchlistName, setEditWatchlistName] = useState('');
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWatchlistName.trim()) return;
    
    setIsCreateLoading(true);
    try {
      await onCreateWatchlist(newWatchlistName);
      setNewWatchlistName('');
    } finally {
      setIsCreateLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editWatchlistId || !editWatchlistName.trim()) return;
    
    setIsUpdateLoading(true);
    try {
      await onUpdateWatchlist(editWatchlistId, editWatchlistName);
      setEditMode(false);
      setEditWatchlistId(null);
      setEditWatchlistName('');
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    setIsDeleteLoading(true);
    try {
      await onDeleteWatchlist(id);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const startEdit = (watchlist: Watchlist) => {
    setEditMode(true);
    setEditWatchlistId(watchlist.watchlist_id);
    setEditWatchlistName(watchlist.name);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Edit className="h-4 w-4" />
          <span>Edit Lists</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Watchlists</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {/* Create new watchlist */}
          <form onSubmit={handleCreateSubmit} className="space-y-2">
            <Label htmlFor="watchlist-name">Create New Watchlist</Label>
            <div className="flex gap-2">
              <Input
                id="watchlist-name"
                value={newWatchlistName}
                onChange={(e) => setNewWatchlistName(e.target.value)}
                placeholder="Enter watchlist name"
                className="flex-grow"
              />
              <Button type="submit" disabled={isCreateLoading || !newWatchlistName.trim()}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </form>

          {/* Existing watchlists */}
          <div>
            <Label>Your Watchlists</Label>
            <ScrollArea className="h-56 mt-2 rounded-md border">
              <div className="p-4 space-y-2">
                {watchlists.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No watchlists found</p>
                ) : (
                  watchlists.map((watchlist) => (
                    <div 
                      key={watchlist.watchlist_id} 
                      className="flex items-center justify-between p-2 rounded-md hover:bg-accent"
                    >
                      {editMode && editWatchlistId === watchlist.watchlist_id ? (
                        <form onSubmit={handleEditSubmit} className="flex-grow flex gap-2">
                          <Input
                            value={editWatchlistName}
                            onChange={(e) => setEditWatchlistName(e.target.value)}
                            className="h-8"
                            autoFocus
                          />
                          <Button 
                            type="submit" 
                            size="sm"
                            disabled={isUpdateLoading || !editWatchlistName.trim()}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditMode(false);
                              setEditWatchlistId(null);
                            }}
                          >
                            Cancel
                          </Button>
                        </form>
                      ) : (
                        <>
                          <span className="flex-grow">
                            {watchlist.name}
                            {watchlist.is_default && (
                              <span className="text-xs text-muted-foreground ml-2">(Default)</span>
                            )}
                            {watchlist.watchlist_id === activeWatchlistId && (
                              <span className="text-xs text-blue-500 ml-2">(Active)</span>
                            )}
                          </span>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => startEdit(watchlist)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            {!watchlist.is_default && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Watchlist</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete the "{watchlist.name}" watchlist? 
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteConfirm(watchlist.watchlist_id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WatchlistSettings;
