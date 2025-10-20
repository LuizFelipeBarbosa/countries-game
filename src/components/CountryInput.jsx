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
                        className="flex flex-col gap-3 sm:flex-row sm:items-center"
                        role="search"
                        aria-label="Country guess form"
                >
                        <label htmlFor="country-input" className="sr-only">
                                Country name
                        </label>
                        <input
                                id="country-input"
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Enter a country name"
                                className="w-full flex-grow rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-montserrat text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/40 disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={disabled}
                                list="country-suggestions"
                                ref={inputRef}
                                onFocus={handleFocus}
                                autoComplete="off"
                                aria-autocomplete="list"
                                aria-controls="country-suggestions"
                        />
                        <datalist id="country-suggestions">
                                {suggestions.map((name) => (
                                        <option value={name} key={name} />
                                ))}
                        </datalist>
                        <button
                                type="submit"
                                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-montserrat text-sm font-semibold text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
                                disabled={disabled}
                        >
                                Submit
                        </button>
                </form>
        );
};

export default CountryInput;
