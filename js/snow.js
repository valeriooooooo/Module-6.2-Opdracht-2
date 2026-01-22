// Snow effect for the game background
class Snowflake {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight - canvasHeight;
        this.radius = Math.random() * 3 + 1; // 1-4px
        this.speed = Math.random() * 1 + 0.5; // 0.5-1.5 pixels per frame
        this.drift = Math.random() * 0.5 - 0.25; // -0.25 to 0.25 horizontal movement
        this.opacity = Math.random() * 0.6 + 0.4; // 0.4-1.0 opacity
    }

    update(canvasHeight) {
        this.y += this.speed;
        this.x += this.drift;
        
        // Reset snowflake to top when it goes off screen
        if (this.y > canvasHeight) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
        }
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class SnowEffect {
    constructor(canvas, numberOfFlakes = 100) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.snowflakes = [];
        this.active = false;
        
        // Create snowflakes
        for (let i = 0; i < numberOfFlakes; i++) {
            this.snowflakes.push(new Snowflake(canvas.width, canvas.height));
        }
    }

    start() {
        this.active = true;
    }

    stop() {
        this.active = false;
    }

    update() {
        if (!this.active) return;
        
        for (let snowflake of this.snowflakes) {
            snowflake.update(this.canvas.height);
        }
    }

    draw() {
        if (!this.active) return;
        
        for (let snowflake of this.snowflakes) {
            snowflake.draw(this.ctx);
        }
    }
}
