const FeedbackMessage = ({ message, type = "info", className = "" }) => (
	<div
		className={`mt-2 p-2 font-montserrat rounded ${
			type === "success"
				? "bg-green-100 text-green-700"
				: type === "error"
				? "bg-red-100 text-red-700"
				: "bg-blue-100 text-blue-700"
		} ${className}`}
		role="status"
		aria-live={type === "error" ? "assertive" : "polite"}
	>
		{message}
	</div>
);

export default FeedbackMessage;
