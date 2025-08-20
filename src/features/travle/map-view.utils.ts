import countries from '../../data/countries.json';

type CountryInfo = {
  id: number;
  alpha2: string;
  alpha3: string;
  name: string[];
};

const countriesTyped: CountryInfo[] = countries;

const countryMap = new Map<string, CountryInfo>();
for (const country of countriesTyped) {
  countryMap.set(country.alpha3.toLowerCase(), country);
}

export function getCountryCode(target: string): string | undefined {
  return countryMap.get(target.toLowerCase())?.alpha2;
}

function getStyle(code: string, color: string): string {
  return `#map_${code} { fill: ${color}; }`;
}

export function getMapStyles(
  ...entries: [countryCode: string, color: string][]
): string {
  return entries
    .map(([code, color]) => {
      const alpha2 = getCountryCode(code);
      if (!alpha2) return '';
      return getStyle(alpha2, color);
    })
    .join(' ');
}
