const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

let p1, p2;
let gameActive = false;
let timer = 99;
let timerId;

function startFight() {
    p1 = new Player({
        x: 100,
        y: 0,
        color: characters[charSelect.p1Index].color,
        side: "left"
    });

    p2 = new Player({
        x: 800,
        y: 0,
        color: characters[charSelect.p2Index].color,
        side: "right"
    });

    gameActive = true;
    timer = 99;
    document.getElementById("timer").innerText = timer;
    
    decreaseTimer();
    animate();
}

function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.getElementById("timer").innerText = timer;
    }

    if (timer === 0) {
        determineWinner();
    }
}

function determineWinner() {
    clearTimeout(timerId);
    if (p1.health === p2.health) endGame("TIE");
    else if (p1.health > p2.health) endGame("Player 1");
    else endGame("Player 2");
}

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.pos.x + rectangle1.attackBox.width >= rectangle2.pos.x &&
        rectangle1.attackBox.pos.x <= rectangle2.pos.x + rectangle2.width &&
        rectangle1.attackBox.pos.y + rectangle1.attackBox.height >= rectangle2.pos.y &&
        rectangle1.attackBox.pos.y <= rectangle2.pos.y + rectangle2.height
    );
}

function animate() {
    if (!gameActive) return;
    window.requestAnimationFrame(animate);
    
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    p1.update();
    p2.update();

    p1.draw(ctx);
    p2.draw(ctx);

    // Collision detection
    if (p1.isAttacking && rectangularCollision({ rectangle1: p1, rectangle2: p2 })) {
        p1.isAttacking = false;
        p2.takeHit();
        updateHealth(p1, p2);
    }

    if (p2.isAttacking && rectangularCollision({ rectangle1: p2, rectangle2: p1 })) {
        p2.isAttacking = false;
        p1.takeHit();
        updateHealth(p1, p2);
    }
}

function endGame(winner) {
    gameActive = false;
    clearTimeout(timerId);
    document.getElementById("winner-text").innerText = winner === "TIE" ? "IT'S A TIE!" : `${winner} WINS!`;
    showScreen("win-screen");
}
