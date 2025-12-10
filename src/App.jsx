import React, { useState, useCallback } from 'react'
import { GameCanvas } from './components/GameCanvas'
import { UIOverlay } from './components/UIOverlay'

function App() {
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameState, setGameState] = useState('MENU') // MENU, PLAYING, PAUSED, GAMEOVER
  const [resetTrigger, setResetTrigger] = useState(0)

  const handleScoreUpdate = useCallback((newScore) => {
    setScore(newScore)
  }, [])

  const handleLivesUpdate = useCallback((newLives) => {
    setLives(newLives)
  }, [])

  const handleGameOver = useCallback(() => {
    setGameState('GAMEOVER')
  }, [])

  const handleStart = () => {
    setGameState('PLAYING')
    setResetTrigger(prev => prev + 1)
  }

  const handleResume = () => {
    setGameState('PLAYING')
  }

  const handleRestart = () => {
    setGameState('PLAYING')
    setResetTrigger(prev => prev + 1)
  }

  // Keyboard Pause
  React.useEffect(() => {
    const handleDown = (e) => {
      if (e.code === 'Escape') {
        if (gameState === 'PLAYING') setGameState('PAUSED')
        else if (gameState === 'PAUSED') setGameState('PLAYING')
      }
    }
    window.addEventListener('keydown', handleDown)
    return () => window.removeEventListener('keydown', handleDown)
  }, [gameState])

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <GameCanvas
        onScoreUpdate={handleScoreUpdate}
        onLivesUpdate={handleLivesUpdate}
        onGameOver={handleGameOver}
        paused={gameState !== 'PLAYING'}
        resetTrigger={resetTrigger}
      />
      <UIOverlay
        score={score}
        lives={lives}
        gameState={gameState}
        onStart={handleStart}
        onResume={handleResume}
        onRestart={handleRestart}
      />
    </div>
  )
}

export default App
