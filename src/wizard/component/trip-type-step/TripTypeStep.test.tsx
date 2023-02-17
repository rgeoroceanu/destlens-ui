import React from 'react';
import { render, screen } from '@testing-library/react';
import TripTypeStep from './TripTypeStep';

test('renders learn react link', () => {
  render(<TripTypeStep />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
