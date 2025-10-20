const toneByType = {
        success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
        error: "border-rose-500/40 bg-rose-500/10 text-rose-100",
        info: "border-sky-500/40 bg-sky-500/10 text-sky-100",
        hint: "border-amber-500/40 bg-amber-500/10 text-amber-100",
};

const FeedbackMessage = ({ message, type = "info", className = "" }) => {
        const tone = toneByType[type] ?? toneByType.info;

        return (
                <div
                        className={`rounded-xl border px-4 py-3 font-montserrat text-sm ${tone} ${className}`}
                        role="status"
                        aria-live={type === "error" ? "assertive" : "polite"}
                >
                        {message}
                </div>
        );
};

export default FeedbackMessage;
