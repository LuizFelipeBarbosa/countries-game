import { Globe2, Map, Route } from "lucide-react";
import ModeCard from "../components/ModeCard";

const modes = [
	{
		key: "world",
		title: "World Map",
		description: "Name as many countries as you can before time runs out.",
		icon: Globe2,
	},
	{
		key: "outline",
		title: "Outline Quiz",
		description: "Match country silhouettes to their names.",
		icon: Map,
	},
	{
		key: "travle",
		title: "Travle",
		description: "Connect neighboring countries from start to destination.",
		icon: Route,
	},
];

const Home = ({ onSelect }) => {
	return (
		<div className="flex w-full flex-1 flex-col gap-12 py-8">
			<header className="max-w-2xl space-y-4">
				<h1 className="text-4xl font-bold text-white sm:text-5xl">
					Countries of the World
				</h1>
				<p className="text-lg text-slate-400">
					Test your geography knowledge with interactive challenges.
				</p>
			</header>

			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{modes.map(({ key, title, description, icon }) => (
					<ModeCard
						key={key}
						icon={icon}
						title={title}
						description={description}
						onClick={() => onSelect(key)}
					/>
				))}
			</section>
		</div>
	);
};

export default Home;
