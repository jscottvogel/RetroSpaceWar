import { vi } from 'vitest'

// Mock Web Audio API
window.AudioContext = class {
    constructor() {
        this.currentTime = 0
        this.state = 'running'
        this.sampleRate = 44100
    }
    createOscillator() {
        return {
            connect: vi.fn(),
            start: vi.fn(),
            stop: vi.fn(),
            frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
            type: 'sine'
        }
    }
    createGain() {
        return {
            connect: vi.fn(),
            gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), value: 0, setTargetAtTime: vi.fn() }
        }
    }
    createBuffer() {
        return {
            getChannelData: vi.fn(() => new Float32Array(100))
        }
    }
    createBufferSource() {
        return {
            connect: vi.fn(),
            start: vi.fn(),
            stop: vi.fn(),
            buffer: null,
            loop: false
        }
    }
    createBiquadFilter() {
        return {
            connect: vi.fn(),
            frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), value: 0 },
            type: 'lowpass'
        }
    }
    resume() { return Promise.resolve() }
}
window.webkitAudioContext = window.AudioContext
