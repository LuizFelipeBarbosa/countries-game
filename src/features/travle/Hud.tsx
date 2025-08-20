import React from 'react';
import aliases from '../../data/aliases.json';

interface HudProps {
  path: string[];
  remaining: number;
  shortest: number;
}

const getCountryName = (iso: string) => {
    return aliases[iso as keyof typeof aliases]?.[0] || iso;
}

const Hud: React.FC<HudProps> = ({ path, remaining, shortest }) => {
  return (
    <div className="hud">
      <div>
        <strong>Path:</strong> {path.map(getCountryName).join(' → ')}
      </div>
      <div>
        <strong>Guesses Remaining:</strong> {remaining}
      </div>
      <div>
        <strong>Shortest Path:</strong> {shortest}
      </div>
      <div>
        <strong>Legend:</strong>
        <span style={{ color: 'green' }}> ✔ Green: On shortest path</span>
        <span style={{ color: 'orange' }}> ~ Orange: Valid neighbor, but not on shortest path</span>
        <span style={{ color: 'red' }}> ✖ Red: Invalid guess</span>
      </div>
    </div>
  );
};

export default Hud;
