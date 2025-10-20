const GameTimer = ({ timeLeft }) => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = (timeLeft % 60).toString().padStart(2, "0");

        return (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-right font-montserrat text-slate-200">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Time Left</p>
                        <p className="text-2xl font-semibold text-white tabular-nums">
                                {minutes}:{seconds}
                        </p>
                </div>
        );
};

export default GameTimer;
