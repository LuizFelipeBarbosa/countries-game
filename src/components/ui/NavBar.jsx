import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";

const NavBar = ({ onSelect }) => {
        const [isMobileOpen, setIsMobileOpen] = useState(false);

        const navLinks = useMemo(
                () => [
                        { id: null, label: "Overview", description: "Start from the world map" },
                        { id: "world", label: "World Map", description: "Pinpoint every nation" },
                        { id: "outline", label: "Outline Quiz", description: "Match borders to countries" },
                        { id: "travle", label: "Travle", description: "Daily geography puzzle" },
                ],
                []
        );

        const handleSelect = (id) => {
                onSelect(id);
                setIsMobileOpen(false);
        };

        return (
                <nav className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
                        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-slate-100 sm:px-6">
                                <button
                                        onClick={() => handleSelect(null)}
                                        type="button"
                                        className="group flex items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
                                >
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-lg">
                                                🌍
                                        </span>
                                        <span className="leading-tight">
                                                <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                                                        GeoPlay
                                                </span>
                                                <span className="block font-montserrat text-lg font-semibold text-white">
                                                        Countries of the World
                                                </span>
                                        </span>
                                </button>
                                <div className="hidden items-center gap-6 md:flex">
                                        {navLinks.map((link) => (
                                                <button
                                                        key={link.id ?? "overview"}
                                                        onClick={() => handleSelect(link.id)}
                                                        type="button"
                                                        className="flex flex-col items-start text-sm font-semibold text-slate-300 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
                                                        aria-label={
                                                                link.id
                                                                        ? `Navigate to ${link.label.replace("Quiz", "").trim()} mode`
                                                                        : "Go to overview"
                                                        }
                                                >
                                                        <span aria-hidden="true">{link.label}</span>
                                                        <span className="text-[11px] font-normal uppercase tracking-[0.2em] text-slate-500">
                                                                {link.description}
                                                        </span>
                                                </button>
                                        ))}
                                        <button
                                                onClick={() => handleSelect("travle")}
                                                type="button"
                                                className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
                                        >
                                                Daily Challenge
                                        </button>
                                </div>
                                <button
                                        onClick={() => setIsMobileOpen(true)}
                                        type="button"
                                        className="inline-flex items-center justify-center rounded-md border border-slate-800 bg-slate-900 p-2 text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100 md:hidden"
                                        aria-label="Open navigation menu"
                                >
                                        <Menu className="h-5 w-5" aria-hidden="true" />
                                </button>
                        </div>
                        {isMobileOpen ? (
                                <div className="md:hidden">
                                        <div
                                                className="fixed inset-0 z-40 bg-slate-950/80"
                                                onClick={() => setIsMobileOpen(false)}
                                                aria-hidden="true"
                                        />
                                        <div className="fixed inset-y-0 right-0 z-50 flex w-72 max-w-full flex-col gap-6 border-l border-slate-800 bg-slate-950/95 p-6 text-slate-100">
                                                <div className="flex items-center justify-between">
                                                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                                                                Menu
                                                        </span>
                                                        <button
                                                                onClick={() => setIsMobileOpen(false)}
                                                                type="button"
                                                                className="rounded-md border border-slate-800 bg-slate-900 p-2 text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
                                                                aria-label="Close navigation menu"
                                                        >
                                                                <X className="h-5 w-5" aria-hidden="true" />
                                                        </button>
                                                </div>
                                                <nav className="flex flex-col gap-3">
                                                        {navLinks.map((link) => (
                                                                <button
                                                                        key={link.id ?? "overview"}
                                                                        onClick={() => handleSelect(link.id)}
                                                                        type="button"
                                                                        className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-left text-sm font-semibold text-slate-100 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
                                                                        aria-label={
                                                                                link.id
                                                                                        ? `Navigate to ${link.label.replace("Quiz", "").trim()} mode`
                                                                                        : "Go to overview"
                                                                        }
                                                                >
                                                                        <span aria-hidden="true" className="block text-base">
                                                                                {link.label}
                                                                        </span>
                                                                        <span className="block text-[11px] uppercase tracking-[0.2em] text-slate-500">
                                                                                {link.description}
                                                                        </span>
                                                                </button>
                                                        ))}
                                                </nav>
                                                <div className="mt-auto space-y-3">
                                                        <button
                                                                onClick={() => handleSelect("travle")}
                                                                type="button"
                                                                className="w-full rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
                                                        >
                                                                Daily Challenge
                                                        </button>
                                                        <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                                                                <span className="flex h-2.5 w-2.5 items-center justify-center">
                                                                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                                                                </span>
                                                                Keep exploring
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        ) : null}
                </nav>
        );
};

export default NavBar;
