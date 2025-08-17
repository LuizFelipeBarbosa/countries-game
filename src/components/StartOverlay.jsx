const StartOverlay = ({ onStart, gameDuration, onDurationChange }) => {
        const durations = [5, 10, 15];

        return (
                <div className="absolute rounded-lg inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
                        <div className="flex flex-col items-center gap-4">
                                <label className="text-white font-montserrat">Select Duration:</label>
                                <select
                                        value={gameDuration}
                                        onChange={(e) => onDurationChange(parseInt(e.target.value))}
                                        className="p-2 rounded"
                                >
                                        {durations.map((min) => (
                                                <option key={min} value={min * 60}>
                                                        {min} minutes
                                                </option>
                                        ))}
                                </select>
                                <button
                                        onClick={onStart}
                                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 font-montserrat tracking-wide"
                                >
                                        Start Game
                                </button>
                        </div>
                </div>
        );
};

export default StartOverlay;

