import { useState, useEffect, useMemo, useCallback } from "react";

import GameBoard from "./components/GameBoard";
import StartOverlay from "./components/StartOverlay";
import CountryInput from "./components/CountryInput";
import CountryCounter from "./components/CountryCounter";
import EndGameOverlay from "./components/EndGameOverlay";
import OutlineGame from "./components/OutlineGame";
import TravleGame from "./components/TravleGame";
import Home from "./Home";
import { setItem, getItem, removeItem } from "./utils/storage";
import { CONTINENTS, TOTAL_COUNTRIES } from "./constants/continents";
import NavBar from "./components/ui/NavBar";
import GameTimer from "./components/ui/GameTimer";
import { GiveUpButton, PauseButton } from "./components/ui/Buttons";
import FeedbackMessage from "./components/ui/FeedbackMessage";
import { useCountriesData } from "./hooks/useCountriesData";

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

	const { countryMap, countryNames, VALID_COUNTRIES } = useCountriesData();

	const updateBestScore = useCallback(() => {
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
	}, [countriesGuessed, gameDuration, timeLeft, bestScore, bestTime]);

	const missedCountries = useMemo(
		() =>
			VALID_COUNTRIES.filter((country) => !guessedCountries.has(country)),
		[guessedCountries, VALID_COUNTRIES]
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
	}, [isGameStarted, isPaused, timeLeft, updateBestScore]);

	useEffect(() => {
		if (countriesGuessed[0] >= TOTAL_COUNTRIES) {
			setIsGameEnded(true);
			setIsGameStarted(false);
			updateBestScore();
		}
	}, [countriesGuessed, updateBestScore]);

	const handleSelectGame = (mode) => {
		if (mode === "travle") {
			removeItem("travleGameState");
		}
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
				<NavBar onSelect={handleSelectGame} />
				<div className="container mx-auto mt-8 relative px-4">
					<OutlineGame onReturn={() => setGameMode(null)} />
				</div>
			</div>
		);
	}

	if (gameMode === "travle") {
		return (
			<div className="min-h-screen bg-gray-200">
				<NavBar onSelect={handleSelectGame} />
				<div className="container mx-auto mt-8 relative px-4">
					<TravleGame onReturn={() => setGameMode(null)} />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-200">
			<NavBar onSelect={handleSelectGame} />
			<div className="container mx-auto mt-8 relative px-4">
				<div className="flex flex-col md:flex-row gap-4">
					<GameBoard
						isBlurred={isPaused}
						guessedCountries={guessedCountries}
						isGameEnded={isGameEnded}
						isGameStarted={isGameStarted}
					/>
					{isGameEnded && (
						<EndGameOverlay
							missedCountries={missedCountries}
							onPlayAgain={handleStartGame}
							countriesGuessed={countriesGuessed[0]}
							timeTaken={gameDuration - timeLeft}
						/>
					)}
				</div>
				{isGameEnded && (
					<>
						<CountryCounter
							onToggleMenu={handleToggleMenu}
							isMenuDown={isMenuDown}
							count={countriesGuessed}
						/>
						<div className="absolute top-4 right-8 flex items-center">
							<GameTimer timeLeft={timeLeft} />
						</div>
					</>
				)}
				{isGameStarted && (
					<>
						<CountryCounter
							onToggleMenu={handleToggleMenu}
							isMenuDown={isMenuDown}
							count={countriesGuessed}
						/>
						<div className="absolute top-4 right-8">
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
