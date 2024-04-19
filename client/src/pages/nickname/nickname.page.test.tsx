import React from 'react';
import { render, screen } from '@testing-library/react';
import NicknamePage from './nickname.page';

test('renders learn react link', () => {
  render(<NicknamePage />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
