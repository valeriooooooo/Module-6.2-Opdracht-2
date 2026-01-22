class Player {
    constructor({ x, y, color, side }) {
        this.pos = { x, y };
        this.vel = { x: 0, y: 0 };
        this.width = 50;
        this.height = 150;
        this.color = color;
        this.side = side;
        this.health = 100;
        this.state = "idle"; // idle, crouch, jump, hit, attack
        this.isAttacking = false;
        
        this.attackBox = {
            pos: { x: this.pos.x, y: this.pos.y },
            width: 100,
            height: 50
        };
    }

    draw(ctx) {
        // Body
        ctx.fillStyle = this.color;
        let drawHeight = this.state === "crouch" ? this.height / 2 : this.height;
        let drawY = this.state === "crouch" ? this.pos.y + this.height / 2 : this.pos.y;
        
        ctx.fillRect(this.pos.x, drawY, this.width, drawHeight);

        // Attack box visualization (optional, for debugging)
        if (this.isAttacking) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
            ctx.fillRect(
                this.attackBox.pos.x,
                this.attackBox.pos.y,
                this.attackBox.width,
                this.attackBox.height
            );
        }
    }

    update() {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        // Gravity
        const groundLevel = typeof groundY !== "undefined" ? groundY : 450;
        const canvasWidth = typeof canvas !== "undefined" ? canvas.width : 1024;

        if (this.pos.y + this.height + this.vel.y >= groundLevel) {
            this.vel.y = 0;
            this.pos.y = groundLevel - this.height;
            if (this.state === "jump") this.state = "idle";
        } else {
            this.vel.y += 0.8; // gravity force
        }

        // Keep player inside the arena bounds
        if (this.pos.x < 0) this.pos.x = 0;
        if (this.pos.x + this.width > canvasWidth) this.pos.x = canvasWidth - this.width;
        if (this.pos.y < 0) this.pos.y = 0;

        // Update attack box position
        this.attackBox.pos.x = this.side === "left" ? this.pos.x + this.width : this.pos.x - this.attackBox.width;
        this.attackBox.pos.y = this.pos.y + 30;
    }

    attack() {
        if (this.isAttacking) return;
        this.isAttacking = true;
        this.state = "attack";
        setTimeout(() => {
            this.isAttacking = false;
            this.state = "idle";
        }, 150);
    }

    takeHit() {
        this.health -= 10;
        this.state = "hit";
        setTimeout(() => {
            if (this.state === "hit") this.state = "idle";
        }, 200);
    }
}
