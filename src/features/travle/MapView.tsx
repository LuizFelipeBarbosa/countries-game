import React from 'react';
import { ReactSVGPanZoom, INITIAL_VALUE } from 'react-svg-pan-zoom';
import { ReactComponent as WorldMap } from '../../assets/map.svg?react';
import { getMapStyles } from './map-view.utils';
import countries from '../../data/countries.json';

interface MapViewProps {
  guesses: string[];
  start: string;
  end: string;
  shortest: number;
  distStart: Record<string, number>;
  distEnd: Record<string, number>;
}

const MapView: React.FC<MapViewProps> = ({
  guesses,
  start,
  end,
  shortest,
  distStart,
  distEnd,
}) => {
  const [value, setValue] = React.useState(INITIAL_VALUE);
  const Viewer = React.useRef(null);

  const styles = React.useMemo(() => {
    const colorEntries: [string, string][] = countries.map(country => {
      const code = country.alpha3;
      if (code === start || code === end) {
        return [code, 'blue'];
      }
      if (guesses.includes(code)) {
        if (distStart[code] + distEnd[code] === shortest) {
          return [code, 'green'];
        }
        return [code, 'orange'];
      }
      return [code, '#666']; // Default color for un-guessed countries
    });

    return getMapStyles(...colorEntries);
  }, [guesses, start, end, shortest, distStart, distEnd]);

  return (
    <div style={{ width: '100%', height: '500px', border: '1px solid black' }}>
      <style>{styles}</style>
      <ReactSVGPanZoom
        width={500}
        height={500}
        ref={Viewer}
        value={value}
        onChangeValue={setValue}
        onChangeTool={() => {}}
        tool="auto"
      >
        <WorldMap />
      </ReactSVGPanZoom>
    </div>
  );
};

export default MapView;
