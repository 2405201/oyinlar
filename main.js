const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('3d');

// O'yinchi mashinasi
let playerCar = {
    x: 350,
    y: 500,
    width: 50,
    height: 100,
    speed: 5,
    borderRadius: 15,
    color: 'blue'
};

// Dushman mashinalari
let enemyCars = [];
const enemyCarWidth = 50;
const enemyCarHeight = 100;
const enemySpeed = 3;

// O'yin vaqtini kuzatish
let time = 0;
let gameInterval, enemyInterval;

// Mashina tanlashni boshqarish
let isGameStarted = false;

// O'yinni boshlash
function startGame() {
    document.getElementById('car-selection').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    document.getElementById('game-container').style.borderRadius = '15px';
    gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
    enemyInterval = setInterval(generateEnemyCar, 2000); // Har 2 sekundda dushman mashinasini yaratish
    setInterval(updateTime, 1000); // Vaqtni yangilash
    isGameStarted = true;
}

// Yangi o'yin boshlash
function startNewGame() {
    if (isGameStarted) {
        clearInterval(gameInterval);
        clearInterval(enemyInterval);
    }

    time = 0;
    enemyCars = [];
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('car-selection').style.display = 'block';
}

// Mashina tanlash
function chooseCar(color) {
    playerCar.color = color;
    playerCar.x = 350; // Mashina boshlanish joyiga qaytadi
    playerCar.y = 500;
    playerCar.speed = 5; // Tezlikni boshlash

    startGame();
}

// O'yin vaqti
function updateTime() {
    time++;
    document.getElementById('time').innerText = time;
}

// Mashina chizish
function drawPlayerCar() {
    ctx.fillStyle = playerCar.color;
    ctx.fillRect(playerCar.x, playerCar.y, playerCar.width, playerCar.height);
}

// Dushman mashinasini yaratish
function generateEnemyCar() {
    const x = Math.random() * (canvas.width - enemyCarWidth);
    const y = -enemyCarHeight;
    enemyCars.push({ x, y });
}

// Dushman mashinasini chizish
function drawEnemyCars() {
    ctx.fillStyle = 'red';
    ctx.borderRadius = '10px'
    enemyCars.forEach((car, index) => {
        ctx.fillRect(car.x, car.y, enemyCarWidth, enemyCarHeight);

        // Dushman mashinasining harakati
        car.y += enemySpeed;

        // Agar dushman mashinasi pastga tushsa, uni olib tashlash
        if (car.y > canvas.height) {
            enemyCars.splice(index, 1);
        }

        // O'yinchi mashinasi bilan to'qnashuvni tekshirish
        if (
            car.x < playerCar.x + playerCar.width &&
            car.x + enemyCarWidth > playerCar.x &&
            car.y < playerCar.y + playerCar.height &&
            car.y + enemyCarHeight > playerCar.y
        ) {
            stopGame();
        }
    });
}

// O'yinchini klaviatura orqali boshqarish
function movePlayerCar() {
    if (keyState['ArrowLeft'] && playerCar.x > 0) playerCar.x -= playerCar.speed;
    if (keyState['ArrowRight'] && playerCar.x + playerCar.width < canvas.width) playerCar.x += playerCar.speed;
}

// Klaviatura tugmalari orqali boshqarish
let keyState = {};
document.addEventListener('keydown', (e) => {
    keyState[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    keyState[e.key] = false;
});

// O'yin tsikli
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Ekranni tozalash

    movePlayerCar(); // O'yinchining harakatini boshqarish
    drawPlayerCar(); // O'yinchining mashinasini chizish
    drawEnemyCars(); // Dushman mashinalarini chizish
}

// O'yinni to'xtatish
function stopGame() {
    clearInterval(gameInterval);
    clearInterval(enemyInterval);
    alert('O\'yinni yutqazdingiz! Vaqt: ' + time + ' sekund');
}