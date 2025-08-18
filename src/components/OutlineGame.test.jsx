import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import React from 'react';
import App from '../App';

// Use fake timers for timer-related tests
vi.useFakeTimers();

describe('OutlineGame', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders an outline', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /outline quiz/i }));
    expect(screen.getByRole('img', { name: /country outline/i })).toBeInTheDocument();
  });

  it('shows a hint when the hint button is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /outline quiz/i }));
    fireEvent.click(screen.getByRole('button', { name: /hint/i }));
    expect(screen.getByText(/this country is in/i)).toBeInTheDocument();
  });

  it('loads a new country when the skip button is clicked', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.1);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /outline quiz/i }));
    const outline = screen.getByRole('img', { name: /country outline/i });
    const initialSrc = outline.getAttribute('data');
    fireEvent.click(screen.getByRole('button', { name: /skip/i }));
    const newSrc = outline.getAttribute('data');
    expect(newSrc).not.toBe(initialSrc);
  });

  it('updates score and timer on a valid guess', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /outline quiz/i }));

    const input = screen.getByPlaceholderText('Enter a country name');
    fireEvent.change(input, { target: { value: 'Afghanistan' } });
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

  it('allows the user to try again after an incorrect guess', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /outline quiz/i }));

    const outline = screen.getByRole('img', { name: /country outline/i });
    const initialSrc = outline.getAttribute('data');

    const input = screen.getByPlaceholderText('Enter a country name');
    fireEvent.change(input, { target: { value: 'Albania' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/Albania is not correct/i)).toBeInTheDocument();
    // Score should remain zero
    expect(screen.getByText(/Correct: 0/)).toBeInTheDocument();
    // Outline should remain the same after a wrong guess
    expect(
      screen.getByRole('img', { name: /country outline/i }).getAttribute('data')
    ).toBe(initialSrc);

    fireEvent.change(input, { target: { value: 'Afghanistan' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/Correct: 1/)).toBeInTheDocument();
  });
});
