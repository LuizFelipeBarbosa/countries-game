import { TOTAL_COUNTRIES, CONTINENTS } from "../constants/continents";

const EndGameOverlay = ({
        missedCountries,
        onPlayAgain,
        countriesGuessed,
        timeTaken,
        totalItems = TOTAL_COUNTRIES,
        itemLabel = "countries",
        playAgainLabel = "Play Again",
}) => {
        const minutes = Math.floor(timeTaken / 60);
        const seconds = (timeTaken % 60).toString().padStart(2, "0");

        const capitalizedLabel =
                itemLabel.charAt(0).toUpperCase() + itemLabel.slice(1);

        const groupedCountries = CONTINENTS.map((continent, index) => ({
                name: continent.name,
                countries: missedCountries.filter(
                        (country) => country.continent === index + 1
                ),
        })).filter((group) => group.countries.length > 0);

        return (
                <div className="flex h-[60vh] w-11/12 max-w-lg flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90 p-6 text-slate-100">
                        <div className="flex flex-col gap-1 text-center font-montserrat">
                                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                        Challenge Complete
                                </span>
                                <h2 className="text-3xl font-semibold text-white">Game Over</h2>
                                <p className="text-sm text-slate-400">
                                        You guessed {countriesGuessed} of {totalItems} {itemLabel} in {minutes}:{seconds}
                                </p>
                        </div>
                        <div className="mt-6 flex-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/70 p-4 font-montserrat text-sm text-slate-200">
                                <h3 className="text-base font-semibold text-white">
                                        Missed {capitalizedLabel} ({missedCountries.length})
                                </h3>
                                <div className="mt-3 space-y-4">
                                        {groupedCountries.map((group) => (
                                                <div key={group.name} className="space-y-1">
                                                        <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                                                                {group.name} ({group.countries.length})
                                                        </h4>
                                                        <ul className="grid gap-1 text-sm text-slate-300 sm:grid-cols-2">
                                                                {group.countries.map((country) => (
                                                                        <li key={country.alpha2}>{country.name[0]}</li>
                                                                ))}
                                                        </ul>
                                                </div>
                                        ))}
                                </div>
                        </div>
                        <button
                                onClick={onPlayAgain}
                                type="button"
                                className="mt-5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 font-montserrat text-sm font-semibold text-slate-100 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
                        >
                                {playAgainLabel}
                        </button>
                </div>
        );
};

export default EndGameOverlay;
