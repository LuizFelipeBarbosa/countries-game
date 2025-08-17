import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import React from 'react';
import App from '../App';

// Use fake timers for timer-related tests
vi.useFakeTimers();

describe('OutlineGame', () => {
  it('renders the outline game when starting from the home screen', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /outline quiz/i }));
    expect(
      screen.getByPlaceholderText('Enter a country name')
    ).toBeInTheDocument();
  });

  it('updates score and timer on a valid guess', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /outline quiz/i }));

    const input = screen.getByPlaceholderText('Enter a country name');
    fireEvent.change(input, { target: { value: 'France' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Score should increment after a correct guess
    expect(screen.getByText(/Correct: 1/)).toBeInTheDocument();

    // Timer should tick up
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText(/Time: 0:01/)).toBeInTheDocument();
  });

  it('shows an error for invalid guesses and does not change score', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /outline quiz/i }));

    const input = screen.getByPlaceholderText('Enter a country name');
    fireEvent.change(input, { target: { value: 'Atlantis' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(
      screen.getByText(/Atlantis is not a valid country name/i)
    ).toBeInTheDocument();
    // Score should remain zero
    expect(screen.getByText(/Correct: 0/)).toBeInTheDocument();
  });
});
