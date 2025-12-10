import React, { useEffect, useRef } from 'react'
import { GameEngine } from '../game/GameEngine'

export const GameCanvas = ({ onScoreUpdate, onGameOver, paused, resetTrigger }) => {
    const canvasRef = useRef(null)
    const engineRef = useRef(null)

    // Initial Setup
    useEffect(() => {
        if (!canvasRef.current) return

        const canvas = canvasRef.current
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const engine = new GameEngine(canvas)
        engine.setOnScoreUpdate(onScoreUpdate)
        engine.setOnGameOver(onGameOver)
        engineRef.current = engine
        engine.start()

        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        window.addEventListener('resize', handleResize)

        return () => {
            engine.stop()
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    // Handle Paused
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.setPaused(paused)
        }
    }, [paused])

    // Handle Reset
    useEffect(() => {
        if (engineRef.current && resetTrigger > 0) {
            engineRef.current.reset()
            engineRef.current.start() // Ensure start
        }
    }, [resetTrigger])

    return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
}
