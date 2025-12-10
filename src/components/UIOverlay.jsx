import React from 'react'

export const UIOverlay = ({ score, gameState, onStart, onResume, onRestart }) => {
    return (
        <div
            className="ui-overlay"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none', // Allow clicks to go through if needed, but we need pointer events for buttons
            }}
        >
            {/* HUD */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                color: '#fff',
                textShadow: '0 0 10px #00f3ff',
                pointerEvents: 'none'
            }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '24px' }}>RETRO SPACE WAR</h1>
                    <div id="score">SCORE: {score.toString().padStart(6, '0')}</div>
                </div>
                <div id="status">HULL: 100%</div>
            </div>

            {/* Menus */}
            {gameState !== 'PLAYING' && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'auto',
                    color: '#fff',
                    fontFamily: 'Orbitron, sans-serif'
                }}>
                    {gameState === 'MENU' && (
                        <>
                            <h1 style={{ fontSize: '4rem', color: '#00f3ff', textShadow: '0 0 20px #00f3ff', marginBottom: '20px' }}>SPACE WAR</h1>
                            <button onClick={onStart} style={buttonStyle}>START GAME</button>
                        </>
                    )}
                    {gameState === 'PAUSED' && (
                        <>
                            <h1 style={{ fontSize: '3rem', color: '#ffaa00' }}>PAUSED</h1>
                            <button onClick={onResume} style={buttonStyle}>RESUME</button>
                            <button onClick={onRestart} style={buttonStyle}>RESTART</button>
                        </>
                    )}
                    {gameState === 'GAMEOVER' && (
                        <>
                            <h1 style={{ fontSize: '4rem', color: '#ff0000', textShadow: '0 0 20px #ff0000' }}>GAME OVER</h1>
                            <div style={{ fontSize: '2rem', marginBottom: '20px' }}>FINAL SCORE: {score}</div>
                            <button onClick={onRestart} style={buttonStyle}>PLAY AGAIN</button>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

const buttonStyle = {
    background: 'transparent',
    border: '2px solid #fff',
    color: '#fff',
    padding: '15px 30px',
    fontSize: '1.5rem',
    fontFamily: 'Orbitron, sans-serif',
    cursor: 'pointer',
    margin: '10px',
    textShadow: '0 0 10px #fff',
    boxShadow: '0 0 10px rgba(255,255,255,0.2)',
    transition: 'all 0.2s',
}
