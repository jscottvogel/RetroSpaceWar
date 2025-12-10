import { input } from './Input'
import { Ship } from './entities/Ship'
import { Star } from './entities/Star'
import { Enemy } from './entities/Enemy'
import { Projectile } from './entities/Projectile'
import { Particle } from './entities/Particle'

export class GameEngine {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.lastTime = 0
        this.isRunning = false
        this.entities = []
        this.star = null
        this.ship = null
        this.score = 0
        this.onScoreUpdate = null
    }

    setOnScoreUpdate(callback) {
        this.onScoreUpdate = callback
    }

    start() {
        this.isRunning = true
        this.lastTime = 0

        const { width, height } = this.canvas

        // Spawn Entities
        this.star = new Star(width / 2, height / 2)
        this.ship = new Ship(width / 2, height / 2 - 250)
        // Orbital velocity hint
        this.ship.vx = 200

        this.entities = [this.star, this.ship]

        // Spawn initial enemy
        const enemy = new Enemy(width / 2, height / 2 + 250)
        enemy.vx = -200
        this.entities.push(enemy)

        requestAnimationFrame(this.loop.bind(this))
    }

    stop() {
        this.isRunning = false
    }

    loop(timestamp) {
        if (!this.isRunning) return

        if (this.lastTime === 0) {
            this.lastTime = timestamp
        }

        const dt = (timestamp - this.lastTime) / 1000
        this.lastTime = timestamp
        const safeDt = Math.min(dt, 0.1)

        this.update(safeDt)
        this.render()

        requestAnimationFrame(this.loop.bind(this))
    }

    update(dt) {
        const { width, height } = this.canvas
        const bounds = { width, height }
        const spawnList = []
        const spawn = (e) => spawnList.push(e)
        const context = { ship: this.ship, star: this.star }

        // Physics & Logic
        this.entities.forEach((entity) => {
            if (entity.isDead) return

            // Gravity (Star)
            if (entity !== this.star && !(entity instanceof Particle)) {
                // Particles ignore gravity for performance/visual preference? Or keep it?
                // Let's let them ignore it for cleaner explosions
                const dx = this.star.x - entity.x
                const dy = this.star.y - entity.y
                const distSq = dx * dx + dy * dy
                const dist = Math.sqrt(distSq)

                if (dist > this.star.radius + entity.radius) {
                    const force = this.star.gravity / distSq
                    entity.vx += (dx / dist) * force * dt
                    entity.vy += (dy / dist) * force * dt
                } else {
                    entity.isDead = true
                }
            }

            if (entity instanceof Enemy || entity instanceof Ship) {
                entity.update(dt, bounds, spawn, context)
            } else {
                entity.update(dt, bounds, spawn, context)
            }
        })

        // Collision Detection
        for (let i = 0; i < this.entities.length; i++) {
            const a = this.entities[i]
            if (a.isDead) continue

            if (a instanceof Projectile) {
                for (let j = 0; j < this.entities.length; j++) {
                    const b = this.entities[j]
                    if (a === b || b.isDead) continue
                    if (b instanceof Projectile || b instanceof Star || b instanceof Particle) continue

                    // Friendly fire check
                    if (a.owner === 'player' && b instanceof Ship) continue
                    if (a.owner === 'enemy' && b instanceof Enemy) continue

                    // Hit check
                    const dx = a.x - b.x
                    const dy = a.y - b.y
                    const dist = Math.sqrt(dx * dx + dy * dy)

                    if (dist < a.radius + b.radius) {
                        a.isDead = true
                        b.isDead = true

                        // Score logic
                        if (b instanceof Enemy && a.owner === 'player') {
                            this.score += 100
                            if (this.onScoreUpdate) this.onScoreUpdate(this.score)
                        }

                        // Explosion
                        for (let k = 0; k < 15; k++) {
                            const angle = Math.random() * Math.PI * 2
                            const speed = 50 + Math.random() * 150
                            spawn(new Particle(
                                (a.x + b.x) / 2,
                                (a.y + b.y) / 2,
                                Math.cos(angle) * speed,
                                Math.sin(angle) * speed,
                                '#ff8800',
                                0.5 + Math.random() * 0.5
                            ))
                        }
                    }
                }
            }
        }

        this.entities.push(...spawnList)
        this.entities = this.entities.filter((e) => !e.isDead)

        // Auto-Respawn Enemy if all dead?
        const hasEnemy = this.entities.some(e => e instanceof Enemy)
        if (!hasEnemy && Math.random() < 0.01) { // 1% chance per frame (~0.6s) to respawn if empty
            const ex = Math.random() * width
            const ey = Math.random() * height
            // Don't spawn too close to player
            const dx = ex - this.ship.x
            const dy = ey - this.ship.y
            if (dx * dx + dy * dy > 40000) {
                const enemy = new Enemy(ex, ey)
                this.entities.push(enemy)
            }
        }
    }

    render() {
        const { width, height } = this.canvas
        this.ctx.clearRect(0, 0, width, height)
        this.ctx.fillStyle = '#050510'
        this.ctx.fillRect(0, 0, width, height)
        this.entities.forEach((e) => e.render(this.ctx))
    }
}
