# Countries of the World Game

This is a web-based geography game designed to test and improve your knowledge of world countries. The application features multiple game modes to challenge you in different ways. Built with modern web technologies like React, Vite, and Tailwind CSS, it offers a fast and responsive user experience.

## Features

-   **Two Challenging Game Modes:**
    -   **World Map Game:** Guess the countries by name and see them highlighted on an interactive world map.
    -   **Outline Quiz:** Test your recognition skills by identifying countries from their geographical outlines.
-   **Timed Challenges:** Race against the clock to guess as many countries as you can within the time limit.
-   **Scoring System:** Keep track of your progress with a real-time counter for guessed countries.
-   **Best Score Tracking:** The game saves your best score and fastest time to your browser's local storage, so you can compete against yourself.
-   **Instant Feedback:** Receive immediate feedback on your guesses, letting you know if you're correct or if you've already guessed a country.
-   **Responsive Design:** Enjoy a seamless experience on both desktop and mobile devices.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine. You can download them from [https://nodejs.org/](https://nodejs.org/).

### Installation

1.  Clone the repo:
    ```sh
    git clone https://github.com/username/repo-name.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd your_repository
    ```
3.  Install NPM packages:
    ```sh
    npm install
    ```

### Running the Application

To start the development server, run the following command:

```sh
npm run dev
```

This will start the application in development mode. Open [http://localhost:5173](http://localhost:5173) (or the address shown in your terminal) to view it in the browser. The page will reload if you make edits.

## Available Scripts

In the project directory, you can run the following commands:

-   `npm run dev`: Runs the app in the development mode.
-   `npm run build`: Builds the app for production to the `dist` folder.
-   `npm run preview`: Serves the production build locally for previewing.
-   `npm test`: Runs the test suite using Vitest.
-   `npm run lint`: Lints the code using ESLint to find and fix problems.
-   `npm run generate:outlines`: A custom script to extract country SVG outlines from a larger map file.

## Project Structure

```
/
├── public/              # Static assets, including country outlines
├── src/                 # Source code
│   ├── assets/          # JSON data and images
│   ├── components/      # React components
│   ├── constants/       # Constant values
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Entry point of the application
├── scripts/             # Node.js scripts for asset generation
├── .gitignore           # Git ignore file
├── index.html           # Main HTML file
├── package.json         # Project metadata and dependencies
├── README.md            # You are here!
└── vite.config.js       # Vite configuration
```
