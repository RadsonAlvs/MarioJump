const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restart-button");

let score = 0;
let gameIsRunning = true;
let loop;
let jumpCount = 0;
let lastPipePosition = 0;
let hasPassed = false;

const increaseDifficulty = () => {
    const currentSpeed = parseFloat(getComputedStyle(pipe).animationDuration);
    if (currentSpeed > 0.7) { // Limite mínimo de velocidade
        pipe.style.animationDuration = `${currentSpeed - 0.1}s`;
    }
};

const updateScore = () => {
    score += 10;
    scoreElement.textContent = `Score: ${score}`;
    jumpCount++;
    
    if (jumpCount % 5 === 0) {
        increaseDifficulty();
    }
};

const startGame = () => {
    loop = setInterval(checkCollision, 10);
    pipe.style.animationDuration = "1.5s"; // Velocidade inicial
};

const jump = () => {
    if (!gameIsRunning) return;
    mario.classList.add("jump");

    setTimeout(() => {
        mario.classList.remove("jump");
    }, 500);
};

const resetGame = () => {
    gameIsRunning = true;
    score = 0;
    jumpCount = 0;
    hasPassed = false;
    scoreElement.textContent = "Score: 0";
    
    pipe.style.animation = "";
    pipe.style.left = "";
    
    mario.style.animation = "";
    mario.style.bottom = "0";
    mario.src = "./imagens/mario.gif";
    mario.style.width = "150px";
    mario.style.marginLeft = "";
    
    const gameOverText = document.querySelector(".game-board div:last-child");
    if (gameOverText && gameOverText.innerHTML === "GAME OVER") {
        gameOverText.remove();
    }
    
    restartButton.style.display = "none";
    
    document.addEventListener("keydown", jump);
    startGame();
};

const gameOver = () => {
    gameIsRunning = false;
    clearInterval(loop);
    
    pipe.style.animation = "none";
    pipe.style.left = `${pipe.offsetLeft}px`;

    mario.style.animation = "none";
    mario.style.bottom = `${mario.offsetBottom}`;
    mario.src = "./imagens/game-over.png";
    mario.style.width = "75px";
    mario.style.marginLeft = "50px";

    const gameOverText = document.createElement("div");
    gameOverText.innerHTML = "GAME OVER";
    gameOverText.style.position = "absolute";
    gameOverText.style.top = "50%";
    gameOverText.style.left = "50%";
    gameOverText.style.transform = "translate(-50%, -50%)";
    gameOverText.style.color = "red";
    gameOverText.style.fontFamily = "Arial";
    gameOverText.style.fontWeight = "bold";
    document.querySelector(".game-board").appendChild(gameOverText);

    restartButton.style.display = "block";
    document.removeEventListener("keydown", jump);
};

restartButton.addEventListener("click", resetGame);

const checkCollision = () => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace("px", "");

    // Verifica se passou pelo obstáculo
    if (pipePosition < 120 && !hasPassed && marioPosition >= 80) {
        hasPassed = true;
        updateScore();
    }
    
    // Reset hasPassed quando o pipe voltar para a direita
    if (pipePosition > 120) {
        hasPassed = false;
    }

    // Verifica colisão
    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        gameOver();
        clearInterval(loop);
    }
};

// Iniciar o jogo
startGame();

document.addEventListener("keydown", jump);
