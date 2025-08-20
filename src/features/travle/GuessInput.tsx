import React, { useState } from 'react';
import aliases from '../../data/aliases.json';

interface GuessInputProps {
  onGuess: (guess: string) => void;
}

const GuessInput: React.FC<GuessInputProps> = ({ onGuess }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 1) {
      const allCountryNames = Object.values(aliases).flat();
      const filteredSuggestions = allCountryNames.filter(name =>
        name.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onGuess(inputValue.trim());
      setInputValue('');
      setSuggestions([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="guess-input">
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter a country"
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.slice(0, 5).map(suggestion => (
              <li
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button type="submit">Guess</button>
    </form>
  );
};

export default GuessInput;
