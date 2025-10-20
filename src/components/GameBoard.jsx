import { useEffect, useState, useMemo, useRef } from "react";
import MapContainer from "./MapContainer";
import VALID_COUNTRIES from "../assets/countries_with_continents.json";

const GameBoard = ({
	guessedCountries,
	isBlurred,
	isGameEnded,
	isGameStarted,
}) => {
        const apiRef = useRef(null);
        const [mapTransform, setMapTransform] = useState({
                zoom: 1,
                pan: { x: 0, y: 0 },
        });
	const zoom = mapTransform.zoom;

	const allAlpha2 = useMemo(
		() => VALID_COUNTRIES.map((country) => country.alpha2),
		[]
	);

	useEffect(() => {
		const api = apiRef.current;
		if (!api) return;

		const guessedList = Array.isArray(guessedCountries)
			? guessedCountries
			: Array.from(guessedCountries || []);
		const guessedAlpha2 = guessedList
			.map((c) => (typeof c === "string" ? c : c?.alpha2))
			.filter(Boolean);

		if (isGameEnded) {
			const unHighlighted = allAlpha2.filter(
				(code) => !guessedAlpha2.includes(code)
			);
			api.colorCountries("#f87171", unHighlighted);
			if (guessedAlpha2.length > 0)
				api.colorCountries("#4ade80", guessedAlpha2);
			return;
		}

		// At game start (no guesses), set ambient amber once
		if (isGameStarted && guessedAlpha2.length === 0) {
			api.colorCountries("#fed7aa", allAlpha2);
			return;
		}

		// After first guess onward, only color guessed green; do not reset others to gray
		if (guessedAlpha2.length > 0) {
			api.colorCountries("#4ade80", guessedAlpha2);
		}
	}, [guessedCountries, isGameEnded, isGameStarted, allAlpha2]);

	useEffect(() => {
		const svgDoc = apiRef.current?.getSvgDocument();
		if (!svgDoc) return;

		// Remove existing country name text elements
		const existingTextElements = svgDoc.querySelectorAll(
			'text[data-country-name="true"]'
		);
		existingTextElements.forEach((textElement) => {
			textElement.parentNode.removeChild(textElement);
		});

		const guessedList = Array.isArray(guessedCountries)
			? guessedCountries
			: Array.from(guessedCountries || []);
		const countriesToRender = isGameEnded
			? VALID_COUNTRIES
			: guessedList
					.map((c) =>
						typeof c === "string"
							? VALID_COUNTRIES.find((v) => v.alpha2 === c)
							: c
					)
					.filter(Boolean);

		countriesToRender.forEach((country) => {
			let alpha2Code = country.alpha2;

			const specialCases = {
				fr: "frx",
				nl: "nlx",
				us: "United_States_lower_48",
				ru: "path2924",
				ki: "ki_",
				cl: "path6470",
				dk: "Denmark_mainland",
				pt: "Portugal_mainland",
				es: "Spain_mainland",
				au: "Australia_mainland",
				ec: "Ecuador_mainland",
				cr: "Costa_Rica_mainland",
				it: "Italy_mainland",
				ca: "Canada_mainland",
			};

			alpha2Code = specialCases[alpha2Code] || alpha2Code;

			const path = svgDoc.getElementById(alpha2Code);
			if (path) {
				let countryName = "";
				const countryData = VALID_COUNTRIES.find(
					(countryData) => countryData.alpha2 === country.alpha2
				);
				countryName = countryData
					? countryData.name[0]
					: alpha2Code.toUpperCase();

				const bbox = path.getBBox();
				const textElement = svgDoc.createElementNS(
					"http://www.w3.org/2000/svg",
					"text"
				);
				textElement.setAttribute("x", bbox.x + bbox.width / 2);
				textElement.setAttribute("y", bbox.y + bbox.height / 2);
				textElement.setAttribute("text-anchor", "middle");
				textElement.setAttribute("alignment-baseline", "central");
				textElement.setAttribute("font-family", "Arial");
				if (zoom < 1.5) {
					textElement.setAttribute("font-size", "20");
				} else if (zoom < 2) {
					textElement.setAttribute("font-size", "16");
				} else if (zoom < 3) {
					textElement.setAttribute("font-size", "12");
				} else if (zoom < 4) {
					textElement.setAttribute("font-size", "8");
				} else {
					textElement.setAttribute("font-size", "4");
				}
				textElement.setAttribute("fill", "black");
				textElement.setAttribute("pointer-events", "none");
				textElement.setAttribute("data-country-name", "true");
				textElement.textContent = countryName;

				svgDoc.documentElement.appendChild(textElement);
			} else {
				console.warn(
					`Country path with id '${alpha2Code}' not found in the SVG.`
				);
			}
		});
	}, [guessedCountries, isGameEnded, zoom]);

	useEffect(() => {
		const svgDoc = apiRef.current?.getSvgDocument();
		if (!svgDoc) return;
		const textElements = svgDoc.querySelectorAll(
			'text[data-country-name="true"]'
		);
		textElements.forEach((textElement) => {
			if (zoom < 1.5) {
				textElement.setAttribute("font-size", "20");
			} else if (zoom < 2) {
				textElement.setAttribute("font-size", "16");
			} else if (zoom < 3) {
				textElement.setAttribute("font-size", "12");
			} else if (zoom < 4) {
				textElement.setAttribute("font-size", "8");
			} else {
				textElement.setAttribute("font-size", "4");
			}
		});
	}, [zoom]);

        return (
                <div className="relative w-full">
                        <div
                                className={`relative h-full w-full overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950/60 p-3 shadow-[0_30px_70px_-45px_rgba(56,189,248,0.65)] transition-opacity duration-500 ${
                                        isBlurred ? "opacity-50" : "opacity-100"
                                }`}
                        >
                                <MapContainer
                                        apiRef={apiRef}
                                        className="relative h-full w-full select-none rounded-2xl bg-slate-950"
                                        ariaLabel="World Map"
                                        isDisabled={isBlurred}
                                        onSvgLoad={() => {}}
                                        onTransformChange={setMapTransform}
                                />
			</div>
			{isBlurred && (
				<div className="absolute top-0 left-0 rounded-lg w-full h-full bg-opacity-50 backdrop-blur-3xl select-none transition-opacity duration-500"></div>
			)}
		</div>
	);
};

export default GameBoard;
