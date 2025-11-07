import { ChevronRight } from "lucide-react";
import { CONTINENTS, TOTAL_COUNTRIES } from "../constants/continents";

const CountryCounter = ({ count, isMenuDown, onToggleMenu }) => (
	<div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
		<button
			type="button"
			onClick={onToggleMenu}
			className="flex w-full items-center justify-between text-left"
			aria-expanded={isMenuDown}
		>
			<div className="space-y-0.5">
				<p className="text-2xl font-semibold text-white">
					{count[0]}/{TOTAL_COUNTRIES}
				</p>
				<p className="text-xs text-slate-400">Countries</p>
			</div>
			<ChevronRight
				className={`h-4 w-4 text-slate-400 transition-transform ${
					isMenuDown ? "rotate-90" : ""
				}`}
			/>
		</button>
		<div
			className={`grid overflow-hidden transition-[grid-template-rows,_margin-top] duration-200 ${
				isMenuDown ? "mt-3 grid-rows-[1fr]" : "mt-0 grid-rows-[0fr]"
			}`}
		>
			<div className="min-h-0">
				<ul className="divide-y divide-slate-800 text-sm">
					{CONTINENTS.map((continent, index) => (
						<li
							key={continent.name}
							className="flex items-center justify-between py-2 text-slate-400"
						>
							<span>{continent.name}</span>
							<span className="text-slate-300">
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
