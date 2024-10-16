const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const buckets = [
    document.getElementById('bucket1'),
    document.getElementById('bucket2'),
    document.getElementById('bucket3'),
    document.getElementById('bucket4'),
];
const timeBar = document.getElementById('timeBar');
const intro = document.getElementById('intro');
let collected = [0, 0, 0, 0];
let timeLeft = 100;
let gameInterval;
let fallingSquares = []; // Array of falling squares
let isGameActive = true; // Track if the game is active
let squareSpeed = 5; // Speed of falling square

function showIntro() {
    intro.style.display = 'block'; // Show intro
    setTimeout(startGame, 3000); // Start game after 3 seconds
}

function startGame() {
    intro.style.display = 'none'; // Hide intro
    gameInterval = setInterval(updateTime, 1000);
    createSquare();
    requestAnimationFrame(gameLoop);
}

function updateTime() {
    timeLeft--;
    timeBar.style.width = (timeLeft / 100) * 100 + '%';
    if (timeLeft <= 0) {
        endGame();
    }
}

function endGame() {
    clearInterval(gameInterval);
    isGameActive = false;
    showEndMessage('Game Over', 'You did not collect enough squares!');
    resetGame();
}

function resetGame() {
    collected = [0, 0, 0, 0];
    timeLeft = 100;
    document.querySelectorAll('.bucket').forEach(bucket => bucket.innerText = '0');
    fallingSquares = []; // Reset all falling squares
    isGameActive = true; // Reset game state
    timeBar.style.width = '100%'; // Reset time bar
}

function createSquare() {
    if (!isGameActive) return; // Stop creating squares if the game is over
    const colorIndex = Math.floor(Math.random() * 4);
    fallingSquares.push({
        x: Math.random() * (canvas.width - 50),
        y: 0,
        color: colorIndex,
        width: 50,
        height: 50,
    });
}

function drawSquares() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    if (fallingSquares.length === 0) {
        createSquare();
    }
    fallingSquares.forEach((square, index) => {
        draw3DSquare(square); // Draw each falling square
        square.y += squareSpeed; // Move square down
        
        // Stop falling if it reaches the bottom
        if (square.y + square.height >= canvas.height) {
            checkPlacement(square, index); // Check if it can be placed in a bucket
        }
    });
}

function draw3DSquare(square) {
    // Draw a shadow for the 3D effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(square.x + 5, square.y + 5, square.width, square.height);
    
    // Draw the main square
    ctx.fillStyle = ['red', 'blue', 'green', 'yellow'][square.color];
    ctx.fillRect(square.x, square.y, square.width, square.height);
    
    // Add highlights for the 3D effect
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(square.x, square.y, square.width, 5); // Top highlight
    ctx.fillRect(square.x, square.y, 5, square.height); // Left highlight
}

function checkPlacement(square, index) {
    // Calculate bucket positions relative to the canvas
    buckets.forEach((bucket, bucketIndex) => {
        const bucketX = bucketIndex * (canvas.width / 4);
        const bucketY = canvas.height - 100;
        const bucketWidth = canvas.width / 4;
        const bucketHeight = 100;
        
        if (square.x + square.width > bucketX &&
            square.x < bucketX + bucketWidth &&
            square.y + square.height >= bucketY) {
            // If the square is placed in the correct bucket
            if (square.color === bucketIndex) { 
                collected[bucketIndex]++;
                buckets[bucketIndex].innerText = collected[bucketIndex];
                checkWinCondition(); // Check for win condition
            }
            fallingSquares.splice(index, 1); // Remove the square once it reaches the bottom
        }
    });
    // Remove square if it falls out of bounds
    if (square.y + square.height >= canvas.height) {
        fallingSquares.splice(index, 1);
    }
}

function checkWinCondition() {
    if (collected.every(count => count >= 5)) {
        clearInterval(gameInterval);
        isGameActive = false;
        showEndMessage('You Win!', 'Congratulations! You collected enough squares.');
        resetGame();
    }
}

function showEndMessage(title, message) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '48px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 30);

    ctx.font = '24px Arial';
    ctx.fillText(message, canvas.width / 2, canvas.height / 2 + 20);
}

function gameLoop() {
    drawSquares();
    if (isGameActive) {
        requestAnimationFrame(gameLoop);
    }
}

function handleKeyPress(event) {
    if (fallingSquares.length > 0) {
        const square = fallingSquares[fallingSquares.length - 1];
        switch (event.key) {
            case 'ArrowLeft':
                square.x = Math.max(0, square.x - 10); // Move left
                break;
            case 'ArrowRight':
                square.x = Math.min(canvas.width - square.width, square.x + 10); // Move right
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

showIntro();
