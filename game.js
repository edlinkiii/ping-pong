var canvas;
var canvasContext;

var ballX = 50;
var ballSpeedX = 10;
var ballY = 50;
var ballSpeedY = 4;
var paddle1Y = 250;
var paddle2Y = 250;
var player1Score = 0;
var player2Score = 0;

var arrowUPress = false;
var arrowDPress = false;
var showingWinScreen = false;

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const AI_THRESHHOLD = 25;
const WINNING_SCORE = 3;

// game creation after dom is loaded
window.addEventListener('DOMContentLoaded', e => {
    canvas = document.querySelector('#gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30;
    setInterval(function() {
        drawEverything();
        moveEverything();
    }, 1000/framesPerSecond);

    // left paddle follows mouse
    canvas.addEventListener('mousemove', e => {
        var mousePos = calcMousePos(e);
        paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
        // paddle2Y = mousePos.y - (PADDLE_HEIGHT/2);
    });

    // detect up/down key being pressed
    document.addEventListener('keydown', e => {
        if(e.key === 'ArrowUp') {
            arrowUPress = true;
        }
        if(e.key === 'ArrowDown') {
            arrowDPress = true;
        }
    });

    // detect up/down key being released
    document.addEventListener('keyup', e => {
        if(e.key === 'ArrowUp') {
            arrowUPress = false;
        }
        if(e.key === 'ArrowDown') {
            arrowDPress = false;
        }
    });

    // detect mouse click
    canvas.addEventListener('mousedown', handleMouseClick);
});

function handleMouseClick(e) {
    if(showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

function calcMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = e.clientX - rect.left - root.scrollLeft;
    var mouseY = e.clientY - rect.top - root.scrollTop;

    return {
        x: mouseX,
        y: mouseY
    }
}

function ballReset() {
    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        showingWinScreen = true;
    }
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 4;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function arrowMovement() {
    if(arrowUPress) {
        paddle1Y -= 9;
    }
    if(arrowDPress) {
        paddle1Y += 9;
    }
}

function computerMovement() {
    var paddle2YCenter = paddle2Y+(PADDLE_HEIGHT/2);
    if(paddle2YCenter < ballY-AI_THRESHHOLD) {
        paddle2Y += 6;
    } else if(paddle2YCenter > ballY+AI_THRESHHOLD) {
        paddle2Y -= 6;
    }
}

function moveEverything() {
    if(showingWinScreen) {
        return;
    }

    computerMovement();
    arrowMovement();

    // initial ball speed
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // left side
    if(ballX < 20) {
        if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2)
            ballSpeedY = deltaY * .35;
        } else {
            player2Score++;
            ballReset();
        }
    }

    // right side
    if(ballX > canvas.width-20) {
        if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2)
            ballSpeedY = deltaY * .35;
        } else {
            player1Score++;
            ballReset();
        }
    }

    // top boundry
    if(ballY < 10) {
        ballSpeedY = -ballSpeedY;
    }

    // bottom boundry
    if(ballY > canvas.height-10) {
        ballSpeedY = -ballSpeedY;
    }
}

function drawEverything() {
    // backdrop
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    if(showingWinScreen) {
        canvasContext.fillStyle = 'white';

        if(player1Score >= WINNING_SCORE) {
            canvasContext.fillText("Left Player Won!", 350, 200);
        }
        if(player2Score >= WINNING_SCORE) {
            canvasContext.fillText("Right Player Won!", 350, 200);
        }
        canvasContext.fillText("Click to continue...", 350, 300);
        return;
    }

    // net
    drawNet('white');

    // left player paddle
    colorRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

    // right computer paddle
    colorRect(canvas.width-PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

    // ball
    colorCircle(ballX, ballY, 10, 'white');

    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width-100, 100);
}

function drawNet(netColor) {
    for(let i=0; i<canvas.height; i+=40) {
        colorRect(canvas.width/2-1, i, 2, 20, netColor);
    }
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}
