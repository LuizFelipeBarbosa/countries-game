import { Globe2, Map, Route } from "lucide-react";
import ModeCard from "../components/ModeCard";

const modes = [
        {
                key: "world",
                title: "World Map Game",
                description: "Drop pins across the globe and see how many countries you can name before the clock winds down.",
                badge: "Fan Favorite",
                icon: Globe2,
        },
        {
                key: "outline",
                title: "Outline Quiz",
                description: "Study each silhouette and match it to its country faster than your geography rivals.",
                badge: "Sharpen Skills",
                icon: Map,
        },
        {
                key: "travle",
                title: "Travle Game",
                description: "Plot the perfect path by chaining neighboring nations from a surprise start to a hidden destination.",
                badge: "New Journey",
                icon: Route,
        },
];

const Home = ({ onSelect }) => {
        return (
                <div className="relative min-h-screen overflow-hidden bg-slate-950">
                        <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-indigo-600 to-rose-500" aria-hidden="true" />
                        <div
                                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_55%)] mix-blend-screen"
                                aria-hidden="true"
                        />

                        <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-6 py-20 text-white sm:px-10">
                                <header className="max-w-3xl space-y-6">
                                        <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
                                                Geography Arcade
                                        </span>
                                        <h1 className="text-4xl font-bold leading-tight font-montserrat sm:text-5xl lg:text-6xl">
                                                Explore the world through playful learning
                                        </h1>
                                        <p className="text-lg text-white/80 font-montserrat sm:text-xl">
                                                Choose a challenge to test your country knowledge, memorize outlines, and connect destinations in a race against time.
                                        </p>
                                </header>

                                <section className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
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
                        </main>
                </div>
        );
};

export default Home;
