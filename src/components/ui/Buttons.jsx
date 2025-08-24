import { Pause, Play } from "lucide-react";

export const GiveUpButton = ({ onGiveUp }) => (
	<button
		onClick={onGiveUp}
		className="bg-red-500 hover:bg-red-600 text-white p-1 rounded shadow mt-2 w-full font-medium font-montserrat"
	>
		Give Up
	</button>
);

export const PauseButton = ({ isPaused, onTogglePause }) => (
	<button
		onClick={onTogglePause}
		className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded shadow ml-2"
		aria-pressed={isPaused}
		aria-label={isPaused ? "Resume" : "Pause"}
	>
		{isPaused ? <Play size={24} /> : <Pause size={24} />}
	</button>
);
