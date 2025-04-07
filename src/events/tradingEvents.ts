
import { Subject } from 'rxjs';

export interface TradeExecutedEvent {
  symbol: string;
  quantity: number;
  price: number;
  side: 'buy' | 'sell';
  timestamp: string;
  orderId: string;
  total: number;
}

export interface TradingEvents {
  tradeExecuted: TradeExecutedEvent;
}

// Create a subject for each event type
export const tradingEvents = {
  tradeExecuted: new Subject<TradeExecutedEvent>()
};

// Helper functions to emit events
export const emitTradeExecuted = (event: TradeExecutedEvent) => {
  console.log('Trade executed event emitted:', event);
  tradingEvents.tradeExecuted.next(event);
};
