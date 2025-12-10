import { Entity } from './Entity'

export class Projectile extends Entity {
    constructor(x, y, angle, owner) {
        super(x, y)
        this.owner = owner // 'player' | 'enemy'
        this.radius = 2
        this.speed = 500
        this.vx = Math.cos(angle) * this.speed
        this.vy = Math.sin(angle) * this.speed
        this.life = 1.5 // Seconds to live
    }

    update(dt) {
        super.update(dt)
        this.life -= dt
        if (this.life <= 0) this.isDead = true
    }

    render(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)

        // Color based on owner
        ctx.fillStyle = this.owner === 'player' ? '#00f3ff' : '#ff0000'
        ctx.shadowBlur = 10
        ctx.shadowColor = ctx.fillStyle

        ctx.beginPath()
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
    }
}
