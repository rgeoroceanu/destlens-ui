import React from 'react';
import { render, screen } from '@testing-library/react';
import TripTagsStep from './TripTagsStep';

test('renders learn react link', () => {
  render(<TripTagsStep />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
