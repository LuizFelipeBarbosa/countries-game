import { useMemo } from "react";
import VALID_COUNTRIES from "../assets/countries_with_continents.json";

export const useCountriesData = () => {
	const countryMap = useMemo(() => {
		const map = {};
		VALID_COUNTRIES.forEach((c) => {
			c.name.forEach((n) => {
				map[n.toLowerCase()] = c;
			});
		});
		return map;
	}, []);

	const countryNames = useMemo(
		() => VALID_COUNTRIES.flatMap((c) => c.name),
		[]
	);

	return { countryMap, countryNames, VALID_COUNTRIES };
};

export default useCountriesData;


