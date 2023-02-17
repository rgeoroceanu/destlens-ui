import React from 'react';
import { render, screen } from '@testing-library/react';
import TripSearchTerms from './TripSearchTerms';

test('renders learn react link', () => {
  render(<TripSearchTerms />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
