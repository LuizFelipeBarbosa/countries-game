import PropTypes from "prop-types";

const Home = ({ onSelect }) => {
        return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200 p-4">
                        <h2 className="text-2xl md:text-3xl font-bold font-montserrat mb-8 text-center">
                                Choose a Game Mode
                        </h2>
                        <div className="grid gap-6 w-full max-w-3xl md:grid-cols-2">
                                <button
                                        className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
                                        onClick={() => onSelect("world")}
                                >
                                        <h3 className="text-xl font-semibold font-montserrat mb-2">
                                                World Map Game
                                        </h3>
                                        <p className="text-gray-700 font-montserrat">
                                                Guess all the countries on an interactive world map before time runs
                                                out.
                                        </p>
                                </button>
                                <button
                                        className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
                                        onClick={() => onSelect("outline")}
                                >
                                        <h3 className="text-xl font-semibold font-montserrat mb-2">
                                                Outline Quiz
                                        </h3>
                                        <p className="text-gray-700 font-montserrat">
                                                Identify the country from its geographic outline as quickly as
                                                possible.
                                        </p>
                                </button>
                        </div>
                </div>
        );
};

Home.propTypes = {
        onSelect: PropTypes.func.isRequired,
};

export default Home;
