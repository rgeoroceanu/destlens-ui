import React from 'react';
import { render, screen } from '@testing-library/react';
import TripSearchHistory from './TripSearchHistory';

test('renders learn react link', () => {
  render(<TripSearchHistory />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
