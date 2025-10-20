const StartOverlay = ({
        onStart,
        gameDuration,
        onDurationChange,
        startLabel = "Start Game",
}) => {
        const durations = [5, 10, 15];

        return (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/85">
                        <div className="w-11/12 max-w-sm space-y-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 text-center font-montserrat text-slate-100">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Choose Duration</p>
                                <select
                                        value={gameDuration}
                                        onChange={(e) => onDurationChange(parseInt(e.target.value, 10))}
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/40"
                                >
                                        {durations.map((min) => (
                                                <option key={min} value={min * 60} className="bg-slate-900 text-slate-100">
                                                        {min} minutes
                                                </option>
                                        ))}
                                </select>
                                <button
                                        onClick={onStart}
                                        type="button"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
                                >
                                        {startLabel}
                                </button>
                        </div>
                </div>
        );
};

export default StartOverlay;
