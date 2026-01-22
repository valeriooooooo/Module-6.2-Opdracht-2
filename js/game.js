const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;
const groundY = 450;
const groundHeight = canvas.height - groundY;
const groundSnowCap = 14; // thin snowy layer on top of the ground
// Initialize snow effect
let snowEffect;


let p1, p2;
let gameActive = false;
let timer = 99;
let timerId;

function startFight() {
        // Start the snow effect
        if (!snowEffect) {
            snowEffect = new SnowEffect(canvas, 150); // 150 snowflakes
        }
        snowEffect.start();
    
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

function checkBodyCollision(player1, player2) {
    // Check if two player bodies overlap - both must be near ground level
    const groundLevel = typeof groundY !== "undefined" ? groundY : 450;
    const onGround1 = player1.pos.y + player1.height >= groundLevel - 5;
    const onGround2 = player2.pos.y + player2.height >= groundLevel - 5;
    
    return (
        onGround1 && onGround2 &&
        player1.pos.x + player1.width > player2.pos.x &&
        player1.pos.x < player2.pos.x + player2.width
    );
}

function clampPlayerToStage(player) {
    // Keep players inside the canvas horizontally
    if (player.pos.x < 0) player.pos.x = 0;
    if (player.pos.x + player.width > canvas.width) player.pos.x = canvas.width - player.width;
}

function resolveHorizontalOverlap() {
    const p1Right = p1.pos.x + p1.width;
    const p2Right = p2.pos.x + p2.width;

    // Detect overlap on X axis and push players apart equally
    if (p1.pos.x < p2.pos.x) {
        const overlap = p1Right - p2.pos.x;
        if (overlap > 0) {
            const push = overlap / 2;
            p1.pos.x -= push;
            p2.pos.x += push;
        }
    } else {
        const overlap = p2Right - p1.pos.x;
        if (overlap > 0) {
            const push = overlap / 2;
            p2.pos.x -= push;
            p1.pos.x += push;
        }
    }

    clampPlayerToStage(p1);
    clampPlayerToStage(p2);
}

function updateFacingAndHitboxes() {
    // Face each other based on relative position (handles jumping over)
    if (p1.pos.x < p2.pos.x) {
        p1.side = "left";
        p2.side = "right";
    } else {
        p1.side = "right";
        p2.side = "left";
    }

    // Reposition attack boxes to match the updated facing
    const syncAttackBox = (player) => {
        player.attackBox.pos.x = player.side === "left"
            ? player.pos.x + player.width
            : player.pos.x - player.attackBox.width;
        player.attackBox.pos.y = player.pos.y + 30;
    };

    syncAttackBox(p1);
    syncAttackBox(p2);
}

function animate() {
    if (!gameActive) return;
    window.requestAnimationFrame(animate);
    
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground: stone base with snowy top
    ctx.fillStyle = "#3b3b3f"; // stone color
    ctx.fillRect(0, groundY, canvas.width, groundHeight);
    ctx.fillStyle = "#e8f2ff"; // snow cap color
    ctx.fillRect(0, groundY, canvas.width, Math.min(groundSnowCap, groundHeight));

    // Update and draw snow in the background
    snowEffect.update(groundY + Math.min(groundSnowCap, groundHeight));
    snowEffect.draw();
    

    p1.update();
    p2.update();

    // Prevent walking through each other when on ground
    if (checkBodyCollision(p1, p2)) {
        // Revert positions to prevent overlap
        p1.pos.x -= p1.vel.x;
        p2.pos.x -= p2.vel.x;
        
        // Stop both players
        p1.vel.x = 0;
        p2.vel.x = 0;
    }

    // Let players overlap (no horizontal pushback) and still face each other
    updateFacingAndHitboxes();

    p1.draw(ctx);
    p2.draw(ctx);
    // Draw attacks after bodies so both sides are visible
    p1.drawAttack(ctx);
    p2.drawAttack(ctx);

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
        snowEffect.stop();
    clearTimeout(timerId);
    document.getElementById("winner-text").innerText = winner === "TIE" ? "IT'S A TIE!" : `${winner} WINS!`;
    showScreen("win-screen");
}
