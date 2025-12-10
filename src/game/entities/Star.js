import { Entity } from './Entity'

export class Star extends Entity {
    constructor(x, y) {
        super(x, y)
        this.radius = 25
        this.gravity = 500000 // Gravitational strength
    }

    render(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)

        // Glow
        const gradient = ctx.createRadialGradient(
            0,
            0,
            this.radius,
            0,
            0,
            this.radius * 4
        )
        gradient.addColorStop(0, 'rgba(255, 200, 0, 0.8)')
        gradient.addColorStop(0.4, 'rgba(255, 100, 0, 0.4)')
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(0, 0, this.radius * 4, 0, Math.PI * 2)
        ctx.fill()

        // Core
        ctx.fillStyle = '#ffaa00'
        ctx.shadowBlur = 30
        ctx.shadowColor = '#ff5500'
        ctx.beginPath()
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
    }
}
