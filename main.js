var app;

/** Payouts of the lottery starting at 0. */
var paytable = [0, 0, 0, 50, 100, 200, 500];

/** Numbers the player has chosen or randomly picked. */
var playerNumbers = [];

/** The number of numbers that the player has matched with the lottery. */
var numberOfMatches = 0;

/** Button object to start the game. */
var startGameButton;

/** Button object to select a random set of numbers for the player. */
var luckyDipButton;

/** Button object to reset the game. */
var resetGameButton;

/** The number inputs the player can adjust and view their numbers. */
var playerInput = [];

/** Message at the top of the PIXI screen. */
var statusMessageText;

/** The numbers that have been drawn by the lottery. */
var lotteryDraws;

/** Total number of Lottery Balls that will be drawn. */
var totalNumberOfLotteryBalls = 6;

/** Minimum value a lottery ball can be */
var minimumValue = 1;

/** Maximum value a lottery ball can be. */
var maximumValue = 59;

/** Numbers drawn from the Lottery. */
var lotteryNumbers = [];

/** Array of lottery ball objects. */
var lotteryBalls = [];

/** The hex colours a lottery ball can be. */
var lotteryBallColours = [0x66FF00, 0xFF6600, 0xFF0066, 0x6600FF];

/** Time inbetween drawing each lottery ball in milliseconds */
var lotteryBallDrawTime = 750;

window.onload = function ()
{
    app = new PIXI.Application({ width: 1280, height: 640, backgroundColor: 0xFFFFFF });
    document.body.appendChild(app.view);

    startGameButton = getNewButton("Start Game", startGame, 25, 200);
    luckyDipButton = getNewButton("Lucky Dip", luckyDip, 200, 200);
    resetGameButton = getNewButton("Reset Game", resetGame, 375, 200);

    statusMessageText = new PIXI.Text(
        "Welcome to Lotto Big Bucks! Select your numbers above and press a button below to play!",
        {fontFamily : 'Arial', fontSize: 24, fill : 0x000000, align : 'center'}
    );

    app.stage.addChild(statusMessageText);

    for(let i = 1; i <= totalNumberOfLotteryBalls; i++)
        playerInput.push(document.getElementById("selection" + String(i)));
}

/** 
 * Start the lottery game.
 */
function startGame()
{   
    if(!validatePlayerNumbers())
    {
        statusMessageText.text = "One or more numbers are the same, or are not in range. Please ensure all numbers are a different number from 1-59!";

        return;
    }
    disableUI();
    statusMessageText.text = "Numbers picked! Awaiting draw...";
    drawLotteryNumbers();
    displayRewards();
}

/** 
 * Draw the lottery numbers
 */
function drawLotteryNumbers()
{
    for(let i = 0; i < totalNumberOfLotteryBalls; i++)
        setTimeout(() => { drawLotteryBall(i) }, i * lotteryBallDrawTime)
}

/**
 * Display the rewards after showing the lottery balls
 */
function displayRewards()
{
    setTimeout(() => {
        validatePrize();
        resetGameButton.interactive = true;
    }, lotteryBallDrawTime * totalNumberOfLotteryBalls)
}

/** 
 * Draw an indivudual lottery ball 
 * @param ballIndex: Index of the ball to help calculate where it needs to be positioned
 */
function drawLotteryBall(ballIndex)
{
    var numberDrawn = getRandomUniqueNumber(lotteryNumbers);
    var lotteryBall = getNewLotteryBall(numberDrawn, (125 * ballIndex) + 100, 100);
    lotteryBalls.push(lotteryBall);
    lotteryNumbers.push(numberDrawn);
    app.stage.addChild(lotteryBall);
    
    var playerIndex = playerNumbers.indexOf(numberDrawn);
    if(playerIndex !== -1)
    {
        numberOfMatches++;
        statusMessageText.text = "You have matched "+ numberOfMatches + " balls so far!";

        var matchSprite = PIXI.Sprite.from("https://cdn-icons-png.flaticon.com/512/5582/5582937.png");
        matchSprite.width = 50;
        matchSprite.height = 50;
        matchSprite.x = -25;
        matchSprite.y = -60;
        lotteryBall.addChild(matchSprite);

        playerInput[playerIndex].style.fontWeight = "bold";
    }
}

/** 
 * Get the prize the player has won after the draw 
 */
function validatePrize()
{
    var prize = paytable[numberOfMatches];
    switch(numberOfMatches)
    {
        case 6:
            statusMessageText.text = "Congratulations! You have won the Jackpot! The Jackpot is worth: "+ prize + "! Press Reset Game to play again!";
            break;
        case 5:
            statusMessageText.text = "Big Win! This prize is worth: "+ prize + "! Press Reset Game to play again!";
            break;
        case 4:
            statusMessageText.text = "Good Win! This prize is worth: "+ prize + "! Press Reset Game to play again!";
            break;
        case 3:
            statusMessageText.text = "Win! This prize is worth: "+ prize + "! Press Reset Game to play again!";
            break;
        default: 
            statusMessageText.text = "You did not win a prize. Press Reset Game to play again!";
            break;
    }
}

/** 
 * Disables all the UI elements while the lottery is being drawn.
 */
function disableUI()
{
    startGameButton.interactive = false;
    luckyDipButton.interactive = false;
    resetGameButton.interactive = false;

    for(const input of playerInput)
        input.disabled = true;
}

/**
 * Enable all the UI elements
 */
function enableUI()
{
    startGameButton.interactive = true;
    luckyDipButton.interactive = true;
    resetGameButton.interactive = true;

    for(const input of playerInput)
        input.disabled = false;
}

/**
 * Validate the numbers that have been inputted
 * @returns false if one of the numbers is not unique
 * */
function validatePlayerNumbers()
{
    playerNumbers = [];
    for(const input of playerInput)
    {
        if(input.value === "")
            input.value = getRandomUniqueNumber(playerNumbers);
        else
        {
            if(!isInRange(input.valueAsNumber))
                return false;

            if(numberExistsInArray(input.valueAsNumber, playerNumbers))
                return false;
        }

        playerNumbers.push(input.valueAsNumber);
    }

    return true;
}

/**
 * @returns a random unique number from the lottery
 * @param numbersToCheckAgainst: Array of numbers to check the random number against
 */
function getRandomUniqueNumber(numbersToCheckAgainst)
{
    let number = 1;
    let isUnique = false;
    while(!isUnique)
    {
        number = Math.floor(Math.random() * maximumValue - minimumValue) + minimumValue;
        isUnique = !numberExistsInArray(number, numbersToCheckAgainst);
    }

    return number;
}

/**
 * @returns True if the givin number is in range of the lottery ball numbers we want to show
 * @param number: Number to check in range of
 */
function isInRange(number)
{
    if (number < minimumValue)
        return false;

    return number < maximumValue;
}

/**
 * @returns True if the number is not inside the array of numbers
 * @param number: Number to check if it is unique
 * @param numbersToCheckAgainst: Array of numbers to check if the number is in
 */
function numberExistsInArray(number, numbersToCheckAgainst)
{
    return numbersToCheckAgainst.indexOf(number) !== -1;
}

/**
 * Select a random set of numbers for the player.
 */
function luckyDip()
{
    const luckyNumbers = [];
    for(const input of playerInput)
    {
        input.value = getRandomUniqueNumber(luckyNumbers);
        luckyNumbers.push(input.value);
    }
}

/**
 * Reset the game to play again.
 */
function resetGame()
{
    playerNumbers = [];
    numberOfMatches = 0;

    for(const input of playerInput)
    {
        input.style.fontWeight = "normal";
        input.value = "";
    }

    for(const lotteryBall of lotteryBalls)
        lotteryBall.destroy();

    lotteryBalls = [];

    enableUI();

    statusMessageText.text = "Welcome to Lotto Big Bucks! Select your numbers above and press a button below to play!";
}

/**
 * @returns a new button element for the in game buttons.
 * @param buttonText: Text to display on the button
 * @param onUpFunction: Function to call when the button has been pressed
 * @param x: X position of the button
 * @param y: Y position of the button
 */
function getNewButton(buttonText, onUpFunction, x, y)
{
    var button = new PIXI.Graphics()
        .beginFill(0xFFFFFF)
        .drawRoundedRect(0, 0, 150, 50, 15);
    button.tint = 0x999999;

    button.x = x;
    button.y = y;
    button.interactive = true;
    button.buttonMode = true;
    button.on(
        'pointerdown',
        () => { button.tint = 0x696969; }
    );
    button.on(
        'pointerup',
        () => { 
            button.tint = 0x999999;
            onUpFunction();
        }
    );
    
    var buttonLabel = new PIXI.Text(
        buttonText,
        {fontFamily : 'Arial', fontSize: 24, fill : 0x000000, align : 'center'}
    );
    buttonLabel.anchor.x = 0.5;
    buttonLabel.anchor.y = 0.5;
    buttonLabel.x = button.width/2;
    buttonLabel.y = button.height/2;

    button.addChild(buttonLabel);
    app.stage.addChild(button);

    return button;
}

/**
 * @returns a new Lottery Ball element
 * @param value: Value displayed on the Lottery Ball
 * @param x: X position of the Lottery Ball
 * @param y: Y position of the Lottery Ball
 */
function getNewLotteryBall(value, x, y)
{
    var randomColourIndex = Math.floor(Math.random() * lotteryBallColours.length);
    var lotteryBall = new PIXI.Graphics()
        .beginFill(lotteryBallColours[randomColourIndex])
        .drawCircle(0, 0, 50);
    
    lotteryBall.x = x;
    lotteryBall.y = y;

    var innerLotteryBall = new PIXI.Graphics()
        .beginFill(0xFFFFFF)
        .drawCircle(0, 0, 25);

    lotteryBall.addChild(innerLotteryBall);

    var lotteryBallLabel = new PIXI.Text(
        value,
        {fontFamily : 'Arial', fontSize: 24, fill : 0x00000, align : 'center'}
    );
    lotteryBallLabel.anchor.x = 0.5;
    lotteryBallLabel.anchor.y = 0.5;
    lotteryBall.addChild(lotteryBallLabel);

    return lotteryBall;
}
