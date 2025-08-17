
const StartOverlay = ({ onStart, isGameEnded, count }) => {
	// if (isGameEnded) {
	// 	return (
	// 		<></>
	// 		// <div className="absolute rounded-lg inset-0 flex flex-col gap-4 items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
	// 		// 	<h2 className="text-4xl text-white font-bold text-center">
	// 		// 		End of Game
	// 		// 	</h2>
	// 		// 	<button
	// 		// 		onClick={onStart}
	// 		// 		className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105"
	// 		// 	>
	// 		// 		Start Game
	// 		// 	</button>
	// 		// 	<p className="font-bold text-white">{count}/197 Countries</p>
	// 		// </div>
	// 	);
	// } else
	{
		return (
			<div className="absolute rounded-lg inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
				<button
					onClick={onStart}
					className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 font-montserrat tracking-wide"
				>
					Start Game
				</button>
			</div>
		);
	}
};

export default StartOverlay;
