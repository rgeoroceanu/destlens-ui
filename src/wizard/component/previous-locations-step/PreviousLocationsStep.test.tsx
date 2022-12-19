import React from 'react';
import { render, screen } from '@testing-library/react';
import PreviousLocationsStep from './PreviousLocationsStep';

test('renders learn react link', () => {
  render(<PreviousLocationsStep />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
