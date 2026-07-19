const canvas = document.querySelector("#gameCanvas");
const context = canvas.getContext("2d");
const scoreDisplay = document.querySelector("[data-score]");
const bestDisplay = document.querySelector("[data-best]");
const statusDisplay = document.querySelector("[data-status]");
const messageDisplay = document.querySelector("[data-message]");
const startButton = document.querySelector('[data-action="start"]');
const pauseButtons = document.querySelectorAll('[data-action="pause"]');
const directionButtons = document.querySelectorAll("[data-direction]");
const difficultySelect = document.querySelector("#difficulty");

const columnCount = 20;
const bestScoreKey = "arcadeOrbitBestScore";
const speedMap = {
	chill: 180,
	arcade: 130,
	turbo: 95,
};

const directionMap = {
	up: { x: 0, y: -1 },
	down: { x: 0, y: 1 },
	left: { x: -1, y: 0 },
	right: { x: 1, y: 0 },
};

const keyMap = {
	arrowup: "up",
	w: "up",
	arrowdown: "down",
	s: "down",
	arrowleft: "left",
	a: "left",
	arrowright: "right",
	d: "right",
};

let boardSize = 0;
let cellSize = 0;
let animationFrameId = 0;
let lastTimestamp = 0;
let accumulator = 0;
let tickRate = speedMap.arcade;
let gameRunning = false;
let gamePaused = false;
let gameOver = false;
let gameCountdown = 0;
let countdownAccumulator = 0;
let score = 0;
let bestScore = Number(localStorage.getItem(bestScoreKey) || 0);
let snake = [];
let food = { x: 0, y: 0 };
let currentDirection = { x: 1, y: 0 };
let queuedDirection = { x: 1, y: 0 };

bestDisplay.textContent = bestScore;
updateStatus("Stand by", "Press Start to wake the cabinet.");
fitCanvas();
resetGame(false);
animationFrameId = requestAnimationFrame(gameLoop);

window.addEventListener("resize", fitCanvas);
window.addEventListener("keydown", handleKeydown);
startButton.addEventListener("click", startGame);
pauseButtons.forEach((button) => button.addEventListener("click", togglePause));
directionButtons.forEach((button) => {
	const direction = button.dataset.direction;
	if (!direction) {
		return;
	}

	button.addEventListener("click", () => moveDirection(direction));
});
difficultySelect.addEventListener("change", updateDifficulty);
canvas.addEventListener("pointerdown", () => {
	canvas.focus();
});

function fitCanvas() {
	const bounds = canvas.getBoundingClientRect();
	const nextBoardSize = Math.floor(bounds.width);
	const devicePixelRatio = window.devicePixelRatio || 1;

	boardSize = nextBoardSize;
	cellSize = boardSize / columnCount;
	canvas.width = Math.floor(boardSize * devicePixelRatio);
	canvas.height = Math.floor(boardSize * devicePixelRatio);
	context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
	context.imageSmoothingEnabled = false;
}

function updateDifficulty() {
	tickRate = speedMap[difficultySelect.value] || speedMap.arcade;
}

function startGame() {
	tickRate = speedMap[difficultySelect.value] || speedMap.arcade;
	resetGame(true);
	gameRunning = true;
	gamePaused = false;
	gameOver = false;
	gameCountdown = 3;
	countdownAccumulator = 0;
	accumulator = 0;
	startButton.textContent = "Start";
	updateStatus("Starting", "Get ready.");
	canvas.focus();
}

function resetGame(showMessage) {
	score = 0;
	snake = [
		{ x: 9, y: 10 },
		{ x: 8, y: 10 },
		{ x: 7, y: 10 },
	];
	currentDirection = { x: 1, y: 0 };
	queuedDirection = { x: 1, y: 0 };
	tickRate = speedMap[difficultySelect.value] || speedMap.arcade;
	spawnFood();
	updateScore();
	if (showMessage) {
		updateStatus("Ready", "Use arrows, WASD, or touch controls to begin.");
	}
}

function updateScore() {
	scoreDisplay.textContent = score;
	if (score > bestScore) {
		bestScore = score;
		localStorage.setItem(bestScoreKey, String(bestScore));
		bestDisplay.textContent = bestScore;
	}
}

function updateStatus(status, message) {
	statusDisplay.textContent = status;
	messageDisplay.textContent = message;
}

function handleKeydown(event) {
	const key = event.key.toLowerCase();

	if (key === " " || key === "p") {
		event.preventDefault();
		togglePause();
		return;
	}

	if (key === "enter" && !gameRunning) {
		startGame();
		return;
	}

	const direction = keyMap[key];
	if (direction) {
		event.preventDefault();
		moveDirection(direction);
	}
}

function moveDirection(direction) {
	const nextDirection = directionMap[direction];

	if (!nextDirection || !gameRunning || gamePaused || gameOver) {
		return;
	}

	const isReverse =
		nextDirection.x === -currentDirection.x && nextDirection.y === -currentDirection.y;

	if (isReverse) {
		return;
	}

	queuedDirection = nextDirection;
}

function togglePause() {
	if (!gameRunning || gameOver) {
		startGame();
		return;
	}

	gamePaused = !gamePaused;
	if (gamePaused) {
		updateStatus("Paused", "Press Pause to continue the run.");
		setPauseButtonLabels("Resume");
		return;
	}

	setPauseButtonLabels("Pause");
	updateStatus("Playing", "Keep the snake moving and avoid the walls.");
}

function setPauseButtonLabels(label) {
	pauseButtons.forEach((button) => {
		button.textContent = label;
	});
}

function gameLoop(timestamp) {
	if (!lastTimestamp) {
		lastTimestamp = timestamp;
	}

	const delta = timestamp - lastTimestamp;
	lastTimestamp = timestamp;

	if (gameRunning && !gamePaused && !gameOver) {
		if (gameCountdown > 0) {
			updateStatus("Starting", String(gameCountdown));
			countdownAccumulator += delta;
			while (countdownAccumulator >= 1000 && gameCountdown > 0) {
				gameCountdown -= 1;
				countdownAccumulator -= 1000;
			}
			if (gameCountdown <= 0) {
				updateStatus("Playing", "Keep the snake moving and avoid the walls.");
			}
		} else {
			accumulator += delta;
			while (accumulator >= tickRate) {
				tick();
				accumulator -= tickRate;
			}
		}
	}

	draw();
	animationFrameId = requestAnimationFrame(gameLoop);
}

function tick() {
	currentDirection = queuedDirection;
	const head = {
		x: snake[0].x + currentDirection.x,
		y: snake[0].y + currentDirection.y,
	};

	const hitsWall =
		head.x < 0 || head.x >= columnCount || head.y < 0 || head.y >= columnCount;
	const hitsBody = snake.some((segment) => segment.x === head.x && segment.y === head.y);

	if (hitsWall || hitsBody) {
		endGame();
		return;
	}

	snake.unshift(head);

	if (head.x === food.x && head.y === food.y) {
		score += 10;
		updateScore();
		spawnFood();
		tickRate = Math.max(70, tickRate - 3);
		return;
	}

	snake.pop();
}

function spawnFood() {
	let nextFood;
	do {
		nextFood = {
			x: Math.floor(Math.random() * columnCount),
			y: Math.floor(Math.random() * columnCount),
		};
	} while (snake.some((segment) => segment.x === nextFood.x && segment.y === nextFood.y));

	food = nextFood;
}

function endGame() {
	gameOver = true;
	gameRunning = false;
	gamePaused = false;
	gameCountdown = 0;
	countdownAccumulator = 0;
	startButton.textContent = "Start";
	setPauseButtonLabels("Pause");
	updateStatus("Game Over", "The cabinet reset. Hit Start to try another run.");
}

function draw() {
	context.clearRect(0, 0, boardSize, boardSize);
	drawBackdrop();
	drawGrid();
	drawFood();
	drawSnake();
	drawOverlayText();
}

function drawBackdrop() {
	const gradient = context.createLinearGradient(0, 0, 0, boardSize);
	gradient.addColorStop(0, "#031c2a");
	gradient.addColorStop(1, "#020d15");
	context.fillStyle = gradient;
	context.fillRect(0, 0, boardSize, boardSize);

	context.fillStyle = "rgba(142, 202, 230, 0.05)";
	for (let index = 0; index < columnCount; index += 1) {
		context.fillRect(index * cellSize, 0, 1, boardSize);
		context.fillRect(0, index * cellSize, boardSize, 1);
	}
}

function drawGrid() {
	context.save();
	context.strokeStyle = "rgba(33, 158, 188, 0.08)";
	context.lineWidth = 1;
	for (let index = 0; index <= columnCount; index += 1) {
		const coordinate = index * cellSize;
		context.beginPath();
		context.moveTo(coordinate, 0);
		context.lineTo(coordinate, boardSize);
		context.stroke();

		context.beginPath();
		context.moveTo(0, coordinate);
		context.lineTo(boardSize, coordinate);
		context.stroke();
	}
	context.restore();
}

function drawFood() {
	const centerX = food.x * cellSize + cellSize / 2;
	const centerY = food.y * cellSize + cellSize / 2;
	const radius = cellSize * 0.34;
	const glow = context.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius * 1.6);
	glow.addColorStop(0, "rgba(251, 133, 0, 0.95)");
	glow.addColorStop(1, "rgba(251, 133, 0, 0)");
	context.fillStyle = glow;
	context.beginPath();
	context.arc(centerX, centerY, radius * 1.8, 0, Math.PI * 2);
	context.fill();

	context.fillStyle = "#ffb703";
	context.beginPath();
	context.arc(centerX, centerY, radius, 0, Math.PI * 2);
	context.fill();
}

function drawSnake() {
	snake.forEach((segment, index) => {
		const x = segment.x * cellSize + 2;
		const y = segment.y * cellSize + 2;
		const size = cellSize - 4;
		const tailFactor = 1 - index / Math.max(snake.length, 1);
		const fillColor = index === 0
			? "#8ecae6"
			: `rgba(33, 158, 188, ${0.82 + tailFactor * 0.18})`;

		context.fillStyle = fillColor;
		drawRoundedCell(x, y, size, size, Math.max(4, cellSize * 0.25));

		if (index === 0) {
			context.fillStyle = "#023047";
			drawEye(x + size * 0.26, y + size * 0.26, size * 0.12);
			drawEye(x + size * 0.62, y + size * 0.26, size * 0.12);
		}
	});
}

function drawRoundedCell(x, y, width, height, radius) {
	context.beginPath();
	context.moveTo(x + radius, y);
	context.arcTo(x + width, y, x + width, y + height, radius);
	context.arcTo(x + width, y + height, x, y + height, radius);
	context.arcTo(x, y + height, x, y, radius);
	context.arcTo(x, y, x + width, y, radius);
	context.closePath();
	context.fill();
}

function drawEye(x, y, radius) {
	context.beginPath();
	context.arc(x, y, radius, 0, Math.PI * 2);
	context.fill();
}

function drawOverlayText() {
	if (gameRunning && !gamePaused && !gameOver && gameCountdown <= 0) {
		return;
	}

	context.save();
	context.textAlign = "center";
	context.fillStyle = "rgba(247, 251, 255, 0.92)";
	context.font = `700 ${Math.max(18, boardSize * 0.04)}px Oxanium, sans-serif`;

	const headline = gameOver ? "Game Over" : gamePaused ? "Paused" : gameCountdown > 0 ? String(gameCountdown) : "Ready";
	context.fillText(headline, boardSize / 2, boardSize / 2 - cellSize * 0.5);

	context.fillStyle = "rgba(181, 208, 223, 0.95)";
	context.font = `500 ${Math.max(11, boardSize * 0.022)}px Manrope, sans-serif`;
	const detail = gameOver
		? "Press Start to restart the cabinet"
		: gamePaused
			? "Use Pause or tap Resume to keep going"
			: gameCountdown > 0
				? "Starting in a moment"
			: "Use the controls below or press Start Game";
	context.fillText(detail, boardSize / 2, boardSize / 2 + cellSize * 0.2);
	context.restore();
}
