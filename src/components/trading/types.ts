
export interface OrderFormProps {
  symbol?: string;
  currentPrice?: number;
  onOrderPlaced?: () => void;
  onClose?: () => void;
}

export interface OrderFormContentProps extends OrderFormProps {
  side: 'buy' | 'sell';
}

export interface TradeExecutionProps {
  symbol: string;
  quantity: number;
  price: number;
  side: 'buy' | 'sell';
  total: number;
  onExecuted?: () => void;
}
