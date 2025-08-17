import React, { useState, useEffect, useMemo } from "react";
import { Map, Clock, Settings, Pause, Play } from "lucide-react";

import VALID_COUNTRIES from "./assets/countries_with_continents.json";
import GameBoard from "./components/GameBoard";
import StartOverlay from "./components/StartOverlay";
import CountryInput from "./components/CountryInput";
import CountryCounter from "./components/CountryCounter";
import EndGameOverlay from "./components/EndGameOverlay";

function setCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(";");
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) === " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0)
			return c.substring(nameEQ.length, c.length);
	}
	return null;
}

const NavBar = () => (
	<nav className="bg-blue-600 p-4 text-white">
		<div className="container mx-auto flex justify-between items-center">
			<h1 className="text-2xl font-bold font-montserrat tracking-wide">
				Countries of the World
			</h1>
			<div className="flex space-x-4">
				<button className="p-2 hover:bg-blue-700 rounded">
					<Map size={24} />
				</button>
				<button className="p-2 hover:bg-blue-700 rounded">
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
	const [countriesGuessed, setCountriesGuessed] = useState([
		0, 0, 0, 0, 0, 0, 0,
	]);
	const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
	const [isGameStarted, setIsGameStarted] = useState(false);
	const [isGameEnded, setIsGameEnded] = useState(false);
	const [isMenuDown, setIsMenuDown] = useState(false);
	const [isGameWon, setIsGameWon] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [guessedCountries, setGuessedCountries] = useState(new Set());
	const [feedback, setFeedback] = useState(null);
	const [bestScore, setBestScore] = useState(null);
	const [bestTime, setBestTime] = useState(null);

	const missedCountries = useMemo(
	() =>
		VALID_COUNTRIES.filter((country) => !guessedCountries.has(country)),
		[guessedCountries]
	);

	useEffect(() => {
		const storedBestScore = getCookie("bestScore");
		const storedBestTime = getCookie("bestTime");
		if (storedBestScore) {
			setBestScore(parseInt(storedBestScore));
		}
		if (storedBestTime) {
			setBestTime(parseInt(storedBestTime));
		}
	}, []);

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
		if (countriesGuessed[0] >= 197) {
			setIsGameWon(true); // Currently not used for anything
			setIsGameEnded(true);
			setIsGameStarted(false);
			updateBestScore();
		}
	}, [countriesGuessed]);

	const updateBestScore = () => {
		const currentScore = countriesGuessed[0];
		const currentTime = 15 * 60 - timeLeft; // Time spent in seconds
		if (
			!bestScore ||
			currentScore > bestScore ||
			(currentScore === bestScore && currentTime < bestTime)
		) {
			setBestScore(currentScore);
			setBestTime(currentTime);
			setCookie("bestScore", currentScore, 365);
			setCookie("bestTime", currentTime, 365);
		}
	};

	const handleStartGame = () => {
		setIsGameStarted(true);
		setIsGameEnded(false);
		setIsGameWon(false);
		setTimeLeft(15 * 60); // Reset to 15 minutes
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
		const validCountry = VALID_COUNTRIES.find((c) =>
			c.name.find((a) => a.toLowerCase() === normalizedCountry)
		);

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

	return (
		<div className="min-h-screen bg-gray-200">
			<NavBar />
			<div className="container mx-auto mt-8 relative">
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
						count={countriesGuessed}
						isGameEnded={isGameEnded}
					/>
				)}
				<CountryInput
					onSubmit={handleCountrySubmit}
					disabled={!isGameStarted || isPaused || timeLeft === 0}
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
