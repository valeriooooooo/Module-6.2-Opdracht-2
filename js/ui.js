const transitionOverlay = document.getElementById("transition-overlay");
const gameText = document.getElementById("game-text");
const p1HealthBar = document.getElementById("p1-health");
const p2HealthBar = document.getElementById("p2-health");

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showText(text, duration = 1000) {
    gameText.innerText = text;
    gameText.classList.remove("hidden");
    if (duration > 0) {
        setTimeout(() => {
            gameText.innerText = "";
        }, duration);
    }
}

async function fadeOut(duration = 1000) {
    transitionOverlay.classList.remove("hidden");
    transitionOverlay.classList.add("visible");
    await wait(duration);
}

async function fadeIn(duration = 1000) {
    transitionOverlay.classList.remove("visible");
    await wait(duration);
    transitionOverlay.classList.add("hidden");
}

async function playMatchTransition() {
    // 3 second total transition
    // Fade out (1.5s)
    transitionOverlay.classList.remove("hidden");
    transitionOverlay.classList.add("visible");
    await wait(1500);

    // Switch screens
    showScreen("fight-scene");
    
    // Setup game without starting it
    p1 = new Player({
        x: 150,
        y: 0,
        character: characters[charSelect.p1Index],
        side: "left",
        spriteId: "p1-sprite"
    });

    p2 = new Player({
        x: 700,
        y: 0,
        character: characters[charSelect.p2Index],
        side: "right",
        spriteId: "p2-sprite"
    });

    // Reset UI
    document.getElementById("p1-name").innerText = p1.character.name;
    document.getElementById("p2-name").innerText = p2.character.name;
    p1HealthBar.style.width = "100%";
    p2HealthBar.style.width = "100%";
    document.getElementById("timer").innerText = "99";
    
    // Start snow
    if (!snowEffect) {
        snowEffect = new SnowEffect(canvas, 150);
    }
    snowEffect.start();

    // Fade in (1.5s)
    transitionOverlay.classList.remove("visible");
    await wait(1500);
    transitionOverlay.classList.add("hidden");

    // Start 3 2 1 Fight Countdown
    await startFightCountdown();
}

async function startFightCountdown() {
    showText("3", 800);
    await wait(1000);
    showText("2", 800);
    await wait(1000);
    showText("1", 800);
    await wait(1000);
    showText("FIGHT!", 800);
    
    // Start the game
    gameActive = true;
    timer = 99;
    decreaseTimer();
    animate();
}

function updateHealth(p1, p2) {
    p1HealthBar.style.width = Math.max(0, p1.health) + "%";
    p2HealthBar.style.width = Math.max(0, p2.health) + "%";
    
    // Update player names from selected characters
    document.getElementById("p1-name").innerText = characters[charSelect.p1Index].name;
    document.getElementById("p2-name").innerText = characters[charSelect.p2Index].name;

    if (p1.health <= 0) endGame("Player 2");
    else if (p2.health <= 0) endGame("Player 1");
}

function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    document.getElementById(screenId).classList.remove("hidden");
}
