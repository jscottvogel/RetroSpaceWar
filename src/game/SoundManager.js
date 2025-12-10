/**
 * Manages Web Audio API context and synthesized sound effects.
 */
export class SoundManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)()
        this.thrustOsc = null
        this.thrustGain = null
        this.initialized = false
    }

    ensureContext() {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume()
        }
    }

    playShoot() {
        this.ensureContext()
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = 'square'
        osc.frequency.setValueAtTime(880, this.ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.1)

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start()
        osc.stop(this.ctx.currentTime + 0.1)
    }

    playExplosion() {
        this.ensureContext()
        const bufferSize = this.ctx.sampleRate * 0.5 // 0.5 seconds
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
        const data = buffer.getChannelData(0)

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1
        }

        const noise = this.ctx.createBufferSource()
        noise.buffer = buffer

        const filter = this.ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(1000, this.ctx.currentTime)
        filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.4)

        const gain = this.ctx.createGain()
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5)

        noise.connect(filter)
        filter.connect(gain)
        gain.connect(this.ctx.destination)

        noise.start()
    }

    startThrust() {
        this.ensureContext()
        if (this.thrustOsc) return // Already playing

        // Create Noise
        const bufferSize = this.ctx.sampleRate * 2
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1
        }

        const noise = this.ctx.createBufferSource()
        noise.buffer = buffer
        noise.loop = true

        // Filter
        const filter = this.ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.value = 400

        // Gain
        const gain = this.ctx.createGain()
        gain.gain.value = 0.2

        noise.connect(filter)
        filter.connect(gain)
        gain.connect(this.ctx.destination)

        noise.start()
        this.thrustOsc = noise
        this.thrustGain = gain
    }

    stopThrust() {
        if (this.thrustOsc) {
            // Fade out
            this.thrustGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1)
            this.thrustOsc.stop(this.ctx.currentTime + 0.2)
            this.thrustOsc = null
            this.thrustGain = null
        }
    }

    stopAll() {
        this.stopThrust()
        // Stop any other loops if added in future
    }
}

export const sounds = new SoundManager()
