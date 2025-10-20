const toneByType = {
        success: "border-emerald-400/40 bg-emerald-500/15 text-emerald-100",
        error: "border-rose-400/40 bg-rose-500/15 text-rose-100",
        info: "border-cyan-300/40 bg-cyan-400/15 text-cyan-100",
};

const FeedbackMessage = ({ message, type = "info", className = "" }) => {
        const tone = toneByType[type] ?? toneByType.info;

        return (
                <div
                        className={`rounded-xl border px-4 py-3 font-montserrat text-sm shadow-[0_12px_30px_-18px_rgba(56,189,248,0.6)] backdrop-blur ${
                                tone
                        } ${className}`}
                        role="status"
                        aria-live={type === "error" ? "assertive" : "polite"}
                >
                        {message}
                </div>
        );
};

export default FeedbackMessage;
