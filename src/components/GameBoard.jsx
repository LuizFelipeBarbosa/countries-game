import { useEffect, useRef, useState } from "react";
import { zoom as d3Zoom, zoomIdentity } from "d3-zoom";
import { select } from "d3-selection";
import WorldMap from "../assets/map.svg";
import VALID_COUNTRIES from "../assets/countries_with_continents.json";

const GameBoard = ({
	guessedCountries,
	isBlurred,
	isGameEnded,
	isGameStarted,
}) => {
	const [svgLoaded, setSvgLoaded] = useState(false);
	const [zoomLevel, setZoomLevel] = useState(1);

	const svgObjectRef = useRef(null);
	const containerRef = useRef(null);
	const zoomContainerRef = useRef(null);
	const zoomBehavior = useRef(null);

	let highlightedCountries = [...guessedCountries].map(
		(country) => country.alpha2
	);

	useEffect(() => {
		const svgObject = svgObjectRef.current;

		const applyHighlighting = (color, countryList) => {
			const svgDoc = svgObject.contentDocument;
			if (svgDoc) {
				const taiwanElement = svgDoc.getElementById("tw");
				const kosovoElement = svgDoc.getElementById("xk");

				countryList.forEach((alpha2Code) => {
					const countryElement = svgDoc.getElementById(alpha2Code);

					if (countryElement) {
						countryElement.style.fill = color;

						const descendants =
							countryElement.querySelectorAll("*");
						descendants.forEach((element) => {
							if (
								(alpha2Code === "rs" &&
									kosovoElement &&
									kosovoElement.contains(element)) ||
								(alpha2Code === "cn" &&
									taiwanElement &&
									taiwanElement.contains(element))
							) {
								return;
							}
							element.style.fill = color;
						});
					} else {
						console.warn(
							`Country with id '${alpha2Code}' not found in the SVG.`
						);
					}
				});
			}
		};

		const onLoad = () => {
			setSvgLoaded(true);
		};

		if (svgObject) {
			if (svgObject.contentDocument) {
				setSvgLoaded(true);

                                if (isGameEnded) {
                                        const allCountryCodes = VALID_COUNTRIES.map(
                                                (country) => country.alpha2
                                        );
					const unHighlightedCountries = allCountryCodes.filter(
						(code) => !highlightedCountries.includes(code)
					);
					applyHighlighting("#f87171", unHighlightedCountries);
					highlightedCountries = [];
				}

				if (isGameStarted && highlightedCountries.length === 0) {
					const allCountryCodes = VALID_COUNTRIES.map(
						(country) => country.alpha2
					);
					applyHighlighting("#fed7aa", allCountryCodes);
				}

				applyHighlighting("#4ade80", highlightedCountries);
			} else {
				svgObject.addEventListener("load", onLoad);
				return () => {
					svgObject.removeEventListener("load", onLoad);
				};
			}
		}
	}, [highlightedCountries, isGameEnded, isGameStarted]);

	useEffect(() => {
		if (svgLoaded) {
			const svgObject = svgObjectRef.current;
			if (svgObject && svgObject.contentDocument) {
				const svgDoc = svgObject.contentDocument;

				// Remove existing country name text elements
				const existingTextElements = svgDoc.querySelectorAll(
					'text[data-country-name="true"]'
				);
				existingTextElements.forEach((textElement) => {
					textElement.parentNode.removeChild(textElement);
				});

				// Determine which countries to render names for
				const countriesToRender = isGameEnded
					? VALID_COUNTRIES
					: guessedCountries;

				countriesToRender.forEach((country) => {
					let alpha2Code = country.alpha2;

					// Handle special cases for country IDs in the SVG
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

						// Use the country name from VALID_COUNTRIES
						const countryData = VALID_COUNTRIES.find(
							(countryData) =>
								countryData.alpha2 === country.alpha2
						);
						countryName = countryData
							? countryData.name[0]
							: alpha2Code.toUpperCase();

						const bbox = path.getBBox();

						// Create text element
						const textElement = svgDoc.createElementNS(
							"http://www.w3.org/2000/svg",
							"text"
						);
						textElement.setAttribute("x", bbox.x + bbox.width / 2);
						textElement.setAttribute("y", bbox.y + bbox.height / 2);
						textElement.setAttribute("text-anchor", "middle");
						textElement.setAttribute(
							"alignment-baseline",
							"central"
						);
						textElement.setAttribute("font-family", "Arial");
						if (zoomLevel < 1.5) {
							textElement.setAttribute("font-size", "20");
						} else if (zoomLevel < 2) {
							textElement.setAttribute("font-size", "16");
						} else if (zoomLevel < 3) {
							textElement.setAttribute("font-size", "12");
						} else if (zoomLevel < 4) {
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
			}
		}
	}, [guessedCountries, isGameEnded, svgLoaded, zoomLevel]);

	useEffect(() => {
		const z = d3Zoom()
			.scaleExtent([1, 8])
			.on("zoom", (event) => {
				const { transform } = event;
				select(zoomContainerRef.current).style(
					"transform",
					`translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`
				);
				setZoomLevel(transform.k);
			});

		zoomBehavior.current = z;
		const container = select(containerRef.current);
		container.call(z);

		return () => {
			container.on(".zoom", null);
		};
	}, [svgLoaded]);

	const handleZoomIn = () => {
		if (zoomBehavior.current) {
			select(containerRef.current)
				.transition()
				.duration(200)
				.call(zoomBehavior.current.scaleBy, 1.2);
		}
	};

	const handleZoomOut = () => {
		if (zoomBehavior.current) {
			select(containerRef.current)
				.transition()
				.duration(200)
				.call(zoomBehavior.current.scaleBy, 0.8);
		}
	};

	return (
		<div className="relative w-full h-[60vh] sm:h-[70vh]">
			<div
				className={`bg-blue-400 p-4 rounded-lg shadow-md relative w-full h-full overflow-hidden select-none transition-opacity duration-500 ${
					isBlurred ? "opacity-50" : "opacity-100"
				}`}
				ref={containerRef}
				style={{
					cursor: isBlurred ? "default" : "grab",
					touchAction: "none",
				}}
			>
				<div ref={zoomContainerRef}>
					<object
						ref={svgObjectRef}
						type="image/svg+xml"
						className="preserve-aspect-ratio w-full h-full pointer-events-none"
						data={WorldMap}
						aria-label="World Map"
					>
						Your browser does not support SVG
					</object>
				</g>
				{!isBlurred && (
					<div className="absolute bottom-4 right-4 space-x-2">
						<button
							onClick={handleZoomIn}
							className="bg-white text-blue-500 px-3 py-1 rounded"
							aria-label="Zoom in"
						>
							+
						</button>
						<button
							onClick={handleZoomOut}
							className="bg-white text-blue-500 px-3 py-1 rounded"
							aria-label="Zoom out"
						>
							-
						</button>
					</div>
				)}
			</div>
			{isBlurred && (
				<div className="absolute top-0 left-0 rounded-lg w-full h-full bg-opacity-50 backdrop-blur-3xl select-none transition-opacity duration-500"></div>
			)}
		</div>
	);
};

export default GameBoard;
