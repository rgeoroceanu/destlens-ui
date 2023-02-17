import React from 'react';
import { render, screen } from '@testing-library/react';
import TripSearchTags from './TripSearchTags';

test('renders learn react link', () => {
  render(<TripSearchTags />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
