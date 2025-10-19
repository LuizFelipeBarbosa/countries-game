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
[],
);

const handleSelect = (id) => {
onSelect(id);
setIsMobileOpen(false);
};

return (
<nav className="sticky top-0 z-40 bg-slate-900/70 backdrop-blur-xl shadow-[0_12px_40px_-20px_rgba(14,116,144,0.9)] transition-colors duration-300">
<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-slate-50 sm:px-6">
<button
onClick={() => handleSelect(null)}
type="button"
className="group flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-3 py-2 font-montserrat text-left text-base font-semibold tracking-wide text-white transition hover:border-white/20 hover:bg-white/10"
>
<span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-cyan-400 to-teal-500 text-xl shadow-inner shadow-cyan-500/40 transition group-hover:scale-105">
🌍
</span>
<span className="leading-tight">
<span className="block text-sm font-medium uppercase tracking-[0.2em] text-cyan-100/80">GeoPlay</span>
<span className="block text-lg font-bold">Countries of the World</span>
</span>
</button>
<div className="hidden items-center gap-8 md:flex">
{navLinks.map((link) => (
<button
key={link.id ?? "overview"}
onClick={() => handleSelect(link.id)}
type="button"
className="group relative font-montserrat text-sm font-semibold tracking-wide text-slate-100 transition"
>
<span className="inline-flex flex-col items-start gap-0.5">
<span>{link.label}</span>
<span className="text-[11px] font-normal uppercase tracking-[0.18em] text-cyan-100/70">
{link.description}
</span>
</span>
<span className="absolute -bottom-1 left-0 h-0.5 w-full scale-x-0 transform bg-cyan-300 transition-transform duration-200 ease-out group-hover:scale-x-100" />
</button>
))}
<button
onClick={() => handleSelect("travle")}
type="button"
className="rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500 px-4 py-2 font-montserrat text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/30 transition hover:shadow-cyan-400/40"
>
Play Daily Challenge
</button>
</div>
<button
onClick={() => setIsMobileOpen(true)}
type="button"
className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/10 p-2 text-white transition hover:border-white/30 hover:bg-white/20 md:hidden"
aria-label="Open navigation menu"
>
<Menu className="h-5 w-5" aria-hidden="true" />
</button>
</div>
{isMobileOpen ? (
<div className="md:hidden">
<div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileOpen(false)} />
<div className="fixed inset-y-0 right-0 z-50 flex w-72 max-w-full flex-col bg-slate-900/95 px-6 pb-8 pt-6 shadow-[0_24px_60px_-25px_rgba(56,189,248,0.5)] transition-transform duration-300">
<div className="flex items-center justify-between">
<span className="font-montserrat text-sm font-semibold uppercase tracking-[0.3em] text-cyan-100/80">
Menu
</span>
<button
onClick={() => setIsMobileOpen(false)}
type="button"
className="rounded-md border border-white/10 bg-white/5 p-2 text-white transition hover:border-white/30 hover:bg-white/10"
aria-label="Close navigation menu"
>
<X className="h-5 w-5" aria-hidden="true" />
</button>
</div>
<nav className="mt-8 flex flex-col gap-5">
{navLinks.map((link) => (
<button
key={link.id ?? "overview"}
onClick={() => handleSelect(link.id)}
type="button"
className="rounded-lg border border-white/5 bg-white/5 px-4 py-3 text-left font-montserrat text-base font-semibold text-slate-100 shadow-sm shadow-slate-900/50 transition hover:border-cyan-300/50 hover:bg-cyan-400/10"
>
<span className="block text-lg">{link.label}</span>
<span className="block text-xs uppercase tracking-[0.2em] text-cyan-100/70">
{link.description}
</span>
</button>
))}
</nav>
<div className="mt-auto">
<button
onClick={() => handleSelect("travle")}
type="button"
className="mt-6 w-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500 px-5 py-3 font-montserrat text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/40 transition hover:shadow-cyan-400/40"
>
Play Daily Challenge
</button>
<div className="mt-4 flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-4 py-3 text-cyan-100/70">
<span className="flex h-2.5 w-2.5 items-center justify-center">
<span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
</span>
<span className="text-xs font-medium uppercase tracking-[0.3em]">
Live Streak: Keep exploring!
</span>
</div>
</div>
</div>
</div>
) : null}
</nav>
);
};

export default NavBar;
