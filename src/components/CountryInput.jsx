import { useRef, useState } from "react";

const CountryInput = ({ onSubmit, disabled, suggestions = [] }) => {
        const [inputValue, setInputValue] = useState("");
        const inputRef = useRef(null);

        const handleFocus = () => {
                setTimeout(() => {
                        inputRef.current?.scrollIntoView({
                                block: "center",
                                behavior: "smooth",
                        });
                }, 300);
        };

	const handleSubmit = (e) => {
		e.preventDefault();
		if (inputValue.trim()) {
			onSubmit(inputValue.trim());
			setInputValue("");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-0"
		>
			<input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Enter a country name"
                                className="flex-grow p-2 border border-gray-300 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-montserrat"
                                disabled={disabled}
                                list="country-suggestions"
                                ref={inputRef}
                                onFocus={handleFocus}
                        />
			<datalist id="country-suggestions">
				{suggestions.map((name) => (
					<option value={name} key={name} />
				))}
			</datalist>
			<button
				type="submit"
				className="bg-blue-500 text-white px-4 py-2 rounded-md sm:rounded-l-none sm:rounded-r-md w-full sm:w-auto hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-montserrat"
				disabled={disabled}
			>
				Submit
			</button>
		</form>
	);
};

export default CountryInput;
