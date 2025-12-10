import React, { useState, useCallback } from 'react'
import { GameCanvas } from './components/GameCanvas'
import { UIOverlay } from './components/UIOverlay'

function App() {
  const [score, setScore] = useState(0)

  // Use callback to avoid re-renders of GameCanvas if not needed, 
  // though GameCanvas useEffect dependency array is empty so it won't re-init engine anyway.
  // But good practice.
  const handleScoreUpdate = useCallback((newScore) => {
    setScore(newScore)
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <GameCanvas onScoreUpdate={handleScoreUpdate} />
      <UIOverlay score={score} />
    </div>
  )
}

export default App
