/**
 * Base class for all game objects.
 */
export class Entity {
    /**
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     */
    constructor(x, y) {
        this.x = x
        this.y = y
        this.vx = 0
        this.vy = 0
        this.angle = 0
        this.radius = 0
        this.isDead = false
    }

    /**
     * Update the entity's position based on velocity.
     * @param {number} dt - Delta time.
     */
    update(dt) {
        this.x += this.vx * dt
        this.y += this.vy * dt
    }

    /**
     * Render the entity.
   */
    render() {
        // Override me
    }
}
