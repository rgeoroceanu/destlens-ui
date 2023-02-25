import {screen} from '@testing-library/react';
import SearchResults from './SearchResults';

test('renders learn react link', () => {
  new SearchResults({ results: []}).render();
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
