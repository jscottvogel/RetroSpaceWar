import { Entity } from './Entity'
import { Projectile } from './Projectile'

/**
 * Enemy AI Ship.
 * Tracks the player and fires projectiles.
 */
export class Enemy extends Entity {
    /**
     * @param {number} x - Initial X coordinate.
     * @param {number} y - Initial Y coordinate.
     */
    constructor(x, y) {
        super(x, y)
        this.radius = 15
        this.speed = 150
        this.cooldown = 0
    }

    update(dt, bounds, spawn, context) {
        const { ship, star } = context
        if (ship && !ship.isDead) {
            // --- 1. Predictive Aiming ---
            // Calculate time to hit target approx
            const dx = ship.x - this.x
            const dy = ship.y - this.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            const projectileSpeed = 400 // Matches Ship's projectile speed (approx)
            const timeToHit = dist / projectileSpeed

            // Predict target position
            const futureX = ship.x + ship.vx * timeToHit
            const futureY = ship.y + ship.vy * timeToHit

            const aimDx = futureX - this.x
            const aimDy = futureY - this.y
            const targetAngle = Math.atan2(aimDy, aimDx)

            // --- 2. Movement & Avoidance ---
            // Base vector towards player
            let moveDx = dx / dist
            let moveDy = dy / dist

            // Avoid Star
            if (star) {
                const sdx = this.x - star.x
                const sdy = this.y - star.y
                const sDistSq = sdx * sdx + sdy * sdy
                const sDist = Math.sqrt(sDistSq)
                const urgency = 200 // Radius to start panicking

                if (sDist < star.radius + urgency) {
                    // Strong force away from star
                    const avoidanceStrength = (1 - (sDist / (star.radius + urgency))) * 2.5
                    moveDx += (sdx / sDist) * avoidanceStrength
                    moveDy += (sdy / sDist) * avoidanceStrength
                }
            }

            // Normalizing move vector
            const moveLen = Math.sqrt(moveDx * moveDx + moveDy * moveDy)
            if (moveLen > 0) {
                moveDx /= moveLen
                moveDy /= moveLen
            }

            // Strafe behavior: If reasonably close, move perpendicular to target
            if (dist < 400 && dist > 150) {
                // Perpendicular vector (-dy, dx)
                moveDx += -dy / dist
                moveDy += dx / dist
                // Re-normalize implies circling
            }

            // Re-normalize final desired direction
            const finalLen = Math.sqrt(moveDx * moveDx + moveDy * moveDy)
            const targetVx = (moveDx / finalLen) * this.speed
            const targetVy = (moveDy / finalLen) * this.speed

            // Apply steering force (accelerate towards target velocity)
            const steerFactor = 2.0 * dt
            this.vx += (targetVx - this.vx) * steerFactor
            this.vy += (targetVy - this.vy) * steerFactor

            // --- 3. Rotation ---
            // Lerp angle for smoothness
            let diff = targetAngle - this.angle
            while (diff < -Math.PI) diff += Math.PI * 2
            while (diff > Math.PI) diff -= Math.PI * 2
            this.angle += diff * 5 * dt

            // --- 4. Firing ---
            if (this.cooldown > 0) this.cooldown -= dt
            // Only fire if vaguely pointing at target
            if (dist < 600 && this.cooldown <= 0 && Math.abs(diff) < 0.5) {
                if (spawn) {
                    spawn(new Projectile(this.x, this.y, this.angle, 'enemy'))
                    this.cooldown = 0.8 + Math.random() * 0.5 // Faster fire rate
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
