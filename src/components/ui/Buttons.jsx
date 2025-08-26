import { Pause, Play } from "lucide-react";

export const GiveUpButton = ({ onGiveUp }) => (
	<button
		onClick={onGiveUp}
		className="bg-accent-dark hover:bg-accent-darker text-white p-1 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 mt-2 w-full font-medium font-montserrat"
	>
		Give Up
	</button>
);

export const PauseButton = ({ isPaused, onTogglePause }) => (
	<button
		onClick={onTogglePause}
		className="bg-primary hover:bg-primary-dark text-white p-2 rounded-full shadow-lg ml-2 transition-transform transform hover:scale-110"
		aria-pressed={isPaused}
		aria-label={isPaused ? "Resume" : "Pause"}
	>
		{isPaused ? <Play size={24} /> : <Pause size={24} />}
	</button>
);
