import React from 'react';
import {screen} from '@testing-library/react';
import SearchResult from './SearchResult';

test('renders learn react link', () => {
  new SearchResult({ matches: []}).render();
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
