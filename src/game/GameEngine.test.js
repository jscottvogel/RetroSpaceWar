import { describe, it, expect, vi } from 'vitest'
import { GameEngine } from './GameEngine'

// Mock canvas and context
const mockContext = {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    fillStyle: '',
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
}

const mockCanvas = {
    width: 800,
    height: 600,
    getContext: vi.fn(() => mockContext),
}

describe('GameEngine', () => {
    it('initializes correctly', () => {
        const engine = new GameEngine(mockCanvas)
        expect(engine.entities.length).toBe(0)
        expect(engine.score).toBe(0)
    })

    it('reset spawns entities', () => {
        const engine = new GameEngine(mockCanvas)
        engine.reset()
        // Star, Ship, Enemy
        expect(engine.entities.length).toBe(3)
    })

    it('decrements lives on ship death', () => {
        const engine = new GameEngine(mockCanvas)
        engine.reset()
        engine.ship.isDead = true

        // Mock callbacks
        const onLivesUpdate = vi.fn()
        const onGameOver = vi.fn()
        engine.setOnLivesUpdate(onLivesUpdate)
        engine.setOnGameOver(onGameOver)

        // First death (3 -> 2)
        engine.update(0.1)
        expect(engine.lives).toBe(2)
        expect(onLivesUpdate).toHaveBeenCalledWith(2)
        expect(engine.ship.isDead).toBe(false) // Should respawn

        // Second death (2 -> 1)
        engine.ship.isDead = true
        engine.update(0.1)
        expect(engine.lives).toBe(1)

        // Third death (1 -> 0)
        engine.ship.isDead = true
        engine.update(0.1)
        expect(engine.lives).toBe(0)
        expect(onGameOver).toHaveBeenCalled()
    })
})
