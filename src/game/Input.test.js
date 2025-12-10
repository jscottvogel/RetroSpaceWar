import { describe, it, expect } from 'vitest'
import { InputHandler } from './Input'

describe('InputHandler', () => {
    it('tracks key down and up events', () => {
        const input = new InputHandler()

        // Simulate KeyDown
        const downEvent = new KeyboardEvent('keydown', { code: 'Space' })
        window.dispatchEvent(downEvent)

        expect(input.isDown('Space')).toBe(true)

        // Simulate KeyUp
        const upEvent = new KeyboardEvent('keyup', { code: 'Space' })
        window.dispatchEvent(upEvent)

        expect(input.isDown('Space')).toBe(false)
    })
})
