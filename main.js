var canvas;

/** Payouts of the lottery starting at 0. */
var paytable = [0, 0, 0, 50, 100, 200, 500];

/** Numbers the player has chosen or randomly picked. */
var playerNumbers;

/** Button object to start the game. */
var startGameButton;

/** Button object to select a random set of numbers for the player. */
var luckyDipButton;

/** Button object to reset the game. */
var resetGameButton;

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext("2d");

    startGameButton = document.getElementById('startGameButton');
    startGameButton.addEventListener("click", startGame);

    luckyDipButton = document.getElementById('luckyDipButton');
    luckyDipButton.addEventListener("click", luckyDip);

    resetGameButton = document.getElementById('resetGameButton');
    resetGameButton.addEventListener("click", resetGame);

    this.drawWelcomeText();
}

/** Draw the Welcome Text at the top of the screen. */
function drawWelcomeText() {
    requestAnimationFrame(drawWelcomeText);

    welcomeString = "Welcome to Lotto Big Bucks!";
    ctx.font = "52px Titan One";
    ctx.fillText(welcomeString, 0, 50);
}

/** Start the lottery game */
function startGame() {

}

/** Select a random set of numbers for the player */
function luckyDip() {

}

/** Reset the game to play again */
function resetGame() {

}