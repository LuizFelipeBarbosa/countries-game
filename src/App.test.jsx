import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';
import React from 'react';

// Mock the timer functions
vi.useFakeTimers();

describe('App', () => {
  it('starts the game when the start button is clicked', () => {
    render(<App />);
    const startButton = screen.getByRole('button', { name: /start game/i });
    fireEvent.click(startButton);
    expect(screen.getByPlaceholderText('Enter a country name')).toBeInTheDocument();
  });

  it('handles a correct country guess', () => {
    render(<App />);
    const startButton = screen.getByRole('button', { name: /start game/i });
    fireEvent.click(startButton);

    const input = screen.getByPlaceholderText('Enter a country name');
    fireEvent.change(input, { target: { value: 'France' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/Correct! France added./i)).toBeInTheDocument();
  });

  it('handles an incorrect country guess', () => {
    render(<App />);
    const startButton = screen.getByRole('button', { name: /start game/i });
    fireEvent.click(startButton);

    const input = screen.getByPlaceholderText('Enter a country name');
    fireEvent.change(input, { target: { value: 'Invalid Country' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/Invalid Country is not a valid country name./i)).toBeInTheDocument();
  });

  it('handles a duplicate country guess', () => {
    render(<App />);
    const startButton = screen.getByRole('button', { name: /start game/i });
    fireEvent.click(startButton);

    const input = screen.getByPlaceholderText('Enter a country name');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(input, { target: { value: 'France' } });
    fireEvent.click(submitButton);

    fireEvent.change(input, { target: { value: 'France' } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/You've already guessed France!/i)).toBeInTheDocument();
  });

  it('ends the game when the timer runs out', () => {
    render(<App />);
    const startButton = screen.getByRole('button', { name: /start game/i });
    fireEvent.click(startButton);

    // Fast-forward time by 15 minutes
    act(() => {
      vi.advanceTimersByTime(15 * 60 * 1000);
    });

    expect(screen.getByText(/Play Again/i)).toBeInTheDocument();
  });
});
