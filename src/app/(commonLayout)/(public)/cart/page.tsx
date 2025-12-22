import { Metadata } from 'next';
import CartClient from './CartClient';

export const metadata: Metadata = {
  title: 'Shopping Cart - Tourify',
  description: 'Review your selected tours and checkout.',
};

export default function CartPage() {
  return <CartClient />;
}
