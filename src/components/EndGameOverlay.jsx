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
                <div className="flex h-[60vh] w-11/12 max-w-lg flex-col overflow-hidden rounded-3xl border border-cyan-400/30 bg-slate-950/90 p-6 text-white shadow-[0_40px_90px_-45px_rgba(56,189,248,0.8)]">
                        <div className="flex flex-col gap-1 text-center font-montserrat">
                                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/70">
                                        Challenge Complete
                                </span>
                                <h2 className="text-3xl font-semibold">Game Over</h2>
                                <p className="text-sm text-white/70">
                                        You guessed {countriesGuessed} of {totalItems} {itemLabel} in {minutes}:{seconds}
                                </p>
                        </div>
                        <div className="mt-6 flex-1 overflow-y-auto rounded-2xl border border-white/5 bg-white/5 p-4 font-montserrat text-sm text-cyan-100/90">
                                <h3 className="text-base font-semibold text-white">
                                        Missed {capitalizedLabel} ({missedCountries.length})
                                </h3>
                                <div className="mt-3 space-y-4">
                                        {groupedCountries.map((group) => (
                                                <div key={group.name} className="space-y-1">
                                                        <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200/70">
                                                                {group.name} ({group.countries.length})
                                                        </h4>
                                                        <ul className="grid gap-1 text-sm text-white/80 sm:grid-cols-2">
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
                                className="mt-5 rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-4 py-3 font-montserrat text-sm font-semibold text-emerald-100 shadow-[0_12px_30px_-18px_rgba(52,211,153,0.6)] transition hover:bg-emerald-500/30"
                        >
                                {playAgainLabel}
                        </button>
                </div>
        );
};

export default EndGameOverlay;
