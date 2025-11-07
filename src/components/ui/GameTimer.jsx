const GameTimer = ({ timeLeft }) => {
	const minutes = Math.floor(timeLeft / 60);
	const seconds = (timeLeft % 60).toString().padStart(2, "0");

	return (
		<div className="text-right">
			<p className="text-xs text-slate-400">Time</p>
			<p className="text-lg font-semibold text-white tabular-nums">
				{minutes}:{seconds}
			</p>
		</div>
	);
};

export default GameTimer;
