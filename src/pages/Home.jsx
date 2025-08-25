const Home = ({ onSelect }) => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-200 p-4">
			<h1 className="text-3xl font-bold mb-8 font-montserrat text-center">
				Countries of the World
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl">
				<button
					className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center"
					onClick={() => onSelect("world")}
				>
					<h2 className="text-xl font-semibold mb-2 font-montserrat">
						World Map Game
					</h2>
					<p className="text-gray-600 text-center font-montserrat">
						Guess as many countries as you can on the interactive
						world map within the time limit.
					</p>
				</button>
				<button
					className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center"
					onClick={() => onSelect("outline")}
				>
					<h2 className="text-xl font-semibold mb-2 font-montserrat">
						Outline Quiz
					</h2>
					<p className="text-gray-600 text-center font-montserrat">
						Identify the country based solely on its geographic
						outline.
					</p>
				</button>
				<button
					className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center"
					onClick={() => onSelect("travle")}
				>
					<h2 className="text-xl font-semibold mb-2 font-montserrat">
						Travle Game
					</h2>
					<p className="text-gray-600 text-center font-montserrat">
						Connect the start and end countries by guessing adjacent
						countries.
					</p>
				</button>
			</div>
		</div>
	);
};

export default Home;
