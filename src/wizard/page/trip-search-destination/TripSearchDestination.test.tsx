import React from 'react';
import { render, screen } from '@testing-library/react';
import TripSearchDestination from './TripSearchDestination';

test('renders learn react link', () => {
  render(<TripSearchDestination />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
