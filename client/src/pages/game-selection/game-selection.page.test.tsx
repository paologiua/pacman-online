import React from 'react';
import { render, screen } from '@testing-library/react';
import GameSelectionPage from './game-selection.page';

test('renders learn react link', () => {
  render(<GameSelectionPage />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
