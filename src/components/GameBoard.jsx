import { useEffect, useRef, useState } from "react";
import WorldMap from "../assets/map.svg";
import VALID_COUNTRIES from "../assets/countries_with_continents.json";

const GameBoard = ({
	guessedCountries,
	isBlurred,
	isGameEnded,
	isGameStarted,
}) => {
	const [zoom, setZoom] = useState(1);
	const [pan, setPan] = useState({ x: 0, y: 0 });
        const [isDragging, setIsDragging] = useState(false);
        const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
        const [svgLoaded, setSvgLoaded] = useState(false);
        const pinchRef = useRef(null);

        const [viewport, setViewport] = useState({
                height:
                        typeof window !== "undefined"
                                ? window.visualViewport?.height ?? window.innerHeight
                                : 0,
                width:
                        typeof window !== "undefined"
                                ? window.visualViewport?.width ?? window.innerWidth
                                : 0,
        });

        const svgObjectRef = useRef(null);
        const containerRef = useRef(null);

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
			}
		}
	}, [guessedCountries, isGameEnded, svgLoaded]);

	useEffect(() => {
		// Update font size based on zoom level
		if (
			svgLoaded &&
			svgObjectRef.current &&
			svgObjectRef.current.contentDocument
		) {
			const svgDoc = svgObjectRef.current.contentDocument;
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
		}
	}, [zoom, svgLoaded]);

	useEffect(() => {
		const container = containerRef.current;
		if (container) {
			const preventDefaultScroll = (e) => {
				e.preventDefault();
			};

			container.addEventListener("wheel", preventDefaultScroll, {
				passive: false,
			});

			return () => {
				container.removeEventListener("wheel", preventDefaultScroll);
			};
		}
        }, []);

        useEffect(() => {
                const updateViewport = () => {
                        setViewport({
                                height:
                                        window.visualViewport?.height ??
                                        window.innerHeight,
                                width:
                                        window.visualViewport?.width ??
                                        window.innerWidth,
                        });
                };
                updateViewport();
                window.visualViewport?.addEventListener("resize", updateViewport);
                window.addEventListener("resize", updateViewport);
                return () => {
                        window.visualViewport?.removeEventListener(
                                "resize",
                                updateViewport
                const visualViewportListenerAdded = false;
                updateViewport();
                if (window.visualViewport) {
                        window.visualViewport.addEventListener("resize", updateViewport);
                        visualViewportListenerAdded = true;
                }
                window.addEventListener("resize", updateViewport);
                return () => {
                        if (visualViewportListenerAdded && window.visualViewport) {
                                window.visualViewport.removeEventListener(
                                        "resize",
                                        updateViewport
                                );
                        }
                        window.removeEventListener("resize", updateViewport);
                };
        }, []);

	const handleMouseDown = (e) => {
		setIsDragging(true);
		setDragStart({ x: e.clientX, y: e.clientY });
	};

        const handleTouchStart = (e) => {
                e.preventDefault();
                if (e.touches.length === 1) {
                        setIsDragging(true);
                        setDragStart({
                                x: e.touches[0].clientX,
                                y: e.touches[0].clientY,
                        });
                } else if (e.touches.length === 2) {
                        const distance = Math.hypot(
                                e.touches[0].clientX - e.touches[1].clientX,
                                e.touches[0].clientY - e.touches[1].clientY
                        );
                        pinchRef.current = {
                                initialDistance: distance,
                                startZoom: zoom,
                        };
                }
        };

	const calculatePanLimits = (containerRect, svgRect, currentZoom) => {
		const horizontalOverflow = Math.max(
			0,
			(svgRect.width * currentZoom - containerRect.width) / 2
		);
		const verticalOverflow = Math.max(
			0,
			(svgRect.height * currentZoom - containerRect.height) / 2
		);

		return {
			minX: -horizontalOverflow,
			maxX: horizontalOverflow,
			minY: -verticalOverflow,
			maxY: verticalOverflow,
		};
	};

	const handleMouseMove = (e) => {
		if (isDragging) {
			const dx = e.clientX - dragStart.x;
			const dy = e.clientY - dragStart.y;
			setPan((prevPan) => {
				const container = containerRef.current;
				const svgObject = svgObjectRef.current;
				if (!container || !svgObject) return prevPan;

				const containerRect = container.getBoundingClientRect();
				const svgRect = svgObject.getBoundingClientRect();

				const { minX, maxX, minY, maxY } = calculatePanLimits(
					containerRect,
					svgRect,
					zoom
				);

				const newX = Math.min(Math.max(prevPan.x + dx, minX), maxX);
				const newY = Math.min(Math.max(prevPan.y + dy, minY), maxY);

				return { x: newX, y: newY };
			});
			setDragStart({ x: e.clientX, y: e.clientY });
		}
	};

        const handleTouchMove = (e) => {
                e.preventDefault();
                if (e.touches.length === 1 && isDragging) {
                        e.preventDefault();
                        const touch = e.touches[0];
                        const dx = touch.clientX - dragStart.x;
                        const dy = touch.clientY - dragStart.y;
                        setPan((prevPan) => {
                                const container = containerRef.current;
                                const svgObject = svgObjectRef.current;
                                if (!container || !svgObject) return prevPan;

                                const containerRect = container.getBoundingClientRect();
                                const svgRect = svgObject.getBoundingClientRect();

                                const { minX, maxX, minY, maxY } = calculatePanLimits(
                                        containerRect,
                                        svgRect,
                                        zoom
                                );

                                const newX = Math.min(Math.max(prevPan.x + dx, minX), maxX);
                                const newY = Math.min(Math.max(prevPan.y + dy, minY), maxY);

                                return { x: newX, y: newY };
                        });
                        setDragStart({ x: touch.clientX, y: touch.clientY });
                } else if (e.touches.length === 2 && pinchRef.current) {
                        const distance = Math.hypot(
                                e.touches[0].clientX - e.touches[1].clientX,
                                e.touches[0].clientY - e.touches[1].clientY
                        );
                        const scale = distance / pinchRef.current.initialDistance;
                        const newZoom = pinchRef.current.startZoom * scale;
                        const delta = newZoom - zoom;
                        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                        handleZoom(delta, midX, midY);
                }
        };

	const handleZoom = (delta, clientX, clientY) => {
		setZoom((prevZoom) => {
			const container = containerRef.current;
			const svgObject = svgObjectRef.current;
			if (!container || !svgObject) return prevZoom;

			const containerRect = container.getBoundingClientRect();
			const svgRect = svgObject.getBoundingClientRect();

			// Calculate cursor position relative to the container
			const x = clientX - containerRect.left;
			const y = clientY - containerRect.top;

			// Calculate cursor position relative to the content (considering current pan and zoom)
			const contentX = (x - pan.x) / prevZoom;
			const contentY = (y - pan.y) / prevZoom;

			const newZoom = Math.max(1, Math.min(prevZoom + delta, 8));

			// Calculate new pan position to keep the point under cursor in the same place
			let newPanX = x - contentX * newZoom;
			let newPanY = y - contentY * newZoom;

			// Adjust pan to respect the new limits
			const { minX, maxX, minY, maxY } = calculatePanLimits(
				containerRect,
				svgRect,
				newZoom
			);
			newPanX = Math.min(Math.max(newPanX, minX), maxX);
			newPanY = Math.min(Math.max(newPanY, minY), maxY);

			setPan({ x: newPanX, y: newPanY });

			return newZoom;
		});
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

        const handleTouchEnd = (e) => {
                e.preventDefault();
                setIsDragging(false);
                pinchRef.current = null;
        };

        const handleWheel = (e) => {
                e.preventDefault();
                const delta = e.deltaY * -0.001;
                handleZoom(delta, e.clientX, e.clientY);
        };

        const containerHeight =
                viewport.width >= 640
                        ? viewport.height * 0.7
                        : viewport.height * 0.6;

        return (
                <div
                        className="relative w-full"
                        style={{ height: `${containerHeight}px` }}
                >
                        <div
                                className={`bg-blue-400 p-4 rounded-lg shadow-md relative w-full h-full overflow-hidden select-none transition-opacity duration-500 ${
                                        isBlurred ? "opacity-50" : "opacity-100"
                                }`}
				ref={containerRef}
				onMouseDown={!isBlurred ? handleMouseDown : undefined}
				onMouseMove={!isBlurred ? handleMouseMove : undefined}
				onMouseUp={!isBlurred ? handleMouseUp : undefined}
				onMouseLeave={!isBlurred ? handleMouseUp : undefined}
				onWheel={!isBlurred ? handleWheel : undefined}
				onTouchStart={!isBlurred ? handleTouchStart : undefined}
				onTouchMove={!isBlurred ? handleTouchMove : undefined}
				onTouchEnd={!isBlurred ? handleTouchEnd : undefined}
				onTouchCancel={!isBlurred ? handleTouchEnd : undefined}
				style={{
					cursor: isDragging ? "grabbing" : "grab",
					touchAction: "none",
				}}
			>
				<div
					className="bg-blue-400 rounded-md relative select-none"
					style={{
						transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
						transformOrigin: "0 0",
						cursor: isDragging ? "grabbing" : "grab",
					}}
				>
					<object
						ref={svgObjectRef}
						type="image/svg+xml"
						className="preserve-aspect-ratio w-full h-full pointer-events-none"
						data={WorldMap}
						aria-label="World Map"
					>
						Your browser does not support SVG
					</object>
				</div>
			</div>
			{isBlurred && (
				<div className="absolute top-0 left-0 rounded-lg w-full h-full bg-opacity-50 backdrop-blur-3xl select-none transition-opacity duration-500"></div>
			)}
		</div>
	);
};

export default GameBoard;
