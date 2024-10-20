import React, { useState, useEffect, useRef } from "react";
import { Map, Clock, Settings, Pause, Play } from "lucide-react";

const CountryInput = ({ onSubmit, disabled }) => {
	const [inputValue, setInputValue] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (inputValue.trim()) {
			onSubmit(inputValue.trim());
			setInputValue("");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="mt-4 flex">
			<input
				type="text"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				placeholder="Enter a country name"
				className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-montserrat"
				disabled={disabled}
			/>
			<button
				type="submit"
				className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-montserrat"
				disabled={disabled}
			>
				Submit
			</button>
		</form>
	);
};

export default CountryInput;
