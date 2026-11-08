export type Region = 'LATAM' | 'GLOBAL';
export type PaymentMethod = 'NatCash' | 'MonCash' | 'BREX Wallet';
export type OrderStatus = 'Pending' | 'Paid' | 'Processing' | 'Completed' | 'Failed' | 'Refunded';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'Diamonds' | 'Membership';
  price: number;
  image: string;
  featured?: boolean;
}

export interface Order {
  id: string;
  reference: string;
  playerId: string;
  region: Region;
  amount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  type: 'Deposit' | 'Withdrawal' | 'Order' | 'Refund';
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  createdAt: string;
  description: string;
}
