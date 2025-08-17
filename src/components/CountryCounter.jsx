import React from "react";
import { ChevronRight } from "lucide-react";
import { CONTINENTS, TOTAL_COUNTRIES } from "../constants/continents";

const CountryCounter = ({ count, isMenuDown, onToggleMenu }) => (
        <div className="absolute top-4 left-4 bg-white p-1 sm:p-2 rounded shadow">
                <div className="flex gap-2">
                        <p className="pl-1 font-bold tracking-wide text-center text-gray-700 font-montserrat text-sm sm:text-base">
                                {count[0]}/{TOTAL_COUNTRIES}
			</p>
                        <p className="pr-1 tracking-wide text-center text-gray-700 font-montserrat text-sm sm:text-base">
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
                                        {CONTINENTS.map((continent, index) => (
                                                <li key={continent.name} className="flex justify-between">
                                                        <span className="font-light tracking-tight text-gray-900 font-montserrat">
                                                                {continent.name}
                                                        </span>
                                                        <span className="text-gray-600 font-semibold font-montserrat">
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
