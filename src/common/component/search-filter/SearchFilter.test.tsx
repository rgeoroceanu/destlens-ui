import {render, screen} from '@testing-library/react';
import SearchFilter from './SearchFilter';
import React from "react";

test('renders learn react link', () => {
  render(<SearchFilter />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
