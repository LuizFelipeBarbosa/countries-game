const NavBar = ({ onSelect }) => (
	<nav className="bg-blue-600 p-4 text-white">
		<div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
			<h1
				className="text-xl sm:text-2xl font-bold font-montserrat tracking-wide cursor-pointer"
				onClick={() => onSelect(null)}
			>
				Countries of the World
			</h1>
			<div className="flex space-x-4 mt-4 sm:mt-0">
				<button
					className="p-2 hover:bg-blue-700 rounded font-montserrat"
					onClick={() => onSelect("world")}
				>
					World Map Game
				</button>
				<button
					className="p-2 hover:bg-blue-700 rounded font-montserrat"
					onClick={() => onSelect("outline")}
				>
					Outline Quiz
				</button>
				<button
					className="p-2 hover:bg-blue-700 rounded font-montserrat"
					onClick={() => onSelect("travle")}
				>
					Travle Game
				</button>
			</div>
		</div>
	</nav>
);

export default NavBar;
