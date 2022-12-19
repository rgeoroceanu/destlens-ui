import React from 'react';
import { render, screen } from '@testing-library/react';
import TermsStep from './TermsStep';

test('renders learn react link', () => {
  render(<TermsStep />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
