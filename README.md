# Spot The Difference

This is a simple "Spot the Difference" web-based game implemented using HTML5 Canvas and JavaScript. The game loads two similar images and challenges the user to spot and click on the differences within a given time limit.


## How to Run the Game

Clone or Download the Repository

git clone https://github.com/your-username/spot-the-difference.git

Run Locally

To run the game locally and avoid issues with loading JSON files, follow these steps:

Install Live Server

If you don't already have it installed, use the following command to install Live Server globally

npm install -g live-server

Start the Server

Navigate to the project directory and run:

live-server

Deployed Game Link

You can play the game directly here: https://ayushkharegithub.github.io/SpotTheDifference/


Gameplay Instructions

Click the Play button to start.
Find and click on the differences between the two images.
A red box will highlight each found difference.
The game ends when either:
All differences are found (You Win!)
Time runs out (Game Over)
How the Game Uses data.json


The game dynamically loads its configuration from a data.json file. This file includes:

Title of the Game
Paths to the Two Images
List of Differences (coordinates and size)

In the Code:

fetch("data.json"): Loads the JSON configuration.
data.images.image1 & image2: Sets image sources for canvas display.
data.differences[]: Provides coordinates and dimensions of the difference spots to detect clicks.


Features

Dual canvas image display
Real-time click detection with tolerance
Score tracking and timer countdown
Win/Game Over status updates
JSON-driven configuration for easy content changes


Requirements

Modern web browser with JavaScript enabled
Local or web server (for proper JSON loading)


License

This project is open-source and free to use for educational or non-commercial purposes.