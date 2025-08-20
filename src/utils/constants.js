import { Upload, Package, CheckCircle, Eye, CreditCard, TrendingUp, Clock } from 'lucide-react';

export const STATUSES = [
  { key: 'Pending Receiving', title: 'Pending Receiving', icon: Upload, color: 'bg-gray-500' },
  { key: 'Received', title: 'Received', icon: Package, color: 'bg-blue-500' },
  { key: 'Authenticated', title: 'Authenticated', icon: CheckCircle, color: 'bg-yellow-500' },
  { key: 'Checked', title: 'Checked', icon: Eye, color: 'bg-purple-500' },
  { key: 'Processed', title: 'Processed', icon: CreditCard, color: 'bg-green-500' },
  { key: 'Recently Done', title: 'Recently Done', icon: TrendingUp, color: 'bg-emerald-500' },
  { key: 'Still Waiting to Pick Up Check', title: 'Waiting for Pickup', icon: Clock, color: 'bg-red-500' }
];

export const GAMES = ['Magic: The Gathering', 'Pokemon', 'Lorcana'];
export const CONDITIONS = ['Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played', 'Damaged'];

export const RARITIES = {
  'Magic: The Gathering': ['Common', 'Uncommon', 'Rare', 'Mythic Rare'],
  'Pokemon': ['Common', 'Uncommon', 'Rare', 'Holo Rare', 'Ultra Rare'],
  'Lorcana': ['Common', 'Uncommon', 'Rare', 'Super Rare', 'Legendary', 'Enchanted']
};