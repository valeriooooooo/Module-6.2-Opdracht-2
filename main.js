// Audio elements
const bgMusic = document.getElementById("bg-music");

// UI Elements
const settingsModal = document.getElementById("settings-modal");
const instructionsModal = document.getElementById("instructions-modal");
const settingsBtn = document.getElementById("settings-btn");
const closeSettingsBtn = document.getElementById("close-settings");
const playBtn = document.getElementById("play-btn");
const restartBtn = document.getElementById("restart-btn");
const instructionsModalBtn = document.getElementById("instructions-modal-btn");
const closeInstructionsBtn = document.getElementById("close-instructions");

// Initialization
settingsBtn.onclick = () => settingsModal.classList.remove("hidden");
closeSettingsBtn.onclick = () => settingsModal.classList.add("hidden");
instructionsModalBtn.onclick = () => {
    settingsModal.classList.add("hidden");
    instructionsModal.classList.remove("hidden");
};
closeInstructionsBtn.onclick = () => instructionsModal.classList.add("hidden");

playBtn.onclick = () => {
    bgMusic.play().catch(e => console.log("Music play blocked", e));
    startCharacterSelect();
};

restartBtn.onclick = () => {
    showScreen("start-screen");
};

// Volume controls
document.getElementById("music-volume").addEventListener("input", e => {
    bgMusic.volume = e.target.value;
});

document.getElementById("sfx-volume").addEventListener("input", e => {
    console.log(`SFX volume: ${e.target.value}`);
});
