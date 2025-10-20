const StartOverlay = ({
        onStart,
        gameDuration,
        onDurationChange,
        startLabel = "Start Game",
}) => {
        const durations = [5, 10, 15];

        return (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl">
                        <div className="w-11/12 max-w-sm space-y-4 rounded-3xl border border-cyan-400/30 bg-slate-900/80 p-6 text-center font-montserrat text-white shadow-[0_35px_80px_-45px_rgba(56,189,248,0.75)]">
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/70">
                                        Choose Duration
                                </p>
                                <select
                                        value={gameDuration}
                                        onChange={(e) => onDurationChange(parseInt(e.target.value, 10))}
                                        className="w-full rounded-xl border border-cyan-400/30 bg-slate-950/70 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                                >
                                        {durations.map((min) => (
                                                <option key={min} value={min * 60} className="bg-slate-900 text-white">
                                                        {min} minutes
                                                </option>
                                        ))}
                                </select>
                                <button
                                        onClick={onStart}
                                        type="button"
                                        className="w-full rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:from-cyan-300 hover:via-sky-400 hover:to-blue-500"
                                >
                                        {startLabel}
                                </button>
                        </div>
                </div>
        );
};

export default StartOverlay;
