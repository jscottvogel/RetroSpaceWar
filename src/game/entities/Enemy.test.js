import { describe, it, expect } from 'vitest'
import { Enemy } from './Enemy'
import { Star } from './Star'

describe('Enemy AI', () => {
    it('steers away from star when close', () => {
        const star = new Star(400, 300)
        // Enemy placed to the right of star, moving left towards it
        const enemy = new Enemy(450, 300)
        enemy.vx = -100
        enemy.vy = 0

        const context = { ship: { x: 800, y: 300, vx: 0, vy: 0, isDead: false }, star }
        const dt = 0.1

        enemy.update(dt, { width: 800, height: 600 }, null, context)

        // If avoidance works, vx should increase (being pushed right, away from star)
        // Original vx was -100.
        // It's close to star (dist 50), star radius 25.
        // It should steer away.

        expect(enemy.vx).toBeGreaterThan(-100)
    })
})
