import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { CheckCircle, GitCommit, Share2 } from "lucide-react";
import CountryInput from "../../components/CountryInput";
import VALID_COUNTRIES from "../../assets/countries_with_continents.json";
import countries from "../../assets/countries.json";
import MapContainer from "../../components/MapContainer";
import borders from "../../assets/borders.json";
import crossings from "../../assets/crossings.json";
import { generatePuzzle } from "../../utils/puzzle";
import { getItem, setItem } from "../../utils/storage";

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

	const mapApiRef = useRef(null);
	const [mapReady, setMapReady] = useState(false);

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

	const startNewGame = useCallback(() => {
		clearAllColors();
		const { start, end, shortest } = generatePuzzle(
			adjacencyMap,
			bfsForPath
		);
		const dStart = bfs(start);
		const dEnd = bfs(end);

		setDistStart(dStart);
		setDistEnd(dEnd);

		setGameState((prev) => ({
			...prev,
			start,
			end,
			shortest,
			guesses: [start],
			rejects: [],
			remaining: shortest + 4,
			status: "playing",
		}));
	}, [adjacencyMap, bfs, bfsForPath]);

	useEffect(() => {
		if (adjacencyMap.size > 0 && !getItem("travleGameState")) {
			startNewGame();
		}
	}, [adjacencyMap, startNewGame]);

	useEffect(() => {
		setItem("travleGameState", JSON.stringify(gameState));
	}, [gameState]);

	const getGuessColor = useCallback(
		(guess) => {
			if (
				distStart.get(guess) + distEnd.get(guess) ===
				gameState.shortest
			) {
				return "green";
			}
			return "orange";
		},
		[distStart, distEnd, gameState.shortest]
	);

	const countryNames = useMemo(() => {
		return VALID_COUNTRIES.flatMap((c) => c.name);
	}, []);

	const clearAllColors = () => {
		const api = mapApiRef.current;
		if (!api) return;
		const allAlpha2 = countries.map((c) => c.alpha2);
		api.resetColors(allAlpha2, "#e5e5e5");
	};

	useEffect(() => {
		if (!mapReady) return;
		if (!gameState.start || !gameState.end) return;
		const api = mapApiRef.current;
		if (!api) return;
		const allAlpha2 = countries.map((c) => c.alpha2);
		api.resetColors(allAlpha2, "#e5e5e5");
		// Immediately color start and end on load
		const alpha2Start = iso3ToAlpha2.get(gameState.start);
		if (alpha2Start) api.colorCountries("#a78bfa", [alpha2Start]); // secondary-dark
		const alpha2End = iso3ToAlpha2.get(gameState.end);
		if (alpha2End) api.colorCountries("#faa78b", [alpha2End]); // some orange
	}, [mapReady, gameState.start, gameState.end, iso3ToAlpha2]);

	// Color guessed countries: green if on a shortest path, yellow otherwise
	useEffect(() => {
		if (!mapReady) return;
		const api = mapApiRef.current;
		if (!api) return;
		if (!gameState.guesses || gameState.guesses.length === 0) return;

		const greenAlpha2 = [];
		const yellowAlpha2 = [];

		for (const iso3 of gameState.guesses) {
			// Skip recoloring the starting country so it retains its dedicated color
			if (iso3 === gameState.start) continue;
			const alpha2 = iso3ToAlpha2.get(iso3);
			if (!alpha2) continue;
			const isOnShortestPath =
				(distStart.get(iso3) ?? Infinity) +
					(distEnd.get(iso3) ?? Infinity) ===
				gameState.shortest;
			if (isOnShortestPath) {
				greenAlpha2.push(alpha2);
			} else {
				yellowAlpha2.push(alpha2);
			}
		}

		if (greenAlpha2.length > 0) {
			api.colorCountries("#4ade80", greenAlpha2); // green-400
		}
		if (yellowAlpha2.length > 0) {
			api.colorCountries("#facc15", yellowAlpha2); // yellow-400
		}
	}, [
		mapReady,
		gameState.guesses,
		gameState.shortest,
		distStart,
		distEnd,
		iso3ToAlpha2,
	]);

    const GameInfoPanel = () => (
        <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
            <div>
                <h2 className="text-lg font-bold text-neutral-700">From:</h2>
                <p className="text-neutral-600">{countries.find(c => c.alpha3 === gameState.start)?.name[0]}</p>
            </div>
            <div>
                <h2 className="text-lg font-bold text-neutral-700">To:</h2>
                <p className="text-neutral-600">{countries.find(c => c.alpha3 === gameState.end)?.name[0]}</p>
            </div>
            <div className="pt-2">
                <p className="text-neutral-600">Shortest Path: <strong className="text-primary">{gameState.shortest - 1}</strong></p>
                <p className="text-neutral-600">Guesses Remaining: <strong className="text-primary">{gameState.remaining}</strong></p>
            </div>
        </div>
    );

    const GuessesPanel = () => (
        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
            <h2 className="text-xl font-bold text-neutral-700 mb-2">Guesses</h2>
            <ul className="space-y-2">
                {gameState.guesses.map((guess) => (
                    <li
                        key={guess}
                        className={`flex items-center p-2 rounded-md ${
                            getGuessColor(guess) === "green"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                        {getGuessColor(guess) === "green" ? (
                            <CheckCircle className="text-green-500 mr-2" />
                        ) : (
                            <GitCommit className="text-yellow-500 mr-2" />
                        )}
                        {countries.find(c => c.alpha3 === guess)?.name[0]}
                    </li>
                ))}
            </ul>
        </div>
    );

	return (
		<div className="flex flex-col items-center text-center">
			{notification && (
				<div className="bg-blue-100 text-blue-700 p-2 rounded mb-4">
					{notification}
				</div>
			)}
			<h1 className="text-3xl font-bold mb-4 text-neutral-800">Travle Game</h1>
			<div className="flex flex-col lg:flex-row gap-8 w-full">
				<div className="w-full lg:w-3/4">
                    <MapContainer
                        className="w-full h-[60vh] lg:h-full bg-neutral-200 rounded-lg shadow-md"
                        ariaLabel="World Map"
                        apiRef={mapApiRef}
                        onSvgLoad={() => setMapReady(true)}
                    />
                </div>
				<div className="w-full lg:w-1/4">
					<GameInfoPanel />
                    <GuessesPanel />
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
				<div className="bg-red-100 text-red-700 p-3 rounded-lg mt-4 shadow-md">
					<h3 className="font-bold mb-2">Invalid Guesses</h3>
					<ul className="list-disc list-inside">
						{gameState.rejects.map((reject, i) => (
							<li key={i}>{reject}</li>
						))}
					</ul>
				</div>
			)}
			{gameState.status !== "playing" && (
				<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
					<div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm w-full mx-4">
						<h2 className="text-3xl font-bold mb-4 text-primary">
							{gameState.status === "won"
								? "You Won!"
								: "Game Over!"}
						</h2>
						<p className="text-neutral-600">
							You found the path in {gameState.guesses.length - 1}{" "}
							guesses.
						</p>
						<p className="text-neutral-600">
							Shortest possible path was {gameState.shortest - 1}.
						</p>
						<div className="flex justify-center gap-4 mt-6">
                            <button
                                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
                                onClick={startNewGame}
                            >
                                Play Again
                            </button>
                            <button
                                className="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center"
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
                                <Share2 size={20} className="mr-2"/>
                                Share
                            </button>
                        </div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TravleGame;
