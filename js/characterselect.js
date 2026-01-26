const characters = [
    { name: "Malek", color: "black", portrait: "images/favicon.png", folder: "malek" },
    { name: "Valerio", color: "pink", portrait: "images/valerio_portrait.png", folder: "valerio" },
    { name: "Walid", color: "darkblue", portrait: "images/walid_portrait.png", folder: "malek" },
    { name: "Sam", color: "green", portrait: "images/sam_portrait.png", folder: "valerio" },
    { name: "Sultan", color: "orange", portrait: "images/sultan_portrait.png", folder: "malek" },
    { name: "Jop", color: "gray", portrait: "images/jop_portrait.png", folder: "valerio" },
    { name: "Duzyano", color: "darkred", portrait: "images/duzyano_portrait.png", folder: "duzyano" },
    { name: "Tobias", color: "purple", portrait: "images/tobias_portrait.png", folder: "tobias" }
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
            
            const img = document.createElement("img");
            img.src = char.portrait;
            cell.appendChild(img);

            const nameSpan = document.createElement("span");
            nameSpan.innerText = char.name;
            cell.appendChild(nameSpan);

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

        // Update Idle Previews
        const p1Preview = document.getElementById("p1-idle-preview");
        const p2Preview = document.getElementById("p2-idle-preview");
        
        const p1Char = characters[this.p1Index];
        const p2Char = characters[this.p2Index];

        p1Preview.innerHTML = `<img src="assets/characters/${p1Char.folder}/${p1Char.folder}_idle.gif">`;
        p2Preview.innerHTML = `<img src="assets/characters/${p2Char.folder}/${p2Char.folder}_idle.gif">`;
    }

    confirm(player) {
        if (this.locked[player]) return;
        this.locked[player] = true;
        this.updateHighlights();
        
        if (this.locked.p1 && this.locked.p2) {
            playMatchTransition();
        }
    }
}

function startCharacterSelect() {
    showScreen("character-select");
    charSelect = new CharacterSelect();
}
