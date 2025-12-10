import React, { useEffect, useRef } from 'react'
import { GameEngine } from '../game/GameEngine'

export const GameCanvas = ({ onScoreUpdate }) => {
    const canvasRef = useRef(null)
    const engineRef = useRef(null)

    useEffect(() => {
        if (!canvasRef.current) return

        const canvas = canvasRef.current
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const engine = new GameEngine(canvas)
        engine.setOnScoreUpdate(onScoreUpdate)
        engineRef.current = engine
        engine.start()

        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            // engine.resize() // Future proofing
        }

        window.addEventListener('resize', handleResize)

        return () => {
            engine.stop()
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
}
