import { CONTINENTS, TOTAL_COUNTRIES } from "../constants/continents";

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

        const missedByContinent = CONTINENTS.map(() => []);
        missedCountries.forEach((country) => {
                const index = country.continent - 1;
                if (missedByContinent[index]) {
                        missedByContinent[index].push(country);
                }
        });

        return (
                <div className="bg-white p-6 rounded-lg max-h-[80vh] w-11/12 sm:w-96 flex flex-col">
                        <h2 className="text-2xl font-bold mb-4 font-montserrat text-center">
                                Game Over
                        </h2>
                        <p className="text-center mb-4 font-montserrat">
                                You guessed {countriesGuessed} of {totalItems} {itemLabel}{" "}
                                in {minutes}:{seconds}
                        </p>
                        <h3 className="text-xl font-bold mb-2 font-montserrat text-center">
                                Missed {capitalizedLabel} ({missedCountries.length})
                        </h3>
                        <div className="flex-1 overflow-y-auto mb-4">
                                {missedByContinent.map((countries, idx) => (
                                        countries.length > 0 && (
                                                <div key={CONTINENTS[idx].name} className="mb-2">
                                                        <h4 className="font-semibold font-montserrat">
                                                                {CONTINENTS[idx].name}
                                                        </h4>
                                                        <ul className="ml-4 list-disc">
                                                                {countries.map((country) => (
                                                                        <li
                                                                                key={country.alpha2}
                                                                                className="font-montserrat"
                                                                        >
                                                                                {country.name[0]}
                                                                        </li>
                                                                ))}
                                                        </ul>
                                                </div>
                                        )
                                ))}
                        </div>
                        <button
                                onClick={onPlayAgain}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full font-montserrat"
                        >
                                {playAgainLabel}
                        </button>
                </div>
        );
};

export default EndGameOverlay;
