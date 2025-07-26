window.addEventListener('load', () => {
  const modal = document.getElementById('welcomeModal');
  const closeBtn = document.getElementById('closeModalBtn');

  if (modal && closeBtn) {
    modal.classList.remove('hidden');

    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }
});


// Variables globales 

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const newRecordMsg = document.getElementById('newRecordMsg');
const restartBtn = document.getElementById('restartBtn');

let gameRunning = false;
let gamePaused = false;
let score = 0;
let highScore = 0;
let gameInterval;

// Tamaño de cada celda
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// La serpiente (array de objetos con x, y)
let snake = [
    { x: 10, y: 10 }
];

// Comida
let food = {
    x: 15,
    y: 15
};

// Dirección
let dx = 0;
let dy = 0;

// Función para dibujar todo
function draw() {

    // Limpiar canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar la serpiente
    ctx.fillStyle = '#00FF00'; // Verde clásico
    for (let i = 1; i < snake.length; i++) {
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2);
    }

    // Dibujar la cabeza diferente
    ctx.fillStyle = '#FFFF00'; // Amarillo
    ctx.fillRect(snake[0].x * gridSize, snake[0].y * gridSize, gridSize - 2, gridSize - 2);

    // Dibujar comida
    ctx.fillStyle = '#FF0000'; // Rojo
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// Función para mover la serpiente
function update() {
    if (!gameRunning || gamePaused) return;

    // Mover la cabeza
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Revisar colisiones con paredes
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Revisar colisión consigo misma
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // Revisar si comió
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
        // No quitar la cola (la serpiente crece)
    } else {
        // Quitar la cola
        snake.pop();
    }
}

// Generar nueva comida
function generateFood() {
    let foodOnSnake = true;
    while (foodOnSnake) {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };

        foodOnSnake = false;
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                foodOnSnake = true;
                break;
            }
        }
    }
}

// Game Over
function gameOver() {
    gameRunning = false;
    clearInterval(gameInterval);

    // Revisar nuevo record
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        newRecordMsg.style.display = 'block';
    } else {
        newRecordMsg.style.display = 'none';
    }

    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
    startBtn.classList.remove('hidden');
    pauseBtn.classList.add('hidden');
}

// Reiniciar juego
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 1; // ← empieza moviéndose a la derecha
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    generateFood();
    gameOverScreen.classList.add('hidden');
    gamePaused = false;
}

// Controles
document.addEventListener('keydown', function (e) {
    if (!gameRunning) return;

    // Evitar retroceder
    switch (e.key) {
        case 'ArrowUp':
            if (dy !== 1) {
                dx = 0;
                dy = -1;
            }
            e.preventDefault();
            break;
        case 'ArrowDown':
            if (dy !== -1) {
                dx = 0;
                dy = 1;
            }
            e.preventDefault();
            break;
        case 'ArrowLeft':
            if (dx !== 1) {
                dx = -1;
                dy = 0;
            }
            e.preventDefault();
            break;
        case 'ArrowRight':
            if (dx !== -1) {
                dx = 1;
                dy = 0;
            }
            e.preventDefault();
            break;
        case ' ': // Barra espaciadora para pausar
            togglePause();
            e.preventDefault();
            break;
    }
});

// Función de pausa
function togglePause() {
    if (!gameRunning) return;

    gamePaused = !gamePaused;
    if (gamePaused) {
        pauseBtn.textContent = '▶️ REANUDAR';
    } else {
        pauseBtn.textContent = '⏸️ PAUSAR';
    }
}

// Iniciar juego
function startGame() {
    resetGame();
    gameRunning = true;
    startBtn.classList.add('hidden');
    pauseBtn.classList.remove('hidden');
    pauseBtn.textContent = '⏸️ PAUSAR';

    // Iniciar el game loop
    gameInterval = setInterval(function () {
        update();
        draw();
    }, 200);
}

// Event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', startGame);

// Dibujar estado inicial
draw();

