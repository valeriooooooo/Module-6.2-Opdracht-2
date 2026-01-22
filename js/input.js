const keys = {
    a: { pressed: false },
    d: { pressed: false },
    w: { pressed: false },
    s: { pressed: false },
    ArrowRight: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowUp: { pressed: false },
    ArrowDown: { pressed: false }
};

window.addEventListener("keydown", (event) => {
    // Character Select Logic
    if (charSelect && document.getElementById("character-select").classList.contains("hidden") === false) {
        switch (event.key) {
            case "w": charSelect.movePlayer("p1", "up"); break;
            case "s": charSelect.movePlayer("p1", "down"); break;
            case "a": charSelect.movePlayer("p1", "left"); break;
            case "d": charSelect.movePlayer("p1", "right"); break;
            case "e": charSelect.confirm("p1"); break;

            case "ArrowUp": charSelect.movePlayer("p2", "up"); break;
            case "ArrowDown": charSelect.movePlayer("p2", "down"); break;
            case "ArrowLeft": charSelect.movePlayer("p2", "left"); break;
            case "ArrowRight": charSelect.movePlayer("p2", "right"); break;
            case "m": charSelect.confirm("p2"); break;
        }
    }

    // Fight Logic
    if (gameActive) {
        switch (event.key) {
            case "d": keys.d.pressed = true; break;
            case "a": keys.a.pressed = true; break;
            case "w": 
                if (p1.pos.y + p1.height >= (typeof groundY !== "undefined" ? groundY : 450)) p1.vel.y = -20;
                p1.state = "jump";
                break;
            case "e": p1.attack(); break;
            case "s": 
                p1.state = "crouch";
                keys.s.pressed = true;
                break;

            case "ArrowRight": keys.ArrowRight.pressed = true; break;
            case "ArrowLeft": keys.ArrowLeft.pressed = true; break;
            case "ArrowUp": 
                if (p2.pos.y + p2.height >= (typeof groundY !== "undefined" ? groundY : 450)) p2.vel.y = -20;
                p2.state = "jump";
                break;
            case "m": p2.attack(); break;
            case "ArrowDown": 
                p2.state = "crouch";
                keys.ArrowDown.pressed = true;
                break;
        }
    }
});

window.addEventListener("keyup", (event) => {
    if (gameActive) {
        switch (event.key) {
            case "d": keys.d.pressed = false; break;
            case "a": keys.a.pressed = false; break;
            case "s": 
                keys.s.pressed = false;
                if (p1.state === "crouch") p1.state = "idle";
                break;

            case "ArrowRight": keys.ArrowRight.pressed = false; break;
            case "ArrowLeft": keys.ArrowLeft.pressed = false; break;
            case "ArrowDown": 
                keys.ArrowDown.pressed = false;
                if (p2.state === "crouch") p2.state = "idle";
                break;
        }
    }
});

function handleMovement() {
    if (!gameActive) return;

    // Player 1 movement
    p1.vel.x = 0;
    if (p1.state !== "crouch") {
        if (keys.a.pressed) p1.vel.x = -5;
        else if (keys.d.pressed) p1.vel.x = 5;
    }

    // Player 2 movement
    p2.vel.x = 0;
    if (p2.state !== "crouch") {
        if (keys.ArrowLeft.pressed) p2.vel.x = -5;
        else if (keys.ArrowRight.pressed) p2.vel.x = 5;
    }
}

// Hook handleMovement into the game loop
const originalAnimate = animate;
animate = function() {
    handleMovement();
    originalAnimate();
};
