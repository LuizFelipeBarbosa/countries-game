import { render, screen } from '@testing-library/react';
import EndGameOverlay from './EndGameOverlay';

const mockCountries = [
  { alpha2: 'aa', name: ['Aaa'], continent: 1 },
  { alpha2: 'bb', name: ['Bbb'], continent: 2 },
];

test('groups missed countries by continent', () => {
  render(
    <EndGameOverlay
      missedCountries={mockCountries}
      onPlayAgain={() => {}}
      countriesGuessed={0}
      timeTaken={0}
    />
  );
  expect(screen.getByText(/North America \(1\)/)).toBeInTheDocument();
  expect(screen.getByText(/South America \(1\)/)).toBeInTheDocument();
});
