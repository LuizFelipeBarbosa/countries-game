import { useState, useEffect, useMemo, useCallback } from "react";

import GameBoard from "./components/GameBoard";
import StartOverlay from "./components/StartOverlay";
import CountryInput from "./components/CountryInput";
import CountryCounter from "./components/CountryCounter";
import EndGameOverlay from "./components/EndGameOverlay";
import OutlineGame from "./features/outline/OutlineGame";
import TravleGame from "./features/travle/TravleGame";
import Home from "./pages/Home";
import { setItem, getItem, removeItem } from "./utils/storage";
import { CONTINENTS, TOTAL_COUNTRIES } from "./constants/continents";
import NavBar from "./components/ui/NavBar";
import GameTimer from "./components/ui/GameTimer";
import { GiveUpButton, PauseButton } from "./components/ui/Buttons";
import FeedbackMessage from "./components/ui/FeedbackMessage";
import { useCountriesData } from "./hooks/useCountriesData";

const BestScoreDisplay = ({ bestScore, bestTime }) => (
	<div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm">
		<div className="flex items-center justify-between text-slate-400">
			<span>Best Score</span>
			<span className="font-semibold text-white">
				{bestScore !== null ? bestScore : "—"}
			</span>
		</div>
		<div className="mt-1 flex items-center justify-between text-slate-400">
			<span>Best Time</span>
			<span className="font-semibold text-white">
				{bestTime !== null
					? `${Math.floor(bestTime / 60)}:${(bestTime % 60)
							.toString()
							.padStart(2, "0")}`
					: "—"}
			</span>
		</div>
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

	const renderGameLayout = (content) => (
		<div className="min-h-screen bg-slate-950 text-slate-100">
			<div className="flex min-h-screen flex-col">
				<NavBar onSelect={handleSelectGame} />
				<main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pb-12 pt-6 sm:px-6">
					{content}
				</main>
			</div>
		</div>
	);

	if (!gameMode) {
		return renderGameLayout(<Home onSelect={handleSelectGame} />);
	}

	if (gameMode === "outline") {
		return renderGameLayout(<OutlineGame />);
	}

	if (gameMode === "travle") {
		return renderGameLayout(<TravleGame />);
	}

	const areControlsDisabled = !isGameStarted || isGameEnded;

	return renderGameLayout(
		<>
			<div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
				<div className="order-2 lg:order-1">
					<div className="relative overflow-hidden rounded-lg border border-slate-800 bg-slate-900 p-2">
						<GameBoard
							isBlurred={isPaused}
							guessedCountries={guessedCountries}
							isGameEnded={isGameEnded}
							isGameStarted={isGameStarted}
						/>
						{!isGameStarted && !isGameEnded && (
							<div className="absolute inset-0">
								<StartOverlay
									onStart={handleStartGame}
									gameDuration={gameDuration}
									onDurationChange={setGameDuration}
								/>
							</div>
						)}
						{isGameEnded && (
							<div className="absolute inset-0 flex items-center justify-center bg-slate-950/90">
								<EndGameOverlay
									missedCountries={missedCountries}
									onPlayAgain={handleStartGame}
									countriesGuessed={countriesGuessed[0]}
									timeTaken={gameDuration - timeLeft}
								/>
							</div>
						)}
					</div>
				</div>
				<aside className="order-1 flex flex-col gap-3 lg:order-2">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold text-white">
							World Map
						</h2>
						<GameTimer timeLeft={timeLeft} />
					</div>
					<CountryCounter
						onToggleMenu={handleToggleMenu}
						isMenuDown={isMenuDown}
						count={countriesGuessed}
					/>
					<div className="flex items-center gap-2">
						<PauseButton
							isPaused={isPaused}
							onTogglePause={handleTogglePause}
							disabled={areControlsDisabled}
						/>
						<GiveUpButton
							onGiveUp={handleGiveUp}
							disabled={areControlsDisabled}
						/>
					</div>
					<BestScoreDisplay
						bestScore={bestScore}
						bestTime={bestTime}
					/>
					{feedback && (
						<FeedbackMessage
							message={feedback.message}
							type={feedback.type}
						/>
					)}
				</aside>
			</div>
			<div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
				<CountryInput
					onSubmit={handleCountrySubmit}
					disabled={!isGameStarted || isPaused || timeLeft === 0}
					suggestions={countryNames}
				/>
			</div>
		</>
	);
};

export default App;
