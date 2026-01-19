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

async function startCountdown() {
    // 3..2..1 Countdown
    showText("3", 800);
    await wait(1000);
    showText("2", 800);
    await wait(1000);
    showText("1", 800);
    await wait(1000);

    // Fade Out (5s)
    await fadeOut(5000);
    
    // Setup and switch screen
    document.getElementById("character-select").classList.add("hidden");
    document.getElementById("fight-scene").classList.remove("hidden");
    
    // Fade In
    await fadeIn(1000);
    
    showText("FIGHT!", 1000);
    startFight();
}

function updateHealth(p1, p2) {
    p1HealthBar.style.width = Math.max(0, p1.health) + "%";
    p2HealthBar.style.width = Math.max(0, p2.health) + "%";

    if (p1.health <= 0) endGame("Player 2");
    else if (p2.health <= 0) endGame("Player 1");
}

function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    document.getElementById(screenId).classList.remove("hidden");
}
