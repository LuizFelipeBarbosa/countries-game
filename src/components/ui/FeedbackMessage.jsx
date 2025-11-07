const toneByType = {
	success: "border-emerald-500/30 bg-emerald-500/5 text-emerald-200",
	error: "border-rose-500/30 bg-rose-500/5 text-rose-200",
	info: "border-sky-500/30 bg-sky-500/5 text-sky-200",
	hint: "border-amber-500/30 bg-amber-500/5 text-amber-200",
};

const FeedbackMessage = ({ message, type = "info", className = "" }) => {
	const tone = toneByType[type] ?? toneByType.info;

	return (
		<div
			className={`rounded border px-3 py-2 text-sm ${tone} ${className}`}
			role="status"
			aria-live={type === "error" ? "assertive" : "polite"}
		>
			{message}
		</div>
	);
};

export default FeedbackMessage;
