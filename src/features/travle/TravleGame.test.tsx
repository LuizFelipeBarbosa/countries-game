import { render, screen, waitFor } from '@testing-library/react';
import TravleGame from './TravleGame';
import React from 'react';
import { describe, it, expect } from 'vitest';
import { act } from 'react';

describe('TravleGame', () => {
  it('renders the game', async () => {
    await act(async () => {
        render(<TravleGame />);
    });
    await waitFor(() => {
            expect(screen.getByText('TRAVLE')).toBeInTheDocument();
    });
  });
});
