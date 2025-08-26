import { render, screen, fireEvent, act, waitFor, within } from '@testing-library/react';
import { vi } from 'vitest';
import React from 'react';
import App from '../App';

// Use fake timers for timer-related tests
vi.useFakeTimers();

describe('OutlineGame', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.restoreAllMocks();
    // Default mock for Math.random to ensure predictability
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /outline quiz/i }));
  });

  it('renders an outline', () => {
    expect(screen.getByRole('img', { name: /country outline/i })).toBeInTheDocument();
  });

  it('shows a hint when the hint button is clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: /hint/i }));
    expect(screen.getByText(/this country is in/i)).toBeInTheDocument();
  });

  it('loads a new country when the skip button is clicked', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.1).mockReturnValueOnce(0.2);

    const outline = screen.getByRole('img', { name: /country outline/i });
    const initialSrc = outline.getAttribute('data');

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /skip/i }));
      vi.advanceTimersByTime(3000);
    });

    const newSrc = outline.getAttribute('data');
    expect(newSrc).not.toBe(initialSrc);
  });

  it('clears the hint when the country changes', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.1).mockReturnValueOnce(0.2);

    fireEvent.click(screen.getByRole('button', { name: /hint/i }));
    expect(screen.getByText(/this country is in/i)).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /skip/i }));
      vi.advanceTimersByTime(10000);
    });

    expect(screen.queryByText(/this country is in/i)).not.toBeInTheDocument();
  });

  it('updates score and timer on a valid guess', () => {
    const input = screen.getByPlaceholderText('Enter a country name');

    act(() => {
      fireEvent.change(input, { target: { value: 'Afghanistan' } });
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      vi.advanceTimersByTime(1000);
    });

    const scoreContainer = screen.getByTestId('score-container');
    expect(scoreContainer).toHaveTextContent(/Correct: 1/);
    expect(scoreContainer).toHaveTextContent(/Time: 0:01/);
  });

  it('shows an error for invalid guesses and does not change score', () => {
    const input = screen.getByPlaceholderText('Enter a country name');

    act(() => {
        fireEvent.change(input, { target: { value: 'Atlantis' } });
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    expect(screen.getByText(/Atlantis is not a valid country name/i)).toBeInTheDocument();
    const scoreContainer = screen.getByTestId('score-container');
    expect(scoreContainer).toHaveTextContent(/Correct: 0/);
  });

  it('allows the user to try again after an incorrect guess', () => {
    const outline = screen.getByRole('img', { name: /country outline/i });
    const initialSrc = outline.getAttribute('data');

    const input = screen.getByPlaceholderText('Enter a country name');
    act(() => {
        fireEvent.change(input, { target: { value: 'Albania' } });
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    expect(screen.getByText(/Albania is not correct/i)).toBeInTheDocument();
    const scoreContainer = screen.getByTestId('score-container');
    expect(scoreContainer).toHaveTextContent(/Correct: 0/);
    expect(
      screen.getByRole('img', { name: /country outline/i }).getAttribute('data')
    ).toBe(initialSrc);

    act(() => {
        fireEvent.change(input, { target: { value: 'Afghanistan' } });
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    expect(scoreContainer).toHaveTextContent(/Correct: 1/);
  });
});
