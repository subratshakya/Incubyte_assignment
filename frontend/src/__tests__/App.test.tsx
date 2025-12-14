import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

test('renders app without crashing', () => {
  render(<App />);
});

