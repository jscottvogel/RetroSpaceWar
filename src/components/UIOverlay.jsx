import React from 'react'

export const UIOverlay = () => {
    return (
        <div
            className="ui-overlay"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                padding: '20px',
                pointerEvents: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                color: '#fff',
                textShadow: '0 0 10px #00f3ff',
            }}
        >
            <div>
                <h1 style={{ margin: 0, fontSize: '24px' }}>RETRO SPACE WAR</h1>
                <div id="score">SCORE: 000</div>
            </div>
            <div id="status">
                HULL: 100%
            </div>
        </div>
    )
}
