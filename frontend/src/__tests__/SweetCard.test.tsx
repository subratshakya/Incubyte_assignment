import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SweetCard from '../components/SweetCard';
import { Sweet } from '../services/api';

const mockSweet: Sweet = {
  id: 1,
  name: 'Test Sweet',
  category: 'Chocolate',
  price: 2.50,
  quantity: 10,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

test('renders sweet card with correct information', () => {
  const mockPurchase = jest.fn();
  render(<SweetCard sweet={mockSweet} onPurchase={mockPurchase} />);

  expect(screen.getByText('Test Sweet')).toBeInTheDocument();
  expect(screen.getByText('Chocolate')).toBeInTheDocument();
  expect(screen.getByText('$2.50')).toBeInTheDocument();
  expect(screen.getByText('Stock: 10')).toBeInTheDocument();
});

test('disables purchase button when out of stock', () => {
  const outOfStockSweet = { ...mockSweet, quantity: 0 };
  const mockPurchase = jest.fn();
  render(<SweetCard sweet={outOfStockSweet} onPurchase={mockPurchase} />);

  const button = screen.getByText('Out of Stock');
  expect(button).toBeDisabled();
});

test('calls onPurchase when purchase button is clicked', () => {
  const mockPurchase = jest.fn();
  render(<SweetCard sweet={mockSweet} onPurchase={mockPurchase} />);

  const purchaseButton = screen.getByText('Purchase');
  fireEvent.click(purchaseButton);

  expect(mockPurchase).toHaveBeenCalledWith(1, 1);
});

