const GameTimer = ({ timeLeft }) => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = (timeLeft % 60).toString().padStart(2, "0");

        return (
                <div className="rounded-2xl border border-cyan-400/25 bg-slate-900/80 px-4 py-3 text-right font-montserrat text-cyan-100 shadow-[0_20px_50px_-35px_rgba(56,189,248,0.7)]">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/70">
                                Time Left
                        </p>
                        <p className="text-2xl font-semibold text-white tabular-nums">
                                {minutes}:{seconds}
                        </p>
                </div>
        );
};

export default GameTimer;
