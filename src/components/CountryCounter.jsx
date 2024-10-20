import React from "react";
import { ChevronRight } from "lucide-react";

const CountryCounter = ({ count, isMenuDown, onToggleMenu }) => (
	<div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
		<div className="flex gap-2">
			<p className="pl-1 font-bold tracking-wide text-center text-gray-700 font-montserrat">
				{count[0]}/197
			</p>
			<p className="pr-1 tracking-wide text-center text-gray-700 font-montserrat">
				Countries
			</p>
			<button onClick={onToggleMenu}>
				<ChevronRight
					className={`hover:stroke-gray-500 transition-transform duration-150 ${
						isMenuDown ? "rotate-90" : ""
					}`}
				/>
			</button>
		</div>
		<div
			className={`bg-slate-200 rounded transition-all duration-300 overflow-hidden ${
				isMenuDown ? "max-h-40 mt-1 " : "max-h-0"
			}`}
		>
			<div className="p-1">
				<ul className="divide-y divide-gray-200">
					{[
						"North America",
						"South America",
						"Europe",
						"Asia",
						"Africa",
						"Oceania",
					].map((continent, index) => (
						<li key={index} className="flex justify-between">
							<span className="font-light tracking-tight text-gray-900 font-montserrat">
								{continent}
							</span>
							<span className="text-gray-600 font-semibold font-montserrat">
								{count[index + 1]}/
								{[23, 12, 47, 47, 54, 14][index]}
							</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	</div>
);

export default CountryCounter;
