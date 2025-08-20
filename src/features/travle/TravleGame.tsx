import React, { useState, useEffect, useMemo } from 'react';
import { buildAdjacencyMap, getDistances, bfs } from '../../lib/graph';
import allCountries from '../../data/countries.json';
import aliases from '../../data/aliases.json';
import GuessInput from './GuessInput';
import Hud from './Hud';
import MapView from './MapView';
import './TravleGame.css';

// Modal component remains the same
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    zIndex: 1000,
    border: '1px solid black',
    borderRadius: '8px',
    textAlign: 'center',
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={modalStyle}>
        {children}
        <button onClick={onClose} style={{ marginTop: '20px' }}>Close</button>
      </div>
    </>
  );
};

type GameState = {
  start: string;
  end: string;
  guesses: string[];
  rejects: string[];
  remaining: number;
  shortest: number;
  status: 'playing' | 'won' | 'lost';
  settings: {
    INCLUDE_CROSSINGS: boolean;
  };
};

// A simple seeded PRNG
const mulberry32 = (a: number) => {
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

const generatePuzzle = (seed?: number) => {
  const adjMap = buildAdjacencyMap(true);
  const countryCodes = Object.keys(adjMap);
  const rng = seed ? mulberry32(seed) : () => Math.random();

  let start: string, end: string, shortestPath: number;

  do {
    start = countryCodes[Math.floor(rng() * countryCodes.length)];
    const distances = getDistances(adjMap, start);
    const possibleEnds = Object.keys(distances).filter(
      (iso) => distances[iso] >= 3 && distances[iso] <= 9
    );

    if (possibleEnds.length > 0) {
      end = possibleEnds[Math.floor(rng() * possibleEnds.length)];
      shortestPath = distances[end];
      return { start, end, shortestPath };
    }
  } while (true);
};


const TravleGame = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [ariaLiveMessage, setAriaLiveMessage] = useState('');

  const adjacencyMap = useMemo(() => {
    if (!gameState) return {};
    return buildAdjacencyMap(gameState.settings.INCLUDE_CROSSINGS);
  }, [gameState?.settings.INCLUDE_CROSSINGS]);

  const distStart = useMemo(() => {
    if (!gameState) return {};
    return getDistances(adjacencyMap, gameState.start);
  }, [adjacencyMap, gameState?.start]);

  const distEnd = useMemo(() => {
    if (!gameState) return {};
    return getDistances(adjacencyMap, gameState.end);
  }, [adjacencyMap, gameState?.end]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const lastPlayed = localStorage.getItem('travleLastPlayed');
    const savedState = localStorage.getItem('travleGameState');

    if (lastPlayed === today && savedState) {
      setGameState(JSON.parse(savedState));
    } else {
      const seed = new Date().setHours(0, 0, 0, 0);
      const { start, end, shortestPath } = generatePuzzle(seed);

      const newState: GameState = {
        start,
        end,
        guesses: [start],
        rejects: [],
        remaining: shortestPath + 4,
        shortest: shortestPath,
        status: 'playing',
        settings: {
          INCLUDE_CROSSINGS: true,
        },
      };
      setGameState(newState);
      localStorage.setItem('travleLastPlayed', today);
    }
  }, []);

  useEffect(() => {
    if (gameState) {
      localStorage.setItem('travleGameState', JSON.stringify(gameState));
    }
  }, [gameState]);

  const handleGuess = (guess: string) => {
    if (!gameState || gameState.status !== 'playing') return;

    const lastGuess = gameState.guesses[gameState.guesses.length - 1];
    const normalizedGuess = guess.trim().toLowerCase();

    let guessISO = null;
    for (const iso in aliases) {
        const countryAliases = aliases[iso as keyof typeof aliases].map(a => a.toLowerCase());
        if (countryAliases.includes(normalizedGuess)) {
            guessISO = iso;
            break;
        }
    }

    if (!guessISO || !adjacencyMap[lastGuess].includes(guessISO)) {
      setAriaLiveMessage(`Invalid guess: ${guess}. Try a neighboring country.`);
      setGameState(prev => prev ? {...prev, rejects: [...prev.rejects, guess]} : null);
      return;
    }

    if (gameState.guesses.includes(guessISO)) {
        setAriaLiveMessage(`${guess} has already been guessed.`);
        return;
    }

    setAriaLiveMessage(`Successfully moved to ${guess}.`);
    const newGuesses = [...gameState.guesses, guessISO];
    const remaining = gameState.remaining - 1;
    let status = gameState.status;

    if (guessISO === gameState.end) {
      status = 'won';
      setModalOpen(true);
    } else if (remaining === 0) {
      status = 'lost';
      setModalOpen(true);
    }

    setGameState(prev => prev ? {
      ...prev,
      guesses: newGuesses,
      remaining,
      status,
    } : null);
  };

  const handleShare = () => {
    if (!gameState) return;
    const text = `I solved today's Travle in ${gameState.guesses.length - 1} moves! ${gameState.start.toUpperCase()} -> ${gameState.end.toUpperCase()}\n\n${gameState.guesses.join(' -> ')}`;
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied results to clipboard!');
    });
  };

  if (!gameState) {
    return <div>Loading...</div>;
  }

  return (
    <div className="travle-game">
      <div
        className="visually-hidden"
        role="status"
        aria-live="assertive"
        aria-atomic="true"
      >
        {ariaLiveMessage}
      </div>
      <h1>TRAVLE</h1>
      <Hud
        path={gameState.guesses}
        remaining={gameState.remaining}
        shortest={gameState.shortest}
      />
      <div className="map-container">
        <MapView
          guesses={gameState.guesses}
          start={gameState.start}
          end={gameState.end}
          shortest={gameState.shortest}
          distStart={distStart}
          distEnd={distEnd}
         />
      </div>
      {gameState.status === 'playing' && <GuessInput onGuess={handleGuess} />}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        {gameState.status === 'won' && (
          <div>
            <h2>Congratulations!</h2>
            <p>You reached the destination in {gameState.guesses.length - 1} moves.</p>
            <p>Your path: {gameState.guesses.join(' -> ')}</p>
            <button onClick={handleShare}>Share</button>
          </div>
        )}
        {gameState.status === 'lost' && (
          <div>
            <h2>Game Over</h2>
            <p>You ran out of guesses.</p>
            <p>The shortest path was {gameState.shortest} moves.</p>
            <p>A possible path was: {
                bfs(adjacencyMap, gameState.start, gameState.end).path.join(' -> ')
            }</p>
            <button onClick={handleShare}>Share</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TravleGame;
