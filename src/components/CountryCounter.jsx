import { ChevronRight } from "lucide-react";
import { CONTINENTS, TOTAL_COUNTRIES } from "../constants/continents";

const CountryCounter = ({ count, isMenuDown, onToggleMenu }) => (
        <div className="rounded-2xl border border-cyan-400/25 bg-white/5 p-4 font-montserrat text-white shadow-[0_20px_50px_-35px_rgba(56,189,248,0.7)]">
                <button
                        type="button"
                        onClick={onToggleMenu}
                        className="flex w-full items-center justify-between gap-4 text-left"
                        aria-expanded={isMenuDown}
                >
                        <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-100/70">
                                        Discovered
                                </p>
                                <p className="text-2xl font-semibold text-white">
                                        {count[0]}/{TOTAL_COUNTRIES}
                                </p>
                                <p className="text-sm text-white/70">Countries found so far</p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-400/10 text-cyan-100 transition-transform duration-200">
                                <ChevronRight
                                        className={`h-5 w-5 transition-transform duration-200 ${
                                                isMenuDown ? "rotate-90" : ""
                                        }`}
                                />
                        </div>
                </button>
                <div
                        className={`grid overflow-hidden transition-[grid-template-rows,_margin-top] duration-300 ease-out ${
                                isMenuDown ? "mt-4 grid-rows-[1fr]" : "mt-0 grid-rows-[0fr]"
                        }`}
                >
                        <div className="min-h-0">
                                <ul className="divide-y divide-white/10 text-sm">
                                        {CONTINENTS.map((continent, index) => (
                                                <li
                                                        key={continent.name}
                                                        className="flex items-center justify-between py-2 text-cyan-100/90"
                                                >
                                                        <span>{continent.name}</span>
                                                        <span className="font-semibold text-white">
                                                                {count[index + 1]}/{continent.total}
                                                        </span>
                                                </li>
                                        ))}
                                </ul>
                        </div>
                </div>
        </div>
);

export default CountryCounter;
