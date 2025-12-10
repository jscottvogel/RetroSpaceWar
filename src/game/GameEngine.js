import { Ship } from './entities/Ship'
import { Star } from './entities/Star'
import { Enemy } from './entities/Enemy'
import { Projectile } from './entities/Projectile'
import { Particle } from './entities/Particle'
import { sounds } from './SoundManager'

/**
 * Core game engine managing the game loop, entities, and state.
 */
export class GameEngine {
    /**
     * @param {HTMLCanvasElement} canvas - The canvas element to render to.
     */
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
        this.onGameOver = null
        this.onLivesUpdate = null
        this.paused = false
        this.lives = 3
    }

    setOnScoreUpdate(callback) {
        this.onScoreUpdate = callback
    }

    setOnLivesUpdate(callback) {
        this.onLivesUpdate = callback
    }

    /**
     * Sets the callback function for game over events.
     * @param {function(): void} callback - The function to call when the game ends.
     */
    setOnGameOver(callback) {
        this.onGameOver = callback
    }

    /**
     * Start the game loop.
     */
    start() {
        this.isRunning = true
        this.paused = false
        this.lastTime = 0
        this.reset()
        requestAnimationFrame(this.loop.bind(this))
    }

    /**
     * Reset the game state, respawning ship and enemies.
     */
    reset() {
        const { width, height } = this.canvas
        this.score = 0
        this.lives = 3
        if (this.onScoreUpdate) this.onScoreUpdate(0)
        if (this.onLivesUpdate) this.onLivesUpdate(3)

        // Spawn Entities
        this.star = new Star(width / 2, height / 2)
        this.ship = new Ship(width / 2, height / 2 - 250)
        this.ship.vx = 200

        this.entities = [this.star, this.ship]

        // Initial Enemy
        const enemy = new Enemy(width / 2, height / 2 + 250)
        enemy.vx = -200
        this.entities.push(enemy)
    }

    /**
     * Stop the game loop.
     */
    stop() {
        this.isRunning = false
    }

    /**
     * Set the pause state.
     * @param {boolean} val - True to pause, false to resume.
     */
    setPaused(val) {
        this.paused = val
        if (!val) {
            this.lastTime = 0 // Reset time on resume to avoid jump
        }
    }

    /**
     * Main game loop.
     * @param {number} timestamp - Current time from requestAnimationFrame.
     */
    loop(timestamp) {
        if (!this.isRunning) return

        if (this.paused) {
            this.lastTime = 0
            requestAnimationFrame(this.loop.bind(this))
            return
        }

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

    /**
     * Update all game entities.
     * @param {number} dt - Delta time in seconds.
     */
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
                        sounds.playExplosion()

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

        // Check for Ship Death / Game Over
        if (this.ship.isDead) {
            this.lives -= 1
            if (this.onLivesUpdate) this.onLivesUpdate(this.lives)

            if (this.lives > 0) {
                // Respawn Logic
                this.ship.isDead = false
                this.ship.x = width / 2
                this.ship.y = height / 2 - 250
                this.ship.vx = 200
                this.ship.vy = 0
                this.ship.angle = 0
                // Brief invulnerability or push enemies away?
                // For now just basic reset.
            } else {
                if (this.onGameOver) this.onGameOver()
            }
        }
    }

    /**
     * Render the game state to the canvas.
     */
    render() {
        const { width, height } = this.canvas
        this.ctx.clearRect(0, 0, width, height)
        this.ctx.fillStyle = '#050510'
        this.ctx.fillRect(0, 0, width, height)
        this.entities.forEach((e) => e.render(this.ctx))
    }
}
