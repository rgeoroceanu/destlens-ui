import React from 'react';
import { render, screen } from '@testing-library/react';
import TripTermsStep from './TripTermsStep';

test('renders learn react link', () => {
  render(<TripTermsStep />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
