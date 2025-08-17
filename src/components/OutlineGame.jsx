import { useState, useEffect, useMemo, useRef } from "react";
import CountryInput from "./CountryInput";
import EndGameOverlay from "./EndGameOverlay";
import VALID_COUNTRIES from "../assets/countries_with_continents.json";

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

const OutlineGame = ({ onReturn = () => {} }) => {
        const [attempts, setAttempts] = useState(0);
        const [correct, setCorrect] = useState(0);
        const [elapsedTime, setElapsedTime] = useState(0);
        const [guessedCountries, setGuessedCountries] = useState(new Set());
        const [feedback, setFeedback] = useState(null);
        const [isGameEnded, setIsGameEnded] = useState(false);
        const [currentCountry, setCurrentCountry] = useState(null);

        const isGameEndedRef = useRef(isGameEnded);
        const feedbackTimeoutRef = useRef(null);

        const getRandomCountry = (exclude = guessedCountries) => {
                const remaining = VALID_COUNTRIES.filter((c) => !exclude.has(c));
                if (remaining.length === 0) return null;
                const index = Math.floor(Math.random() * remaining.length);
                return remaining[index];
        };

        // Keep the ref in sync with the state
        useEffect(() => {
                isGameEndedRef.current = isGameEnded;
        }, [isGameEnded]);

        useEffect(() => {
                setCurrentCountry(getRandomCountry());
        }, []);

        useEffect(() => {
                const timer = setInterval(() => {
                        if (!isGameEndedRef.current) {
                                setElapsedTime((prev) => prev + 1);
                        }
                }, 1000);

                return () => clearInterval(timer);
        }, []);

        const countryMap = useMemo(() => {
                const map = {};
                VALID_COUNTRIES.forEach((c) => {
                        c.name.forEach((n) => {
                                map[n.toLowerCase()] = c;
                        });
                });
                return map;
        }, []);

        const countryNames = useMemo(() => {
                return VALID_COUNTRIES.flatMap((c) => c.name);
        }, []);

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

        const missedCountries = useMemo(() => {
                return VALID_COUNTRIES.filter((c) => !guessedCountries.has(c));
        }, [guessedCountries]);

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
                <div className="p-4 flex flex-col items-center text-center">
                        <button
                                onClick={onReturn}
                                className="text-blue-500 underline mb-4 self-start font-montserrat"
                        >
                                Back to Home
                        </button>
                        {currentCountry && (
                                <div className="flex justify-center mb-6">
                                        <img
                                                src={`/outlines/${currentCountry.alpha2}.svg`}
                                                alt="Country outline"
                                                className="w-96 h-96 drop-shadow-lg"
                                        />
                                </div>
                        )}
                        <div className="font-montserrat mb-4 text-lg">
                                Attempts: {attempts} | Correct: {correct} | Time: {minutes}:{seconds}
                        </div>
                        <div className="w-full max-w-md">
                                <CountryInput
                                        onSubmit={handleGuess}
                                        disabled={isGameEnded}
                                        suggestions={countryNames}
                                />
                        </div>
                        {feedback && (
                                <FeedbackMessage
                                        message={feedback.message}
                                        type={feedback.type}
                                />
                        )}
                        <button
                                onClick={handleEndRound}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-montserrat py-2 px-4 rounded mt-6 shadow"
                        >
                                End Round
                        </button>
                        {isGameEnded && (
                                <EndGameOverlay
                                        missedCountries={missedCountries}
                                        onPlayAgain={handlePlayAgain}
                                        countriesGuessed={correct}
                                        timeTaken={elapsedTime}
                                />
                        )}
                </div>
        );
};

export default OutlineGame;
