import React from 'react';
import { render, screen } from '@testing-library/react';
import DestinationStep from './DestinationStep';

test('renders learn react link', () => {
  new DestinationStep({ onDestinationSelect: v => {}}).render();
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
