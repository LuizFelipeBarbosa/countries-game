const OutlineGame = ({ isBlurred, isGameStarted, isGameEnded }) => {
        return (
                <div
                        className={`w-full h-[500px] flex items-center justify-center bg-gray-300 rounded relative ${
                                isBlurred ? "blur-sm" : ""
                        }`}
                >
                        {isGameStarted && !isGameEnded && (
                                <p className="font-montserrat text-lg">
                                        Outline Quiz in progress...
                                </p>
                        )}
                        {!isGameStarted && !isGameEnded && (
                                <p className="font-montserrat text-lg">Outline Quiz</p>
                        )}
                        {isGameEnded && (
                                <p className="font-montserrat text-lg">
                                        Outline Quiz finished!
                                </p>
                        )}
                </div>
        );
};

export default OutlineGame;
