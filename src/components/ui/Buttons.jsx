import { Pause, Play, Flag } from "lucide-react";

export const GiveUpButton = ({ onGiveUp, disabled = false }) => (
        <button
                onClick={onGiveUp}
                type="button"
                disabled={disabled}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-400/40 bg-rose-500/20 px-4 py-2 font-montserrat text-sm font-semibold text-rose-100 shadow-[0_12px_30px_-18px_rgba(244,114,182,0.6)] transition hover:bg-rose-500/30 ${
                        disabled ? "cursor-not-allowed opacity-50 hover:bg-rose-500/20" : ""
                }`}
        >
                <Flag className="h-4 w-4" aria-hidden="true" />
                Give Up
        </button>
);

export const PauseButton = ({ isPaused, onTogglePause, disabled = false }) => (
        <button
                onClick={onTogglePause}
                type="button"
                disabled={disabled}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-400/20 px-4 py-2 font-montserrat text-sm font-semibold text-cyan-100 shadow-[0_12px_30px_-18px_rgba(56,189,248,0.7)] transition hover:bg-cyan-400/30 ${
                        disabled ? "cursor-not-allowed opacity-50 hover:bg-cyan-400/20" : ""
                }`}
                aria-pressed={isPaused}
                aria-label={isPaused ? "Resume" : "Pause"}
        >
                {isPaused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
                {isPaused ? "Resume" : "Pause"}
        </button>
);
