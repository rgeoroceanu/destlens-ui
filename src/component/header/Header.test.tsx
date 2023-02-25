import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

test('test header', () => {
  render(<Header />);
  const linkElement = screen.getByTestId(/header/i);
  expect(linkElement).toBeInTheDocument();
});
