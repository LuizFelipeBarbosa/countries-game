import { Globe2, Map, Route } from "lucide-react";
import ModeCard from "../components/ModeCard";

const modes = [
        {
                key: "world",
                title: "World Map Game",
                description:
                        "Drop pins across the globe and see how many countries you can name before the clock winds down.",
                badge: "Fan Favorite",
                icon: Globe2,
        },
        {
                key: "outline",
                title: "Outline Quiz",
                description:
                        "Study each silhouette and match it to its country faster than your geography rivals.",
                badge: "Sharpen Skills",
                icon: Map,
        },
        {
                key: "travle",
                title: "Travle Game",
                description:
                        "Plot the perfect path by chaining neighboring nations from a surprise start to a hidden destination.",
                badge: "New Journey",
                icon: Route,
        },
];

const Home = ({ onSelect }) => {
        return (
                <div className="flex w-full flex-1 flex-col gap-16 py-12">
                        <header className="max-w-3xl space-y-6">
                                <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                                        Geography Arcade
                                </span>
                                <h1 className="font-montserrat text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                                        Explore the world through playful learning
                                </h1>
                                <p className="text-lg text-slate-300 font-montserrat sm:text-xl">
                                        Choose a challenge to test your country knowledge, memorize outlines, and connect destinations in a race against time.
                                </p>
                        </header>

                        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {modes.map(({ key, title, description, badge, icon }) => (
                                        <ModeCard
                                                key={key}
                                                icon={icon}
                                                badge={badge}
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
