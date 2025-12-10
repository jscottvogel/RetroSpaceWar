import React from 'react'
import { GameCanvas } from './components/GameCanvas'
import { UIOverlay } from './components/UIOverlay'

function App() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <GameCanvas />
      <UIOverlay />
    </div>
  )
}

export default App
