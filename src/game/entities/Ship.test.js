import { describe, it, expect } from 'vitest'
import { Ship } from './Ship'
import { InputHandler } from '../Input'

// Mock input handler access
// Since Ship imports `input` singleton, we might need to mock that module or 
// refactor Ship to accept input as dependency. 
// For now, let's see if we can just control the input singleton import?
// Actually refactoring injection is cleaner, but let's try to mock the module first if possible
// or just modify the imported singleton instance? This is common JS pattern.

describe('Ship Entity', () => {
    it('initializes with correct defaults', () => {
        const ship = new Ship(100, 200)
        expect(ship.x).toBe(100)
        expect(ship.y).toBe(200)
        expect(ship.radius).toBe(15)
        expect(ship.vx).toBe(0)
        expect(ship.vy).toBe(0)
    })
})
