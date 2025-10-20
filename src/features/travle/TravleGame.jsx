import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { CheckCircle, GitCommit } from "lucide-react";
import CountryInput from "../../components/CountryInput";
import VALID_COUNTRIES from "../../assets/countries_with_continents.json";
import countries from "../../assets/countries.json";
import MapContainer from "../../components/MapContainer";
import borders from "../../assets/borders.json";
import crossings from "../../assets/crossings.json";
import { generatePuzzle } from "../../utils/puzzle";
import { getItem, setItem } from "../../utils/storage";
import FeedbackMessage from "../../components/ui/FeedbackMessage";

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
                api.resetColors(allAlpha2, "#1f2937");
        };

        useEffect(() => {
                if (!mapReady) return;
                if (!gameState.start || !gameState.end) return;
                const api = mapApiRef.current;
                if (!api) return;
                const allAlpha2 = countries.map((c) => c.alpha2);
                api.resetColors(allAlpha2, "#1f2937");
                // Immediately color start and end on load
		const alpha2Start = iso3ToAlpha2.get(gameState.start);
		if (alpha2Start) api.colorCountries("#faa78b", [alpha2Start]);
		const alpha2End = iso3ToAlpha2.get(gameState.end);
		if (alpha2End) api.colorCountries("#a78bfa", [alpha2End]);
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
			api.colorCountries("#4ade80", greenAlpha2);
		}
		if (yellowAlpha2.length > 0) {
			api.colorCountries("#facc15", yellowAlpha2);
		}
	}, [
		mapReady,
		gameState.guesses,
		gameState.shortest,
		distStart,
		distEnd,
		iso3ToAlpha2,
	]);

        return (
                <div className="flex w-full flex-col gap-6">
                        {notification && (
                                <FeedbackMessage message={notification} className="mx-auto w-full max-w-sm" />
                        )}
                        <div className="space-y-2 text-left">
                                <h1 className="font-montserrat text-3xl font-semibold text-white">Travle Game</h1>
                                <p className="max-w-3xl text-sm text-slate-400 sm:text-base">
                                        Chain neighbouring countries to connect the starting point to the destination in as few moves as possible.
                                </p>
                        </div>
                        <div className="flex flex-col gap-6 lg:flex-row">
                                <div className="flex w-full flex-1 flex-col gap-4">
                                        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-3">
                                                <MapContainer
                                                        className="h-[60vh] w-full rounded-2xl bg-slate-950"
                                                        ariaLabel="World Map"
                                                        apiRef={mapApiRef}
                                                        onSvgLoad={() => setMapReady(true)}
                                                />
                                        </div>
                                </div>
                                <div className="flex w-full flex-col gap-4 lg:max-w-sm">
                                        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 text-slate-100">
                                                <h2 className="font-montserrat text-lg font-semibold text-white">Route Summary</h2>
                                                <dl className="mt-4 space-y-3 text-sm text-slate-300">
                                                        <div className="flex items-center justify-between">
                                                                <dt className="text-slate-400">From</dt>
                                                                <dd className="font-semibold text-white">
                                                                        {
                                                                                countries.find(
                                                                                        (c) => c.alpha3 === gameState.start
                                                                                )?.name[0]
                                                                        }
                                                                </dd>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                                <dt className="text-slate-400">To</dt>
                                                                <dd className="font-semibold text-white">
                                                                        {
                                                                                countries.find(
                                                                                        (c) => c.alpha3 === gameState.end
                                                                                )?.name[0]
                                                                        }
                                                                </dd>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                                <dt className="text-slate-400">Shortest path</dt>
                                                                <dd className="font-semibold text-white">{gameState.shortest - 1}</dd>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                                <dt className="text-slate-400">Guesses remaining</dt>
                                                                <dd className="font-semibold text-white">{gameState.remaining}</dd>
                                                        </div>
                                                </dl>
                                        </div>
                                        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 text-slate-100">
                                                <h2 className="font-montserrat text-lg font-semibold text-white">Guesses</h2>
                                                <ul className="mt-3 space-y-2 text-sm">
                                                        {gameState.guesses.map((guess) => {
                                                                const isGreen = getGuessColor(guess) === "green";
                                                                return (
                                                                        <li
                                                                                key={guess}
                                                                                className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${
                                                                                        isGreen
                                                                                                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                                                                                                : "border-amber-500/40 bg-amber-500/10 text-amber-100"
                                                                                }`}
                                                                        >
                                                                                {isGreen ? (
                                                                                        <CheckCircle className="h-4 w-4" aria-hidden="true" />
                                                                                ) : (
                                                                                        <GitCommit className="h-4 w-4" aria-hidden="true" />
                                                                                )}
                                                                                {
                                                                                        countries.find((c) => c.alpha3 === guess)?.name[0]
                                                                                }
                                                                        </li>
                                                                );
                                                        })}
                                                </ul>
                                        </div>
                                </div>
                        </div>
                        <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                                <CountryInput
                                        onSubmit={handleGuess}
                                        disabled={gameState.status !== "playing"}
                                        suggestions={countryNames}
                                />
                        </div>
                        {gameState.rejects.length > 0 && (
                                <div className="w-full max-w-xl rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-left text-sm text-rose-100">
                                        <h3 className="font-montserrat text-base font-semibold text-rose-100">Invalid Guesses</h3>
                                        <ul className="mt-2 space-y-1">
                                                {gameState.rejects.map((reject, i) => (
                                                        <li key={i}>{reject}</li>
                                                ))}
                                        </ul>
                                </div>
                        )}
                        {gameState.status !== "playing" && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
                                        <div className="w-11/12 max-w-md space-y-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 text-center text-slate-100">
                                                <h2 className="font-montserrat text-2xl font-semibold text-white">
                                                        {gameState.status === "won" ? "You Won!" : "Game Over"}
                                                </h2>
                                                <p className="text-sm text-slate-300">
                                                        You found the path in {gameState.guesses.length - 1} guesses. The shortest possible path was {gameState.shortest - 1}.
                                                </p>
                                                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                                                        <button
                                                                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 font-montserrat text-sm font-semibold text-slate-100 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
                                                                onClick={startNewGame}
                                                        >
                                                                Play Again
                                                        </button>
                                                        <button
                                                                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 font-montserrat text-sm font-semibold text-slate-100 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
                                                                onClick={() => {
                                                                        const path = gameState.guesses
                                                                                .map((g) => {
                                                                                        const match = countries.find((c) => c.alpha3 === g);
                                                                                        return match?.name?.[0] ?? g;
                                                                                })
                                                                                .join(" → ");
                                                                        const summary = `I completed the Travle from ${
                                                                                countries.find((c) => c.alpha3 === gameState.start)?.name?.[0] ?? ""
                                                                        } to ${
                                                                                countries.find((c) => c.alpha3 === gameState.end)?.name?.[0] ?? ""
                                                                        } in ${
                                                                                gameState.guesses.length - 1
                                                                        } guesses (shortest ${gameState.shortest}).\n\n${path}`;
                                                                        navigator.clipboard.writeText(summary);
                                                                        setNotification("Results copied to clipboard!");
                                                                        setTimeout(() => setNotification(null), 3000);
                                                                }}
                                                        >
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
