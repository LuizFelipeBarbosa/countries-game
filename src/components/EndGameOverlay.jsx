import React from "react";

const EndGameOverlay = ({ missedCountries, onPlayAgain }) => {
	return (
		<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
			<div className="bg-white p-6 rounded-lg max-h-[80vh] w-80 sm:w-96 flex flex-col">
				<h2 className="text-2xl font-bold mb-4 font-montserrat text-center">
					Missed Countries ({missedCountries.length})
				</h2>
				<div className="flex-1 overflow-y-auto mb-4">
					<ul className="space-y-1">
						{missedCountries.map((country) => (
							<li key={country.alpha2} className="font-montserrat">
								{country.name[0]}
							</li>
						))}
					</ul>
				</div>
				<button
					onClick={onPlayAgain}
					className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full font-montserrat"
				>
					Play Again
				</button>
			</div>
		</div>
	);
};

export default EndGameOverlay;
