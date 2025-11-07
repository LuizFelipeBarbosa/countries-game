const StartOverlay = ({
	onStart,
	gameDuration,
	onDurationChange,
	startLabel = "Start Game",
}) => {
	const durations = [5, 10, 15];

	return (
		<div className="absolute inset-0 flex items-center justify-center bg-slate-950/90">
			<div className="w-11/12 max-w-xs space-y-3 rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
				<p className="text-sm text-slate-400">Duration</p>
				<select
					value={gameDuration}
					onChange={(e) =>
						onDurationChange(parseInt(e.target.value, 10))
					}
					className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-700"
				>
					{durations.map((min) => (
						<option
							key={min}
							value={min * 60}
							className="bg-slate-900"
						>
							{min} minutes
						</option>
					))}
				</select>
				<button
					onClick={onStart}
					type="button"
					className="w-full rounded border border-slate-700 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
				>
					{startLabel}
				</button>
			</div>
		</div>
	);
};

export default StartOverlay;
