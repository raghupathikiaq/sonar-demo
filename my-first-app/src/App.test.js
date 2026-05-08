import { render, screen } from '@testing-library/react';
import App from './App';

test('renders hello message', () => {
  render(<App />);
  expect(screen.getByText(/Hello, I am learning React/i)).toBeInTheDocument();
});
test('renders my name', () => {
  render(<App />);
  expect(screen.getByText(/My name is raghu/i)).toBeInTheDocument();
});
test('renders docker message', () => {
  render(<App />);
  expect(screen.getByText(/Running inside Docker/i)).toBeInTheDocument();
});