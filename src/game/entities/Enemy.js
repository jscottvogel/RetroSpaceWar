import { Entity } from './Entity'
import { Projectile } from './Projectile'

export class Enemy extends Entity {
    constructor(x, y) {
        super(x, y)
        this.radius = 15
        this.speed = 100
        this.cooldown = 0
    }

    update(dt, bounds, spawn, context) {
        const { ship } = context
        if (ship && !ship.isDead) {
            // Aim at ship
            const dx = ship.x - this.x
            const dy = ship.y - this.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            const targetAngle = Math.atan2(dy, dx)

            // Simple rotation towards target
            // Lerp angle for smoothness
            let diff = targetAngle - this.angle
            while (diff < -Math.PI) diff += Math.PI * 2
            while (diff > Math.PI) diff -= Math.PI * 2
            this.angle += diff * 5 * dt // Turn speed

            // AI Movement: Keep distance
            if (dist > 300) {
                this.vx += Math.cos(this.angle) * this.speed * dt
                this.vy += Math.sin(this.angle) * this.speed * dt
            } else if (dist < 150) {
                // Back off
                this.vx -= Math.cos(this.angle) * this.speed * dt
                this.vy -= Math.sin(this.angle) * this.speed * dt
            }

            // Dampening
            this.vx *= 0.95
            this.vy *= 0.95

            // Fire
            if (this.cooldown > 0) this.cooldown -= dt
            if (dist < 500 && this.cooldown <= 0) {
                if (spawn) {
                    spawn(new Projectile(this.x, this.y, this.angle, 'enemy'))
                    this.cooldown = 1.0 + Math.random() // Randomized fire rate
                }
            }
        }

        super.update(dt)

        // Wrap
        if (bounds) {
            if (this.x < 0) this.x += bounds.width
            if (this.x > bounds.width) this.x -= bounds.width
            if (this.y < 0) this.y += bounds.height
            if (this.y > bounds.height) this.y -= bounds.height
        }
    }

    render(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)

        ctx.strokeStyle = '#ff0000'
        ctx.lineWidth = 2
        ctx.shadowBlur = 10
        ctx.shadowColor = '#ff0000'

        ctx.beginPath()
        ctx.moveTo(10, 0)
        ctx.lineTo(-10, 7)
        ctx.lineTo(-5, 0)
        ctx.lineTo(-10, -7)
        ctx.closePath()
        ctx.stroke()

        ctx.restore()
    }
}
