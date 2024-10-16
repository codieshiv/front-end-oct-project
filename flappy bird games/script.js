// User Authentication and Management
let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

const navUser = document.getElementById('navUser');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const gameCanvas = document.getElementById('gameCanvas');
const leaderboard = document.getElementById('leaderboard');
const leaderboardBody = document.getElementById('leaderboardBody');

// Initialize App
updateNav();
if (currentUser) {
    showGame();
} else {
    showLoginForm();
}

// Event Listeners
document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('signupBtn').addEventListener('click', signup);
document.getElementById('showSignup').addEventListener('click', showSignupForm);
document.getElementById('showLogin').addEventListener('click', showLoginForm);

// Authentication Functions
function updateNav() {
    navUser.innerHTML = '';
    if (currentUser) {
        navUser.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="#">Hello, ${currentUser.username}</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" id="logoutBtn">Logout</a>
            </li>
        `;
        document.getElementById('logoutBtn').addEventListener('click', logout);
    } else {
        navUser.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="#" id="navLogin">Login</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" id="navSignup">Sign Up</a>
            </li>
        `;
        document.getElementById('navLogin').addEventListener('click', showLoginForm);
        document.getElementById('navSignup').addEventListener('click', showSignupForm);
    }
}

function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (users[username] && users[username].password === password) {
        currentUser = { username: username, highScore: users[username].highScore || 0 };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateNav();
        showGame();
    } else {
        alert('Invalid username or password.');
    }
}

function signup() {
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (users[username]) {
        alert('Username already exists.');
    } else if (username && password) {
        users[username] = { password: password, highScore: 0 };
        localStorage.setItem('users', JSON.stringify(users));
        alert('Signup successful! Please login.');
        showLoginForm();
    } else {
        alert('Please enter a valid username and password.');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateNav();
    showLoginForm();
}

// Display Functions
function showLoginForm() {
    loginForm.classList.remove('d-none');
    signupForm.classList.add('d-none');
    gameCanvas.classList.add('d-none');
    leaderboard.classList.add('d-none');
}

function showSignupForm() {
    signupForm.classList.remove('d-none');
    loginForm.classList.add('d-none');
    gameCanvas.classList.add('d-none');
    leaderboard.classList.add('d-none');
}

function showGame() {
    loginForm.classList.add('d-none');
    signupForm.classList.add('d-none');
    gameCanvas.classList.remove('d-none');
    leaderboard.classList.remove('d-none');
    startGame();
    updateLeaderboard();
}

// Game Logic
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

let bird = { x: 50, y: 150, width: 34, height: 24, gravity: 2, lift: -30, velocity: 0 };
let pipes = [];
let frameCount = 0;
let score = 0;
let gameOver = false;
let pipeSpeed = 2; // Initial pipe speed

function startGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    frameCount = 0;
    score = 0;
    gameOver = false;
    pipeSpeed = 2; // Reset pipe speed
    document.addEventListener('keydown', flap);
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (gameOver) {
        endGame();
        return;
    }
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    frameCount++;

    // Bird physics
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
    }

    // Increase pipe speed based on score
    if (Math.floor(score) % 5 === 0 && score > 0 && frameCount % 90 === 0) {
        pipeSpeed = 2 + Math.floor(score / 5) * 0.5;
    }

    // Generate pipes
    if (frameCount % 90 === 0) {
        let gap = 120;
        let topHeight = Math.random() * (canvas.height - gap - 50) + 20;
        let bottomY = topHeight + gap;
        pipes.push({
            x: canvas.width,
            y: 0,
            width: 50,
            height: topHeight
        });
        pipes.push({
            x: canvas.width,
            y: bottomY,
            width: 50,
            height: canvas.height - bottomY
        });
    }

    // Move pipes
    for (var i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;

        // Collision detection
        if (
            bird.x < pipes[i].x + pipes[i].width &&
            bird.x + bird.width > pipes[i].x &&
            bird.y < pipes[i].y + pipes[i].height &&
            bird.y + bird.height > pipes[i].y
        ) {
            gameOver = true;
        }

        // Increment score
        if (!pipes[i].scored && pipes[i].x + pipes[i].width < bird.x) {
            score += 0.5;
            pipes[i].scored = true;
        }
    }

    // Remove off-screen pipes
    if (pipes.length && pipes[0].x + pipes[0].width < 0) {
        pipes.splice(0, 2);
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Draw pipes
    ctx.fillStyle = '#8be04e';
    for (var i = 0; i < pipes.length; i++) {
        ctx.fillRect(pipes[i].x, pipes[i].y, pipes[i].width, pipes[i].height);
    }

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${Math.floor(score)}`, 10, 30);
}

function flap(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        bird.velocity = bird.lift;
    }
}

function endGame() {
    document.removeEventListener('keydown', flap);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, canvas.height / 2 - 50, canvas.width, 100);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 75, canvas.height / 2 - 10);
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${Math.floor(score)}`, canvas.width / 2 - 40, canvas.height / 2 + 20);

    // Update high score
    if (score > currentUser.highScore) {
        currentUser.highScore = Math.floor(score);
        users[currentUser.username].highScore = currentUser.highScore;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateLeaderboard();
        setTimeout(() => {
            alert('New High Score!');
        }, 100);
    }

    // Restart game after delay
    setTimeout(() => {
        startGame();
    }, 2000);
}

// Leaderboard
function updateLeaderboard() {
    let leaderboardData = [];
    for (let user in users) {
        leaderboardData.push({ username: user, highScore: users[user].highScore || 0 });
    }
    leaderboardData.sort((a, b) => b.highScore - a.highScore);
    leaderboardBody.innerHTML = '';
    leaderboardData.slice(0, 10).forEach((user, index) => {
        let row = leaderboardBody.insertRow();
        let cellRank = row.insertCell(0);
        let cellUser = row.insertCell(1);
        let cellScore = row.insertCell(2);
        cellRank.textContent = index + 1;
        cellUser.textContent = user.username;
        cellScore.textContent = user.highScore;
    });
}