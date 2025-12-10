import { Entity } from './Entity'
import { input } from '../Input'
import { Projectile } from './Projectile'
import { Particle } from './Particle'
import { sounds } from '../SoundManager'

/**
 * Player Ship entity.
 * Handles inputs, movement, and firing.
 */
export class Ship extends Entity {
    /**
     * @param {number} x - Initial X coordinate.
     * @param {number} y - Initial Y coordinate.
     */
    constructor(x, y) {
        super(x, y)
        this.radius = 15
        this.thrust = 200
        this.rotationSpeed = 4
        this.dampening = 0.99
        this.cooldown = 0
    }

    update(dt, bounds, spawn) {
        // Rotation
        if (input.isDown('ArrowLeft') || input.isDown('KeyA')) {
            this.angle -= this.rotationSpeed * dt
        }
        if (input.isDown('ArrowRight') || input.isDown('KeyD')) {
            this.angle += this.rotationSpeed * dt
        }

        // Thrust
        if (input.isDown('ArrowUp') || input.isDown('KeyW')) {
            this.vx += Math.cos(this.angle) * this.thrust * dt
            this.vy += Math.sin(this.angle) * this.thrust * dt
            sounds.startThrust()

            // Thruster Particles
            if (spawn && Math.random() < 0.5) {
                const pAngle = this.angle + Math.PI + (Math.random() - 0.5) * 0.5
                const speed = 150
                spawn(new Particle(
                    this.x - Math.cos(this.angle) * 10,
                    this.y - Math.sin(this.angle) * 10,
                    Math.cos(pAngle) * speed + this.vx,
                    Math.sin(pAngle) * speed + this.vy,
                    '#00f3ff',
                    0.3
                ))
            }
        } else {
            sounds.stopThrust()
        }

        super.update(dt)

        // Screen wrapping
        if (bounds) {
            if (this.x < 0) this.x += bounds.width
            if (this.x > bounds.width) this.x -= bounds.width
            if (this.y < 0) this.y += bounds.height
            if (this.y > bounds.height) this.y -= bounds.height
        }

        // Firing
        if (this.cooldown > 0) this.cooldown -= dt
        if (input.isDown('Space') && this.cooldown <= 0) {
            if (spawn) {
                // Offset nose
                const noseX = this.x + Math.cos(this.angle) * 10
                const noseY = this.y + Math.sin(this.angle) * 10
                spawn(new Projectile(noseX, noseY, this.angle, 'player'))
                sounds.playShoot()

                // Recoil
                this.vx -= Math.cos(this.angle) * 10
                this.vy -= Math.sin(this.angle) * 10

                this.cooldown = 0.25
            }
        }
    }

    render(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)

        ctx.strokeStyle = '#00f3ff'
        ctx.lineWidth = 2
        ctx.shadowBlur = 10
        ctx.shadowColor = '#00f3ff'

        ctx.beginPath()
        ctx.moveTo(10, 0)
        ctx.lineTo(-10, 7)
        ctx.lineTo(-5, 0)
        ctx.lineTo(-10, -7)
        ctx.closePath()
        ctx.stroke()

        // Main Engine Glow (visual)
        if (input.isDown('ArrowUp') || input.isDown('KeyW')) {
            ctx.strokeStyle = '#ff00ff'
            ctx.shadowColor = '#ff00ff'
            ctx.beginPath()
            ctx.moveTo(-6, 0)
            ctx.lineTo(-20, 0)
            ctx.stroke()
        }

        ctx.restore()
    }
}
