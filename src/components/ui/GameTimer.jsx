const GameTimer = ({ timeLeft }) => (
	<div className="bg-white p-2 rounded shadow" aria-live="polite">
		<p className="font-bold font-montserrat">
			{Math.floor(timeLeft / 60)}:
			{(timeLeft % 60).toString().padStart(2, "0")}
		</p>
	</div>
);

export default GameTimer;
