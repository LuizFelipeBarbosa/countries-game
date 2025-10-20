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
                        svgEl.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
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
                                feedbackTimeoutRef.current = setTimeout(() => setFeedback(null), 3000);
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

        const infoCard = currentCountry ? (
                <div className="flex w-full justify-center">
                        <div className="flex h-72 w-full max-w-md items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                                <object
                                        data={`/quality_outlines/${QUALITY_OUTLINE_MAP[currentCountry.alpha2]}`}
                                        type="image/svg+xml"
                                        role="img"
                                        aria-label="Country outline"
                                        ref={svgObjectRef}
                                        onLoad={handleSvgLoad}
                                        className="h-full w-full"
                                />
                        </div>
                </div>
        ) : null;

        return (
                <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 text-center">
                        <div className="flex w-full flex-col items-center gap-3">
                                {feedback && (
                                        <FeedbackMessage message={feedback.message} type={feedback.type} className="w-full max-w-sm" />
                                )}
                                {hint && (
                                        <FeedbackMessage message={hint} type="hint" className="w-full max-w-sm" />
                                )}
                        </div>

                        {isGameEnded ? (
                                <div className="flex w-full flex-col gap-6 md:flex-row md:items-start md:text-left">
                                        {infoCard}
                                        <div className="flex w-full justify-center md:justify-end">
                                                <EndGameOverlay
                                                        missedCountries={missedCountries}
                                                        onPlayAgain={handlePlayAgain}
                                                        countriesGuessed={correct}
                                                        timeTaken={elapsedTime}
                                                        totalItems={VALID_COUNTRIES.length}
                                                        itemLabel="countries"
                                                />
                                        </div>
                                </div>
                        ) : (
                                <>
                                        {infoCard}
                                        <div className="font-montserrat text-lg text-slate-200">
                                                Attempts: {attempts} | Correct: {correct} | Time: {minutes}:{seconds}
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-3">
                                                <button
                                                        onClick={handleHint}
                                                        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 font-montserrat text-sm font-semibold text-slate-100 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
                                                >
                                                        Hint
                                                </button>
                                                <button
                                                        onClick={handleSkip}
                                                        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 font-montserrat text-sm font-semibold text-slate-100 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
                                                >
                                                        Skip
                                                </button>
                                                <button
                                                        onClick={handleEndRound}
                                                        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 font-montserrat text-sm font-semibold text-slate-100 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
                                                >
                                                        End Round
                                                </button>
                                        </div>
                                </>
                        )}

                        <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
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
