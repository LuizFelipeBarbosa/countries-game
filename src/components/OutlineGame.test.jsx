import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import React from 'react';
import App from '../App';

// Use fake timers for timer-related tests
vi.useFakeTimers();

describe('OutlineGame', () => {
  it('renders the world map outline when the game starts', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /start game/i }));
    expect(screen.getByLabelText(/world map/i)).toBeInTheDocument();
  });

  it('updates score and timer on a valid guess', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /start game/i }));

    const input = screen.getByPlaceholderText('Enter a country name');
    fireEvent.change(input, { target: { value: 'France' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Score should increment after a correct guess
    expect(
      screen.getByText((content, element) => element.textContent === '1/197')
    ).toBeInTheDocument();

    // Timer should tick down
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText(/14:59/)).toBeInTheDocument();
  });

  it('shows an error for invalid guesses and does not change score', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /start game/i }));

    const input = screen.getByPlaceholderText('Enter a country name');
    fireEvent.change(input, { target: { value: 'Atlantis' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(
      screen.getByText(/Atlantis is not a valid country name/i)
    ).toBeInTheDocument();
    // Score should remain zero
    expect(
      screen.getByText((content, element) => element.textContent === '0/197')
    ).toBeInTheDocument();
  });
});
