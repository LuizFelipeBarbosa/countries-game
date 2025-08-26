import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import CountryInput from "../../components/CountryInput";
import EndGameOverlay from "../../components/EndGameOverlay";
import QUALITY_OUTLINE_MAP from "../../assets/quality_outline_map.json";
import { CONTINENTS } from "../../constants/continents";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import { useCountriesData } from "../../hooks/useCountriesData";

const OutlineGame = () => {
	const [attempts, setAttempts] = useState(0);
	const [correct, setCorrect] = useState(0);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [guessedCountries, setGuessedCountries] = useState(new Set());
	const [feedback, setFeedback] = useState(null);
	const [isGameEnded, setIsGameEnded] = useState(false);
	const [currentCountry, setCurrentCountry] = useState(null);
	const [hint, setHint] = useState(null);

	const { countryMap, countryNames, VALID_COUNTRIES } = useCountriesData();

	const isGameEndedRef = useRef(isGameEnded);
	const feedbackTimeoutRef = useRef(null);
	const svgObjectRef = useRef(null);

	const handleSvgLoad = () => {
		const svgDoc = svgObjectRef.current?.contentDocument;
		const svgEl = svgDoc?.querySelector("svg");
		if (svgEl) {
			const bbox = svgEl.getBBox();
			svgEl.setAttribute(
				"viewBox",
				`${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`
			);
			svgEl.removeAttribute("width");
			svgEl.removeAttribute("height");
			svgEl.setAttribute("width", "100%");
			svgEl.setAttribute("height", "100%");
		}
	};

	const getRandomCountry = useCallback(
		(exclude = guessedCountries) => {
			const remaining = VALID_COUNTRIES.filter((c) => !exclude.has(c));
			if (remaining.length === 0) return null;
			const index = Math.floor(Math.random() * remaining.length);
			return remaining[index];
		},
		[guessedCountries, VALID_COUNTRIES]
	);

	// Keep the ref in sync with the state
	useEffect(() => {
		isGameEndedRef.current = isGameEnded;
	}, [isGameEnded]);

	useEffect(() => {
		setCurrentCountry(getRandomCountry());
	}, [getRandomCountry]);

	useEffect(() => {
		setHint(null);
	}, [currentCountry]);

	useEffect(() => {
		const timer = setInterval(() => {
			if (!isGameEndedRef.current) {
				setElapsedTime((prev) => prev + 1);
			}
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	// countryMap and countryNames provided by hook

	const handleGuess = (guess) => {
		if (isGameEnded) return;

		const normalized = guess.trim().toLowerCase();
		if (!normalized) return;

		setAttempts((prev) => prev + 1);

		const validCountry = countryMap[normalized];
		let updatedGuessed = guessedCountries;
		let answeredCorrectly = false;

		if (validCountry) {
			if (validCountry === currentCountry) {
				if (!guessedCountries.has(validCountry)) {
					updatedGuessed = new Set(guessedCountries);
					updatedGuessed.add(validCountry);
					setGuessedCountries(updatedGuessed);
					setCorrect((prev) => prev + 1);
					setFeedback({
						message: `Correct! ${validCountry.name[0]} added.`,
						type: "success",
					});
					answeredCorrectly = true;
				} else {
					setFeedback({
						message: `You've already guessed ${validCountry.name[0]}!`,
						type: "error",
					});
				}
			} else if (guessedCountries.has(validCountry)) {
				setFeedback({
					message: `You've already guessed ${validCountry.name[0]}!`,
					type: "error",
				});
			} else {
				setFeedback({
					message: `${guess} is not correct.`,
					type: "error",
				});
			}
		} else {
			setFeedback({
				message: `${guess} is not a valid country name.`,
				type: "error",
			});
		}

		clearTimeout(feedbackTimeoutRef.current);
		feedbackTimeoutRef.current = setTimeout(() => setFeedback(null), 3000);

		if (answeredCorrectly) {
			const next = getRandomCountry(updatedGuessed);
			if (next) {
				setCurrentCountry(next);
			} else {
				setIsGameEnded(true);
			}
		}
	};

	const handleEndRound = () => {
		setIsGameEnded(true);
	};

	const handleSkip = () => {
		if (isGameEnded) return;
		setAttempts((prev) => prev + 1);
		if (currentCountry) {
			setFeedback({
				message: `Skipped! The correct answer was: ${currentCountry.name[0]}.`,
				type: "info",
			});
			clearTimeout(feedbackTimeoutRef.current);
			feedbackTimeoutRef.current = setTimeout(
				() => setFeedback(null),
				3000
			);
		}
		const next = getRandomCountry();
		if (next) {
			setCurrentCountry(next);
		} else {
			setIsGameEnded(true);
		}
	};

	const handleHint = () => {
		if (isGameEnded || !currentCountry) return;
		const continentName = CONTINENTS[currentCountry.continent - 1].name;
		setHint(`This country is in ${continentName}.`);
		setTimeout(() => setHint(null), 10000);
	};

	const missedCountries = useMemo(() => {
		return VALID_COUNTRIES.filter((c) => !guessedCountries.has(c));
	}, [guessedCountries, VALID_COUNTRIES]);

	const handlePlayAgain = () => {
		setAttempts(0);
		setCorrect(0);
		setElapsedTime(0);
		setGuessedCountries(new Set());
		setFeedback(null);
		setIsGameEnded(false);
		setCurrentCountry(getRandomCountry(new Set()));
	};

	const minutes = Math.floor(elapsedTime / 60);
	const seconds = (elapsedTime % 60).toString().padStart(2, "0");

	return (
		<div className="flex flex-col items-center text-center">
			{feedback && (
				<FeedbackMessage
					message={feedback.message}
					type={feedback.type}
				/>
			)}
			{hint && <FeedbackMessage message={hint} type="hint" />}

			<div className="w-full max-w-md mx-auto">
				{isGameEnded ? (
					<div className="flex flex-col md:flex-row justify-center my-6 gap-4 items-center">
						{currentCountry && (
							<div className="w-full h-auto drop-shadow-lg p-4 bg-white rounded-lg">
								<object
									data={`/quality_outlines/${
										QUALITY_OUTLINE_MAP[currentCountry.alpha2]
									}`}
									type="image/svg+xml"
									role="img"
									aria-label="Country outline"
									ref={svgObjectRef}
									onLoad={handleSvgLoad}
									className="w-full h-full"
								/>
							</div>
						)}
						<EndGameOverlay
							missedCountries={missedCountries}
							onPlayAgain={handlePlayAgain}
							countriesGuessed={correct}
							timeTaken={elapsedTime}
						/>
					</div>
				) : (
					currentCountry && (
						<div className="my-6 bg-white p-4 rounded-lg shadow-md">
							<object
								data={`/quality_outlines/${
									QUALITY_OUTLINE_MAP[currentCountry.alpha2]
								}`}
								type="image/svg+xml"
								role="img"
								aria-label="Country outline"
								ref={svgObjectRef}
								onLoad={handleSvgLoad}
								className="w-full h-auto drop-shadow-lg"
							/>
						</div>
					)
				)}
			</div>

			<div data-testid="score-container" className="font-montserrat mb-4 text-lg bg-white px-4 py-2 rounded-lg shadow-md">
				<span className="font-bold">Attempts:</span> {attempts} | <span className="font-bold">Correct:</span> {correct} | <span className="font-bold">Time:</span> {minutes}:{seconds}
			</div>
			<div className="flex space-x-4 mb-4">
				<button
					onClick={handleHint}
					className="bg-accent hover:bg-accent-dark text-white font-montserrat py-2 px-6 rounded-lg shadow-md transition-all duration-200"
				>
					Hint
				</button>
				<button
					onClick={handleSkip}
					className="bg-secondary hover:bg-secondary-dark text-white font-montserrat py-2 px-6 rounded-lg shadow-md transition-all duration-200"
				>
					Skip
				</button>
				<button
					onClick={handleEndRound}
					className="bg-primary hover:bg-primary-dark text-white font-montserrat py-2 px-6 rounded-lg shadow-md transition-all duration-200"
				>
					End Round
				</button>
			</div>
			<div className="w-full max-w-md">
				<CountryInput
					onSubmit={handleGuess}
					disabled={isGameEnded}
					suggestions={countryNames}
				/>
			</div>
		</div>
	);
};

export default OutlineGame;
