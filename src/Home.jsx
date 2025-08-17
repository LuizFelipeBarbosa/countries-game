const Home = ({ onSelect }) => {
        return (
                <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-200">
                        <button
                                onClick={() => onSelect("world")}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded font-montserrat"
                        >
                                World Map Game
                        </button>
                        <button
                                onClick={() => onSelect("outline")}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded font-montserrat"
                        >
                                Outline Quiz
                        </button>
                </div>
        );
};

export default Home;
