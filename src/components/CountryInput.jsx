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
                                className="w-full flex-grow rounded-xl border border-cyan-400/25 bg-slate-950/80 px-4 py-3 font-montserrat text-sm text-white placeholder:text-white/40 shadow-[0_18px_40px_-30px_rgba(56,189,248,0.7)] focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
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
                                className="w-full rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500 px-5 py-3 font-montserrat text-sm font-semibold text-slate-900 shadow-[0_20px_50px_-25px_rgba(56,189,248,0.7)] transition hover:from-cyan-300 hover:via-sky-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                disabled={disabled}
                        >
                                Submit
                        </button>
                </form>
        );
};

export default CountryInput;
