const Home = ({ onSelect }) => {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center bg-neutral-100 p-4 font-montserrat">
			<div className="text-center mb-12">
				<h1 className="text-5xl font-bold text-neutral-800">
					Countries of the World
				</h1>
				<p className="text-neutral-600 mt-2">
					Choose a game mode to test your geography knowledge!
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
				<GameModeButton
					title="World Map Game"
					description="Guess as many countries as you can on the interactive world map within the time limit."
					onClick={() => onSelect("world")}
				/>
				<GameModeButton
					title="Outline Quiz"
					description="Identify the country based solely on its geographic outline."
					onClick={() => onSelect("outline")}
				/>
				<GameModeButton
					title="Travle Game"
					description="Connect the start and end countries by guessing adjacent countries."
					onClick={() => onSelect("travle")}
				/>
			</div>
		</main>
	);
};

const GameModeButton = ({ title, description, onClick }) => (
	<button
		className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl hover:border-primary-light transition-all duration-300 border-2 border-transparent flex flex-col items-center text-center"
		onClick={onClick}
	>
		<h2 className="text-2xl font-bold mb-4 text-primary-dark">{title}</h2>
		<p className="text-neutral-600">{description}</p>
	</button>
);

export default Home;
