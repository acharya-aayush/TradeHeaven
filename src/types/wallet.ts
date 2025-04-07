
// Wallet related types

// Wallet structure
export interface WalletData {
  user_id: string;
  balance: number;
  collateral_locked: number;
}

// Context interface
export interface WalletContextType {
  wallet: WalletData | null;
  loading: boolean;
  error: string | null;
  availableBalance: number;
  lockedBalance: number;
  refreshWallet: () => Promise<void>;
  lockCollateral: (amount: number) => Promise<boolean>;
  releaseCollateral: (amount: number) => Promise<boolean>;
  addFunds: (amount: number) => Promise<boolean>;
  removeFunds: (amount: number) => Promise<boolean>;
  isWalletSufficient: (amount: number) => boolean;
}
