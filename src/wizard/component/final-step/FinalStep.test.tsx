import React from 'react';
import {screen} from '@testing-library/react';
import FinalStep from './FinalStep';

test('renders learn react link', () => {
  new FinalStep({ onStartSearch: () => {}}).render();
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
