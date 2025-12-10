/**
 * Handles keyboard input state.
 */
export class InputHandler {
    constructor() {
        this.keys = new Set()
        this.init()
    }

    init() {
        window.addEventListener('keydown', (e) => this.keys.add(e.code))
        window.addEventListener('keyup', (e) => this.keys.delete(e.code))
    }

    isDown(code) {
        return this.keys.has(code)
    }

    get axis() {
        const x =
            (this.keys.has('ArrowRight') || this.keys.has('KeyD') ? 1 : 0) -
            (this.keys.has('ArrowLeft') || this.keys.has('KeyA') ? 1 : 0)
        const y =
            (this.keys.has('ArrowDown') || this.keys.has('KeyS') ? 1 : 0) -
            (this.keys.has('ArrowUp') || this.keys.has('KeyW') ? 1 : 0)
        return { x, y }
    }

    destroy() {
        window.removeEventListener('keydown')
        window.removeEventListener('keyup')
    }
}

export const input = new InputHandler()
