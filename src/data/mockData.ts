import type { Order, PaymentMethod, Product, WalletTransaction } from '../types';

export const productCatalog: Product[] = [
  {
    id: 'diamond-110',
    name: '110 Diamonds',
    description: 'Parfait pour compléter une petite recharge rapide.',
    category: 'Diamonds',
    price: 150,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
    featured: true,
  },
  {
    id: 'diamond-220',
    name: '220 Diamonds',
    description: 'Rechargement idéal pour des achats réguliers.',
    category: 'Diamonds',
    price: 300,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
    featured: true,
  },
  {
    id: 'diamond-341',
    name: '341 Diamonds',
    description: 'Pack équilibré pour les joueurs actifs.',
    category: 'Diamonds',
    price: 450,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'diamond-572',
    name: '572 Diamonds',
    description: 'Livraison rapide pour un bon niveau de progression.',
    category: 'Diamonds',
    price: 750,
    image: 'https://images.unsplash.com/photo-1526509867162-5d0d3e16f1a7?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'diamond-1166',
    name: '1 166 Diamonds',
    description: 'Valeur premium pour les joueurs intensifs.',
    category: 'Diamonds',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'diamond-2398',
    name: '2 398 Diamonds',
    description: 'Pack de luxe pour un maximum de flexibilité.',
    category: 'Diamonds',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'diamond-6160',
    name: '6 160 Diamonds',
    description: 'Recharge premium, parfaite pour les gros achats.',
    category: 'Diamonds',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1526509867162-5d0d3e16f1a7?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'membership-weekly',
    name: 'Weekly Membership',
    description: 'Abonnement hebdomadaire avec bonus réguliers.',
    category: 'Membership',
    price: 250,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'membership-monthly',
    name: 'Monthly Membership',
    description: 'Abonnement mensuel pour un accès complet.',
    category: 'Membership',
    price: 850,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'membership-level-up',
    name: 'Level Up Pass',
    description: 'Pass premium pour accélérer le niveau et les récompenses.',
    category: 'Membership',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1526509867162-5d0d3e16f1a7?auto=format&fit=crop&w=900&q=80',
  },
];

export const paymentMethods: PaymentMethod[] = ['NatCash', 'MonCash', 'BREX Wallet'];

export const featuredPromos = [
  { title: 'Promo Flash', text: 'Réduction spéciale sur les packs 110 et 220 Diamonds.', tone: 'red' },
  { title: 'Membership + Bonus', text: 'Une semaine d’avantage sur les abonnements mensuels.', tone: 'blue' },
  { title: 'Paiement local', text: 'NatCash et MonCash acceptés avec confirmation rapide.', tone: 'slate' },
];

export const faqs = [
  { q: 'Comment puis-je acheter ?', a: 'Choisissez un produit, entrez votre Player ID, sélectionnez votre région, choisissez un moyen de paiement puis confirmez la commande.' },
  { q: 'Combien de temps la livraison prend-elle ?', a: 'En règle générale, la livraison est traitée rapidement. Les délais peuvent varier selon la région et le fournisseur API.' },
  { q: 'Puis-je payer avec le portefeuille ?', a: 'Oui, le portefeuille BREX TOP UP est disponible pour les dépôts vérifiés et les paiements de commandes.' },
  { q: 'Est-ce que les dépôts sont vérifiés ?', a: 'Oui. Les dépôts passent par un processus de vérification avant d’être crédités sur le solde.' },
];

export const customerOrders: Order[] = [
  {
    id: 'ORD-1001',
    reference: 'BTU-1001',
    playerId: '123456789',
    region: 'LATAM',
    amount: 150,
    status: 'Completed',
    paymentMethod: 'NatCash',
    createdAt: '2026-11-08',
  },
  {
    id: 'ORD-1002',
    reference: 'BTU-1002',
    playerId: '987654321',
    region: 'GLOBAL',
    amount: 450,
    status: 'Processing',
    paymentMethod: 'MonCash',
    createdAt: '2026-11-08',
  },
  {
    id: 'ORD-1003',
    reference: 'BTU-1003',
    playerId: '456321789',
    region: 'LATAM',
    amount: 750,
    status: 'Pending',
    paymentMethod: 'BREX Wallet',
    createdAt: '2026-11-08',
  },
];

export const walletTransactions: WalletTransaction[] = [
  {
    id: 'TXN-2001',
    type: 'Deposit',
    amount: 1000,
    status: 'Approved',
    createdAt: '2026-11-07',
    description: 'Dépôt NatCash vérifié',
  },
  {
    id: 'TXN-2002',
    type: 'Order',
    amount: -300,
    status: 'Completed',
    createdAt: '2026-11-08',
    description: 'Achat 220 Diamonds',
  },
  {
    id: 'TXN-2003',
    type: 'Deposit',
    amount: 500,
    status: 'Pending',
    createdAt: '2026-11-08',
    description: 'Preuve de paiement MonCash en attente',
  },
  {
    id: 'TXN-2004',
    type: 'Refund',
    amount: 150,
    status: 'Completed',
    createdAt: '2026-11-06',
    description: 'Remboursement de commande annulée',
  },
];

export const adminStats = {
  totalCustomers: 1842,
  totalOrders: 2494,
  totalSales: 1245600,
  estimatedRevenue: 945000,
  estimatedProfit: 286100,
  pendingDeposits: 17,
  pendingOrders: 24,
  completedOrders: 1410,
};

export const paymentInfo = [
  { label: 'Nom du bénéficiaire', value: 'BREX TOP UP HAITI' },
  { label: 'NatCash', value: '+509 35 55 66 77' },
  { label: 'MonCash', value: '+509 44 22 11 00' },
  { label: 'Compte portable', value: 'BREX Wallet HTG' },
];

export const resellerStats = {
  availableBalance: 20850,
  monthlySales: 54200,
  activeOrders: 7,
  satisfaction: 98.4,
};
