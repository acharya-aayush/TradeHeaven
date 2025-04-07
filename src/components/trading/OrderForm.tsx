
import React from 'react';
import OrderFormContainer from './OrderFormContainer';

interface OrderFormProps {
  symbol?: string;
  currentPrice?: number;
  onOrderPlaced?: () => void;
  onClose?: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ 
  symbol = 'NABIL', 
  currentPrice = 985.65,
  onOrderPlaced,
  onClose
}) => {
  return (
    <OrderFormContainer
      symbol={symbol}
      currentPrice={currentPrice}
      onOrderPlaced={onOrderPlaced}
      onClose={onClose}
    />
  );
};

export default OrderForm;
