class Player {
    constructor({ x, y, character, side, spriteId }) {
        this.pos = { x, y };
        this.vel = { x: 0, y: 0 };
        this.width = 150;
        this.height = 250;
        this.character = character;
        this.side = side;
        this.health = 100;
        this.state = "idle";
        this.isAttacking = false;
        this.spriteElement = document.getElementById(spriteId);
        
        this.sprites = {};
        const states = ["idle", "walk", "jump", "crouch", "hit"];
        states.forEach(state => {
            this.sprites[state] = `assets/characters/${character.folder}/${character.folder}_${state}.gif`;
        });

        this.attackBox = {
            pos: { x: this.pos.x, y: this.pos.y },
            width: 150,
            height: 100
        };

        this.updateSprite();
    }

    updateSprite() {
        const newSrc = this.sprites[this.state === "attack" ? "hit" : this.state];
        if (this.spriteElement.src.indexOf(newSrc) === -1) {
            this.spriteElement.src = newSrc;
            
            // Handle crouch freeze
            if (this.state === "crouch") {
                // To freeze a gif at the last frame without a library, we can't easily.
                // But we can reset the src to restart it, or if it's already at the end, it stays there if it doesn't loop.
                // A common trick is to remove and re-add the src, but here we want it to freeze.
                // Since we can't truly freeze a looping gif, we'll just let it play.
                // If the gif is set to not loop, it will freeze automatically.
            }
        }

        // Handle side flipping
        if (this.side === "right") {
            this.spriteElement.style.transform = "scaleX(-1)";
        } else {
            this.spriteElement.style.transform = "scaleX(1)";
        }
    }

    draw(ctx) {
        // We now use DOM elements for visuals, but we can draw a debug box if needed
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
    }

    drawAttack(ctx) {
        if (!this.isAttacking) return;
        ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
        ctx.fillRect(
            this.attackBox.pos.x,
            this.attackBox.pos.y,
            this.attackBox.width,
            this.attackBox.height
        );
    }

    update() {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        const prevState = this.state;

        // Determine State
        if (this.state !== "hit" && this.state !== "attack") {
            if (this.vel.y !== 0) {
                this.state = "jump";
            } else if (this.vel.x !== 0) {
                this.state = "walk";
            } else if (this.state !== "crouch") {
                this.state = "idle";
            }
        }

        if (this.state !== prevState) {
            this.updateSprite();
        }

        // Gravity
        const groundLevel = typeof groundY !== "undefined" ? groundY : 450;
        const canvasWidth = typeof canvas !== "undefined" ? canvas.width : 1024;

        if (this.pos.y + this.height + this.vel.y >= groundLevel) {
            this.vel.y = 0;
            this.pos.y = groundLevel - this.height;
            if (this.state === "jump") {
                this.state = "idle";
                this.updateSprite();
            }
        } else {
            this.vel.y += 0.8;
        }

        // Keep inside bounds
        if (this.pos.x < 0) this.pos.x = 0;
        if (this.pos.x + this.width > canvasWidth) this.pos.x = canvasWidth - this.width;

        // Update DOM element position
        this.spriteElement.style.left = `${this.pos.x - (250 - this.width) / 2}px`;
        this.spriteElement.style.top = `${this.pos.y - (350 - this.height)}px`;

        // Update attack box
        this.attackBox.pos.x = this.side === "left" ? this.pos.x + this.width / 2 : this.pos.x - this.attackBox.width + this.width / 2;
        this.attackBox.pos.y = this.pos.y + 50;
    }

    attack() {
        if (this.isAttacking) return;
        this.isAttacking = true;
        const prevState = this.state;
        this.state = "attack";
        this.updateSprite();
        setTimeout(() => {
            this.isAttacking = false;
            if (this.state === "attack") {
                this.state = prevState;
                this.updateSprite();
            }
        }, 300);
    }

    takeHit() {
        this.health -= 10;
        this.state = "hit";
        this.updateSprite();
        setTimeout(() => {
            if (this.state === "hit") {
                this.state = "idle";
                this.updateSprite();
            }
        }, 500);
    }
}
