import React from 'react';
import { render, screen } from '@testing-library/react';
import PlayersListPage from './players-list.page';

test('renders learn react link', () => {
  render(<PlayersListPage />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
