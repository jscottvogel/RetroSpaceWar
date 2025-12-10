import { Entity } from './Entity'

/**
 * Visual particle effect.
 */
export class Particle extends Entity {
    /**
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {number} vx - Velocity X.
     * @param {number} vy - Velocity Y.
     * @param {string} color - CSS color string.
     * @param {number} life - Lifetime in seconds.
     */
    constructor(x, y, vx, vy, color, life) {
        super(x, y)
        this.vx = vx
        this.vy = vy
        this.color = color || '#ffffff'
        this.life = life || 0.5
        this.maxLife = this.life
        this.radius = 1 + Math.random() * 2
    }

    update(dt) {
        super.update(dt)
        this.life -= dt
        if (this.life <= 0) this.isDead = true
        this.radius *= 0.95 // Shrink
    }

    render(ctx) {
        ctx.save()
        ctx.globalAlpha = Math.max(0, this.life / this.maxLife)
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
    }
}
