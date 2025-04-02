
import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StockData } from '@/lib/data/mockData';
import { Bell, Trash2, TrendingUp, TrendingDown, GripVertical } from 'lucide-react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  stock: StockData;
  onSelectStock: (stock: StockData) => void;
  onAddAlert: (e: React.MouseEvent, symbol: string) => void;
  onRemoveStock: (e: React.MouseEvent, symbol: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ 
  id, 
  stock, 
  onSelectStock, 
  onAddAlert, 
  onRemoveStock 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0
  };

  const isPositive = stock.change >= 0;

  return (
    <TableRow 
      ref={setNodeRef} 
      style={style}
      className="cursor-pointer hover:bg-accent"
      onClick={() => onSelectStock(stock)}
    >
      <TableCell className="w-10">
        <div 
          className="cursor-grab px-1 py-2 text-muted-foreground hover:text-foreground" 
          {...attributes} 
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </TableCell>
      <TableCell className="font-medium">{stock.symbol}</TableCell>
      <TableCell className="max-w-40 truncate">{stock.name}</TableCell>
      <TableCell className="font-mono">${stock.price.toFixed(2)}</TableCell>
      <TableCell>
        <div className={`flex items-center ${
          isPositive ? 'text-market-up' : 'text-market-down'
        }`}>
          {isPositive ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          <span>
            {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              onAddAlert(e, stock.symbol);
            }}
          >
            <Bell className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              onRemoveStock(e, stock.symbol);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

interface DraggableWatchlistTableProps {
  stocks: StockData[];
  onSelectStock: (stock: StockData) => void;
  onReorderStocks: (symbols: string[]) => void;
  onAddAlert: (symbol: string) => void;
  onRemoveStock: (symbol: string) => void;
}

const DraggableWatchlistTable: React.FC<DraggableWatchlistTableProps> = ({
  stocks,
  onSelectStock,
  onReorderStocks,
  onAddAlert,
  onRemoveStock
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = stocks.findIndex(s => s.symbol === active.id);
      const newIndex = stocks.findIndex(s => s.symbol === over.id);
      
      const newOrder = arrayMove(stocks, oldIndex, newIndex);
      onReorderStocks(newOrder.map(stock => stock.symbol));
    }
  };

  const handleAddAlert = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    onAddAlert(symbol);
  };

  const handleRemoveStock = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    onRemoveStock(symbol);
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Change</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <TableBody>
            <SortableContext 
              items={stocks.map(stock => stock.symbol)} 
              strategy={verticalListSortingStrategy}
            >
              {stocks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No stocks in this watchlist
                  </TableCell>
                </TableRow>
              ) : (
                stocks.map((stock) => (
                  <SortableItem
                    key={stock.symbol}
                    id={stock.symbol}
                    stock={stock}
                    onSelectStock={onSelectStock}
                    onAddAlert={handleAddAlert}
                    onRemoveStock={handleRemoveStock}
                  />
                ))
              )}
            </SortableContext>
          </TableBody>
        </DndContext>
      </Table>
    </div>
  );
};

export default DraggableWatchlistTable;
