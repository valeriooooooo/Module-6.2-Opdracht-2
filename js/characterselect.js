const characters = [
    { name: "Malek", color: "black" },
    { name: "Valerio", color: "pink" },
    { name: "Walid", color: "darkblue" },
    { name: "Sam", color: "green" },
    { name: "Sultan", color: "orange" },
    { name: "Jop", color: "gray" },
    { name: "Duzyano", color: "darkred" },
    { name: "Tobias", color: "purple" }
];

let charSelect;

class CharacterSelect {
    constructor() {
        this.p1Index = 0;
        this.p2Index = 1;
        this.locked = { p1: false, p2: false };
        this.gridSize = { cols: 4, rows: 2 };
        this.initUI();
    }

    initUI() {
        const grid = document.getElementById("char-grid");
        grid.innerHTML = "";
        characters.forEach((char, i) => {
            const cell = document.createElement("div");
            cell.className = "char-cell";
            cell.id = `char-${i}`;
            cell.innerText = char.name;
            cell.style.backgroundColor = char.color;
            grid.appendChild(cell);
        });
        this.updateHighlights();
    }

    movePlayer(player, dir) {
        if (this.locked[player]) return;
        
        let index = player === "p1" ? this.p1Index : this.p2Index;
        let row = Math.floor(index / this.gridSize.cols);
        let col = index % this.gridSize.cols;

        if (dir === "up" && row > 0) row--;
        if (dir === "down" && row < this.gridSize.rows - 1) row++;
        if (dir === "left" && col > 0) col--;
        if (dir === "right" && col < this.gridSize.cols - 1) col++;

        const newIndex = row * this.gridSize.cols + col;
        if (player === "p1") this.p1Index = newIndex;
        else this.p2Index = newIndex;

        this.updateHighlights();
    }

    updateHighlights() {
        document.querySelectorAll(".char-cell").forEach(cell => {
            cell.classList.remove("p1-hover", "p2-hover", "p1-locked", "p2-locked");
        });

        const p1Cell = document.getElementById(`char-${this.p1Index}`);
        const p2Cell = document.getElementById(`char-${this.p2Index}`);

        if (this.locked.p1) p1Cell.classList.add("p1-locked");
        else p1Cell.classList.add("p1-hover");

        if (this.locked.p2) p2Cell.classList.add("p2-locked");
        else p2Cell.classList.add("p2-hover");

        document.getElementById("p1-preview").innerText = `P1: ${characters[this.p1Index].name}`;
        document.getElementById("p2-preview").innerText = `P2: ${characters[this.p2Index].name}`;
    }

    confirm(player) {
        this.locked[player] = true;
        this.updateHighlights();
        if (this.locked.p1 && this.locked.p2) {
            setTimeout(() => startCountdown(), 500);
        }
    }
}

function startCharacterSelect() {
    showScreen("character-select");
    charSelect = new CharacterSelect();
}
