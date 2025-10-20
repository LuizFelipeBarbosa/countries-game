import { Pause, Play, Flag } from "lucide-react";

const baseButtonClasses =
        "flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-montserrat font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100 disabled:cursor-not-allowed disabled:opacity-60";

export const GiveUpButton = ({ onGiveUp, disabled = false }) => (
        <button
                onClick={onGiveUp}
                type="button"
                disabled={disabled}
                className={`${baseButtonClasses} border-rose-500/40 bg-rose-500/10 text-rose-100 hover:bg-rose-500/15`}
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
                className={`${baseButtonClasses} border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800`}
                aria-pressed={isPaused}
                aria-label={isPaused ? "Resume" : "Pause"}
        >
                {isPaused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
                {isPaused ? "Resume" : "Pause"}
        </button>
);
