export class Entity {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.vx = 0
        this.vy = 0
        this.angle = 0
        this.radius = 10
        this.isDead = false
    }

    update(dt) {
        this.x += this.vx * dt
        this.y += this.vy * dt
    }

    render(ctx) {
        // Override
    }
}
