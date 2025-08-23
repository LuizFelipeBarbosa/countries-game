import { useState, useEffect, useMemo, useRef } from "react";
import { CheckCircle, GitCommit } from "lucide-react";
import CountryInput from "./CountryInput";
import VALID_COUNTRIES from "../assets/countries_with_continents.json";
import countries from "../assets/countries.json";
import WorldMap from "../assets/map.svg";
import borders from "../assets/borders.json";
import crossings from "../assets/crossings.json";
import { generatePuzzle } from "../utils/puzzle";
import { getItem, setItem } from "../utils/storage";
import { applyHighlighting } from "../utils/mapColoring";

const TravleGame = () => {
	const [notification, setNotification] = useState(null);
	const [gameState, setGameState] = useState(() => {
		const savedGame = getItem("travleGameState");
		return savedGame
			? JSON.parse(savedGame)
			: {
					start: "",
					end: "",
					guesses: [],
					rejects: [],
					remaining: 0,
					shortest: 0,
					status: "playing",
					settings: {
						INCLUDE_CROSSINGS: true,
					},
			  };
	});

	const adjacencyMap = useMemo(() => {
		const map = new Map();
		countries.forEach((country) => {
			map.set(country.alpha3, []);
		});

		borders.forEach(([country1, country2]) => {
			if (map.has(country1) && map.has(country2)) {
				map.get(country1).push(country2);
				map.get(country2).push(country1);
			}
		});

		if (gameState.settings.INCLUDE_CROSSINGS) {
			crossings.forEach(([country1, country2]) => {
				if (map.has(country1) && map.has(country2)) {
					map.get(country1).push(country2);
					map.get(country2).push(country1);
				}
			});
		}

		return map;
	}, [gameState.settings.INCLUDE_CROSSINGS]);

	const aliases = useMemo(() => {
		const map = {};
		countries.forEach((country) => {
			country.name.forEach((n) => {
				map[n.toLowerCase()] = country.alpha3;
			});
		});
		return map;
	}, []);

	const iso3ToAlpha2 = useMemo(() => {
		return new Map(countries.map((c) => [c.alpha3, c.alpha2]));
	}, []);

	const bfs = (startNode) => {
		const distances = new Map();
		const queue = [[startNode, 0]];
		distances.set(startNode, 0);

		while (queue.length > 0) {
			const [currentNode, distance] = queue.shift();
			const neighbors = adjacencyMap.get(currentNode) || [];

			for (const neighbor of neighbors) {
				if (!distances.has(neighbor)) {
					distances.set(neighbor, distance + 1);
					queue.push([neighbor, distance + 1]);
				}
			}
		}
		return distances;
	};

	const bfsForPath = (startNode, endNode) => {
		const queue = [[startNode, [startNode]]];
		const visited = new Set([startNode]);

		while (queue.length > 0) {
			const [currentNode, currentPath] = queue.shift();

			if (currentNode === endNode) {
				return currentPath;
			}

			const neighbors = adjacencyMap.get(currentNode) || [];
			for (const neighbor of neighbors) {
				if (!visited.has(neighbor)) {
					visited.add(neighbor);
					const newPath = [...currentPath, neighbor];
					queue.push([neighbor, newPath]);
				}
			}
		}
		return null; // No path found
	};

	const [distStart, setDistStart] = useState(new Map());
	const [distEnd, setDistEnd] = useState(new Map());

	const handleGuess = (guess) => {
		const iso3 = aliases[guess.toLowerCase()];
		const lastGuess = gameState.guesses[gameState.guesses.length - 1];

		if (!iso3) {
			setGameState((prev) => ({
				...prev,
				rejects: [...prev.rejects, guess],
			}));
			return;
		}

		if (gameState.guesses.includes(iso3)) {
			// Already guessed
			return;
		}

		const neighbors = adjacencyMap.get(lastGuess) || [];
		if (!neighbors.includes(iso3)) {
			setGameState((prev) => ({
				...prev,
				rejects: [...prev.rejects, guess],
				remaining: prev.remaining - 1,
			}));
			return;
		}

		const newGuesses = [...gameState.guesses, iso3];
		const newRemaining = gameState.remaining - 1;
		const endNeighbors = adjacencyMap.get(gameState.end) || [];
		let newStatus = gameState.status;

		if (endNeighbors.includes(iso3)) {
			newStatus = "won";
		} else if (newRemaining === 0) {
			newStatus = "lost";
		}

		setGameState((prev) => ({
			...prev,
			guesses: newGuesses,
			remaining: newRemaining,
			status: newStatus,
		}));
	};

	const startNewGame = () => {
		clearAllColors();
		const { start, end, shortest } = generatePuzzle(
			adjacencyMap,
			bfsForPath
		);
		const dStart = bfs(start);
		const dEnd = bfs(end);

		setDistStart(dStart);
		setDistEnd(dEnd);

		setGameState({
			...gameState,
			start,
			end,
			shortest,
			guesses: [start],
			rejects: [],
			remaining: shortest + 4,
			status: "playing",
		});
	};

	useEffect(() => {
		if (adjacencyMap.size > 0 && !getItem("travleGameState")) {
			startNewGame();
		}
	}, [adjacencyMap]);

	useEffect(() => {
		setItem("travleGameState", JSON.stringify(gameState));
	}, [gameState]);

	const getGuessColor = (guess) => {
		if (distStart.get(guess) + distEnd.get(guess) === gameState.shortest) {
			return "green";
		}
		return "orange";
	};

	const countryNames = useMemo(() => {
		return VALID_COUNTRIES.flatMap((c) => c.name);
	}, []);

	const [zoom, setZoom] = useState(1);
	const [pan, setPan] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const pinchRef = useRef(null);
	const svgObjectRef = useRef(null);
	const containerRef = useRef(null);
	const [svgLoaded, setSvgLoaded] = useState(false);
	const coloredCountriesRef = useRef(new Map());
        const previousGuessesRef = useRef([]);

        const clearAllColors = () => {
                const svgDoc = svgObjectRef.current?.contentDocument;
                if (!svgDoc) return;
                const colored = Array.from(coloredCountriesRef.current.keys());
                applyHighlighting(svgDoc, "#d4d4d8", colored);
                coloredCountriesRef.current.clear();
                previousGuessesRef.current = [];
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

	const handleMouseDown = (e) => {
		setIsDragging(true);
		setDragStart({ x: e.clientX, y: e.clientY });
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

                                const newX = Math.min(
                                        Math.max(prevPan.x + dx, minX),
                                        maxX
                                );
                                const newY = Math.min(
                                        Math.max(prevPan.y + dy, minY),
                                        maxY
                                );

                                return { x: newX, y: newY };
                        });
                        setDragStart({ x: e.clientX, y: e.clientY });
                }
        };

	const handleMouseUp = () => {
		setIsDragging(false);
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

        const handleTouchMove = (e) => {
                e.preventDefault();
                if (e.touches.length === 1 && isDragging) {
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

                                const newX = Math.min(
                                        Math.max(prevPan.x + dx, minX),
                                        maxX
                                );
                                const newY = Math.min(
                                        Math.max(prevPan.y + dy, minY),
                                        maxY
                                );

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

	const handleTouchEnd = () => {
		setIsDragging(false);
		pinchRef.current = null;
	};

	const handleWheel = (e) => {
		e.preventDefault();
		const delta = e.deltaY * -0.001;
		handleZoom(delta, e.clientX, e.clientY);
	};

	const handleZoom = (delta, clientX, clientY) => {
		setZoom((prevZoom) => {
			const container = containerRef.current;
			const svgObject = svgObjectRef.current;
			if (!container || !svgObject) return prevZoom;

                        const containerRect = container.getBoundingClientRect();
                        const svgRect = svgObject.getBoundingClientRect();

                        const x = clientX - containerRect.left;
                        const y = clientY - containerRect.top;

                        const contentX = (x - pan.x) / prevZoom;
                        const contentY = (y - pan.y) / prevZoom;

                        const newZoom = Math.max(1, Math.min(prevZoom + delta, 8));

                        let newPanX = x - contentX * newZoom;
                        let newPanY = y - contentY * newZoom;

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

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const opts = { passive: false };
		container.addEventListener("touchstart", handleTouchStart, opts);
		container.addEventListener("touchmove", handleTouchMove, opts);
		container.addEventListener("touchend", handleTouchEnd);
		container.addEventListener("touchcancel", handleTouchEnd);

		return () => {
			if (!container) return;
			container.removeEventListener("touchstart", handleTouchStart);
			container.removeEventListener("touchmove", handleTouchMove);
			container.removeEventListener("touchend", handleTouchEnd);
			container.removeEventListener("touchcancel", handleTouchEnd);
		};
	}, [handleTouchStart, handleTouchMove, handleTouchEnd]);

	useEffect(() => {
		if (!svgLoaded) return;
		const svgDoc = svgObjectRef.current?.contentDocument;
		if (!svgDoc) return;
		const allAlpha2 = countries.map((c) => c.alpha2);
		applyHighlighting(svgDoc, "#d4d4d8", allAlpha2);
		coloredCountriesRef.current.clear();
		previousGuessesRef.current = [];
	}, [svgLoaded]);

	useEffect(() => {
		if (!svgLoaded) return;
		const svgDoc = svgObjectRef.current?.contentDocument;
		if (!svgDoc) return;

		const highlight = (alpha2Codes, color) => {
			applyHighlighting(svgDoc, color, alpha2Codes);
			alpha2Codes.forEach((code) =>
				coloredCountriesRef.current.set(code, color)
			);
		};

		const prevGuesses = previousGuessesRef.current;
		const newGuesses = gameState.guesses.slice(prevGuesses.length);
		newGuesses.forEach((guess) => {
			const alpha2 = iso3ToAlpha2.get(guess);
			if (alpha2) {
				const color =
					getGuessColor(guess) === "green" ? "#4ade80" : "#facc15";
				highlight([alpha2], color);
			}
		});

		const alpha2Start = iso3ToAlpha2.get(gameState.start);
		if (alpha2Start) highlight([alpha2Start], "#faa78b");
		const alpha2End = iso3ToAlpha2.get(gameState.end);
		if (alpha2End) highlight([alpha2End], "#a78bfa");

		previousGuessesRef.current = gameState.guesses;
	}, [
		gameState.guesses,
		gameState.start,
		gameState.end,
		getGuessColor,
		svgLoaded,
		iso3ToAlpha2,
	]);

	return (
		<div className="p-4 flex flex-col items-center text-center">
			{notification && (
				<div className="bg-blue-100 text-blue-700 p-2 rounded mb-4">
					{notification}
				</div>
			)}
			<h1 className="text-2xl font-bold mb-4">Travle Game</h1>
			<div className="flex flex-col md:flex-row gap-4 w-full">
				<div
					className="w-full md:w-2/3 h-96 bg-gray-300 rounded-lg overflow-hidden"
					ref={containerRef}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseUp}
					onWheel={handleWheel}
					style={{ cursor: isDragging ? "grabbing" : "grab" }}
				>
					<div
						style={{
							transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
							transformOrigin: "0 0",
						}}
					>
						<object
							ref={svgObjectRef}
							type="image/svg+xml"
							data={WorldMap}
							aria-label="World Map"
							className="w-full h-full"
							onLoad={() => setSvgLoaded(true)}
						/>
					</div>
				</div>
				<div className="w-full md:w-1/3">
					<div className="bg-white p-4 rounded-lg shadow">
						<h2 className="text-xl font-bold">
							From:{" "}
							{
								countries.find(
									(c) => c.alpha3 === gameState.start
								)?.name[0]
							}
						</h2>
						<h2 className="text-xl font-bold">
							To:{" "}
							{
								countries.find(
									(c) => c.alpha3 === gameState.end
								)?.name[0]
							}
						</h2>
						<p className="mt-2">
							Shortest Path:{" "}
							<strong>{gameState.shortest - 1}</strong>
						</p>
						<p>
							Guesses Remaining:{" "}
							<strong>{gameState.remaining}</strong>
						</p>
					</div>
					<div className="bg-white p-4 rounded-lg shadow mt-4">
						<h2 className="text-xl font-bold">Guesses</h2>
						<ul>
							{gameState.guesses.map((guess) => (
								<li
									key={guess}
									className={`flex items-center p-1 rounded ${
										getGuessColor(guess) === "green"
											? "bg-green-100"
											: "bg-yellow-100"
									}`}
								>
									{getGuessColor(guess) === "green" ? (
										<CheckCircle className="text-green-500 mr-2" />
									) : (
										<GitCommit className="text-yellow-500 mr-2" />
									)}
									{
										countries.find(
											(c) => c.alpha3 === guess
										)?.name[0]
									}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
			<div className="w-full max-w-md mt-4">
				<CountryInput
					onSubmit={handleGuess}
					disabled={gameState.status !== "playing"}
					suggestions={countryNames}
				/>
			</div>
			{gameState.rejects.length > 0 && (
				<div className="bg-red-100 text-red-700 p-2 rounded mt-4">
					<h3 className="font-bold">Invalid Guesses</h3>
					<ul>
						{gameState.rejects.map((reject, i) => (
							<li key={i}>{reject}</li>
						))}
					</ul>
				</div>
			)}
			{gameState.status !== "playing" && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-8 rounded-lg shadow-lg text-center">
						<h2 className="text-2xl font-bold mb-4">
							{gameState.status === "won"
								? "You Won!"
								: "Game Over!"}
						</h2>
						<p>
							You found the path in {gameState.guesses.length - 1}{" "}
							guesses.
						</p>
						<p>
							Shortest possible path was {gameState.shortest - 1}.
						</p>
						<button
							className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
							onClick={startNewGame}
						>
							Play Again
						</button>
						<button
							className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4 ml-2"
							onClick={() => {
								const path = gameState.guesses
									.map(
										(g) =>
											countries.find(
												(c) => c.alpha3 === g
											).name[0]
									)
									.join(" → ");
								const summary = `I completed the Travle from ${
									countries.find(
										(c) => c.alpha3 === gameState.start
									).name[0]
								} to ${
									countries.find(
										(c) => c.alpha3 === gameState.end
									).name[0]
								} in ${
									gameState.guesses.length - 1
								} guesses (shortest ${
									gameState.shortest
								}).\n\n${path}`;
								navigator.clipboard.writeText(summary);
								setNotification("Results copied to clipboard!");
								setTimeout(() => setNotification(null), 3000);
							}}
						>
							Share
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default TravleGame;
