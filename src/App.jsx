import { useState, useEffect, useMemo } from "react";
import { Map, Settings, Pause, Play } from "lucide-react";

import VALID_COUNTRIES from "./assets/countries_with_continents.json";
import GameBoard from "./components/GameBoard";
import StartOverlay from "./components/StartOverlay";
import CountryInput from "./components/CountryInput";
import CountryCounter from "./components/CountryCounter";
import EndGameOverlay from "./components/EndGameOverlay";
import OutlineGame from "./components/OutlineGame";
import Home from "./Home";
import { setItem, getItem } from "./utils/storage";
import { CONTINENTS, TOTAL_COUNTRIES } from "./constants/continents";

const NavBar = () => (
        <nav className="bg-blue-600 p-4 text-white">
                <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
                        <h1 className="text-xl sm:text-2xl font-bold font-montserrat tracking-wide">
                                Countries of the World
                        </h1>
                        <div className="flex space-x-4 mt-4 sm:mt-0">
                                <button
                                        className="p-2 hover:bg-blue-700 rounded"
                                        aria-label="Map"
                                >
                                        <Map size={24} />
                                </button>
                                <button
                                        className="p-2 hover:bg-blue-700 rounded"
                                        aria-label="Settings"
                                >
                                        <Settings size={24} />
                                </button>
                        </div>
                </div>
        </nav>
);

const GameTimer = ({ timeLeft }) => (
	<div className="bg-white p-2 rounded shadow">
		<p className="font-bold font-montserrat">
			{Math.floor(timeLeft / 60)}:
			{(timeLeft % 60).toString().padStart(2, "0")}
		</p>
	</div>
	);

const GiveUpButton = ({ onGiveUp }) => (
	<button
		onClick={onGiveUp}
		className="bg-red-500 hover:bg-red-600 text-white p-1 rounded shadow mt-2 w-full font-medium font-montserrat"
	>
		Give Up
	</button>
	);

const PauseButton = ({ isPaused, onTogglePause }) => (
	<button
		onClick={onTogglePause}
		className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded shadow ml-2"
	>
		{isPaused ? <Play size={24} /> : <Pause size={24} />}
	</button>
	);

const FeedbackMessage = ({ message, type }) => (
	<div
		className={`mt-2 p-2 font-montserrat rounded ${
			type === "success"
				? "bg-green-100 text-green-700"
				: "bg-red-100 text-red-700"
		}`}
	>
		{message}
	</div>
);

const BestScoreDisplay = ({ bestScore, bestTime }) => (
	<div className="bg-white p-2 rounded shadow mt-4">
		<p className="font-bold font-montserrat">
			Best Score: {bestScore !== null ? bestScore : "N/A"}
		</p>
		<p className="font-bold font-montserrat">
			Best Time:
			{bestTime !== null
				? `${Math.floor(bestTime / 60)}:${(bestTime % 60)
						.toString()
						.padStart(2, "0")}`
				: "N/A"}
		</p>
	</div>
);

const App = () => {

        const [gameMode, setGameMode] = useState(null); // 'world' or 'outline'
        const [countriesGuessed, setCountriesGuessed] = useState([
                0,
                ...Array(CONTINENTS.length).fill(0),
        ]);
        const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
        const [gameDuration, setGameDuration] = useState(15 * 60); // default 15 minutes in seconds
        const [isGameStarted, setIsGameStarted] = useState(false);
        const [isGameEnded, setIsGameEnded] = useState(false);
        const [isMenuDown, setIsMenuDown] = useState(false);
        const [isPaused, setIsPaused] = useState(false);
        const [guessedCountries, setGuessedCountries] = useState(new Set());
        const [feedback, setFeedback] = useState(null);
        const [bestScore, setBestScore] = useState(null);
        const [bestTime, setBestTime] = useState(null);

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

	const missedCountries = useMemo(
	() =>
		VALID_COUNTRIES.filter((country) => !guessedCountries.has(country)),
		[guessedCountries]
	);

        useEffect(() => {
                const storedBestScore = getItem("bestScore");
                const storedBestTime = getItem("bestTime");
                if (storedBestScore !== null) {
                        setBestScore(parseInt(storedBestScore));
                }
                if (storedBestTime !== null) {
                        setBestTime(parseInt(storedBestTime));
                }
        }, []);

        useEffect(() => {
                if (!isGameStarted) {
                        setTimeLeft(gameDuration);
                }
        }, [gameDuration, isGameStarted]);

	useEffect(() => {
		let timer;
		if (isGameStarted && !isPaused && timeLeft > 0) {
			timer = setInterval(() => {
				setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
			}, 1000);
		} else if (timeLeft === 0) {
			setIsGameEnded(true);
			setIsGameStarted(false);
			updateBestScore();
		}
		return () => clearInterval(timer);
	}, [isGameStarted, isPaused, timeLeft]);

	useEffect(() => {
                if (countriesGuessed[0] >= TOTAL_COUNTRIES) {
                        setIsGameEnded(true);
                        setIsGameStarted(false);
                        updateBestScore();
                }
        }, [countriesGuessed]);

        const updateBestScore = () => {
                const currentScore = countriesGuessed[0];
                const currentTime = gameDuration - timeLeft; // Time spent in seconds
                if (
                        !bestScore ||
                        currentScore > bestScore ||
                        (currentScore === bestScore && currentTime < bestTime)
                ) {
                        setBestScore(currentScore);
                        setBestTime(currentTime);
                        setItem("bestScore", currentScore);
                setItem("bestTime", currentTime);
                }
        };

        const handleSelectGame = (mode) => {
                setGameMode(mode);
                setIsGameStarted(false);
                setIsGameEnded(false);
                setIsPaused(false);
                setTimeLeft(gameDuration);
                setCountriesGuessed([0, 0, 0, 0, 0, 0, 0]);
                setGuessedCountries(new Set());
                setFeedback(null);
        };

        const handleStartGame = () => {
                setIsGameStarted(true);
                setIsGameEnded(false);
                setTimeLeft(gameDuration); // Reset to selected duration
                setCountriesGuessed([0, 0, 0, 0, 0, 0, 0]);
                setIsPaused(false);
                setGuessedCountries(new Set()); // Reset guessed countries
                setFeedback(null);
        };

	const handleTogglePause = () => {
		setIsPaused(!isPaused);
	};

	const handleToggleMenu = () => {
		setIsMenuDown(!isMenuDown);
	};

	const handleGiveUp = () => {
		setIsGameEnded(true);
		setIsGameStarted(false);
		setIsPaused(false);
		setFeedback({
			message: `Game ended. You guessed ${countriesGuessed[0]} countries.`,
			type: "error",
		});
		updateBestScore();
		setTimeout(() => setFeedback(null), 3000);
	};

        const handleCountrySubmit = (country) => {
                const normalizedCountry = country.trim().toLowerCase();
                const validCountry = countryMap[normalizedCountry];

		if (validCountry) {
			if (guessedCountries.has(validCountry)) {
				setFeedback({
					message: `You've already guessed ${validCountry.name[0]}!`,
					type: "error",
				});
			} else {
				setGuessedCountries((prev) => new Set(prev).add(validCountry));
				setCountriesGuessed((prev) => {
					const newCount = [...prev];
					newCount[0] += 1; // Increment total countries guessed
					newCount[validCountry.continent] += 1; // Increment continent-specific count
					return newCount;
				});
				setFeedback({
					message: `Correct! ${validCountry.name[0]} added.`,
					type: "success",
				});
			}
		} else {
			setFeedback({
				message: `${country} is not a valid country name.`,
				type: "error",
			});
		}

		setTimeout(() => setFeedback(null), 3000);
	};

        if (!gameMode) {
                return <Home onSelect={handleSelectGame} />;
        }

        if (gameMode === "outline") {
                return (
                        <div className="min-h-screen bg-gray-200">
                                <NavBar />
                                <div className="container mx-auto mt-8 relative px-4">
                                        <OutlineGame
                                                isBlurred={isPaused}
                                                isGameStarted={isGameStarted}
                                                isGameEnded={isGameEnded}
                                        />
                                        {isGameEnded && (
                                                <>
                                                        <div className="absolute top-4 right-4 flex items-center">
                                                                <GameTimer timeLeft={timeLeft} />
                                                        </div>
                                                        {missedOutlines.length === 0 ? (
                                                                <div className="bg-white rounded shadow p-6 text-center mt-8">
                                                                        <h2 className="text-xl font-semibold mb-2">No missed outlines!</h2>
                                                                        <button
                                                                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                                                onClick={handleStartGame}
                                                                        >
                                                                                Play Again
                                                                        </button>
                                                                </div>
                                                        ) : (
                                                                <EndGameOverlay
                                                                        missedCountries={[]}
                                                                        onPlayAgain={handleStartGame}
                                                                        countriesGuessed={0}
                                                                        timeTaken={gameDuration - timeLeft}
                                                                        totalItems={0}
                                                                        itemLabel="outlines"
                                                                        hideScore={true}
                                                                />
                                                        )}
                                                </>
                                        )}
                                        {isGameStarted && (
                                                <div className="absolute top-4 right-4">
                                                        <div className="flex items-center">
                                                                <GameTimer timeLeft={timeLeft} />
                                                                <PauseButton
                                                                        isPaused={isPaused}
                                                                        onTogglePause={handleTogglePause}
                                                                />
                                                        </div>
                                                        <GiveUpButton onGiveUp={handleGiveUp} />
                                                </div>
                                        )}
                                        {!isGameStarted && !isGameEnded && (
                                                <StartOverlay
                                                        onStart={handleStartGame}
                                                        gameDuration={gameDuration}
                                                        onDurationChange={setGameDuration}
                                                        startLabel="Start Quiz"
                                                />
                                        )}
                                        {feedback && (
                                                <FeedbackMessage
                                                        message={feedback.message}
                                                        type={feedback.type}
                                                />
                                        )}
                                </div>
                        </div>
                );
        }

        return (
                <div className="min-h-screen bg-gray-200">
                        <NavBar />
                        <div className="container mx-auto mt-8 relative px-4">
                                <GameBoard
                                        isBlurred={isPaused}
                                        guessedCountries={guessedCountries}
                                        isGameEnded={isGameEnded}
                                        isGameStarted={isGameStarted}
                                />
                                {isGameEnded && (
                                        <>
                                                <CountryCounter
                                                        onToggleMenu={handleToggleMenu}
                                                        isMenuDown={isMenuDown}
                                                        count={countriesGuessed}
                                                />
                                                <div className="absolute top-4 right-4 flex items-center">
                                                        <GameTimer timeLeft={timeLeft} />
                                                </div>
                                                <EndGameOverlay
                                                        missedCountries={missedCountries}
                                                        onPlayAgain={handleStartGame}
                                                        countriesGuessed={countriesGuessed[0]}
                                                        timeTaken={gameDuration - timeLeft}
                                                />
                                        </>
                                )}
                                {isGameStarted && (
                                        <>
                                                <CountryCounter
                                                        onToggleMenu={handleToggleMenu}
                                                        isMenuDown={isMenuDown}
                                                        count={countriesGuessed}
                                                />
                                                <div className="absolute top-4 right-4">
                                                        <div className="flex items-center">
                                                                <GameTimer timeLeft={timeLeft} />
                                                                <PauseButton
                                                                        isPaused={isPaused}
                                                                        onTogglePause={handleTogglePause}
                                                                />
                                                        </div>
                                                        <GiveUpButton onGiveUp={handleGiveUp} />
                                                </div>
                                        </>
                                )}
                                {!isGameStarted && !isGameEnded && (
                                        <StartOverlay
                                                onStart={handleStartGame}
                                                gameDuration={gameDuration}
                                                onDurationChange={setGameDuration}
                                        />
                                )}
                                <CountryInput
                                        onSubmit={handleCountrySubmit}
                                        disabled={!isGameStarted || isPaused || timeLeft === 0}
                                        suggestions={countryNames}
                                />
                                {feedback && (
                                        <FeedbackMessage
                                                message={feedback.message}
                                                type={feedback.type}
                                        />
                                )}
                                <BestScoreDisplay bestScore={bestScore} bestTime={bestTime} />
                        </div>
                </div>
        );
};

export default App;
