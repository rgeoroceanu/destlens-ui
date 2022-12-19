import React from 'react';
import { render, screen } from '@testing-library/react';
import TripSearchWizard from './TripSearchWizard';

test('renders learn react link', () => {
  render(<TripSearchWizard />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
