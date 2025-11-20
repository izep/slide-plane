import React from 'react';
import { StorageManager } from '../utils/StorageManager';

interface MainMenuProps {
    onStartGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
    const highScore = StorageManager.getHighScore();

    return (
        <div className="menu-container">
            <div className="menu-content">
                <h1 className="game-title">✈️ SLIDE PLANE</h1>
                <p className="game-subtitle">Dodge obstacles, collect power-ups, survive!</p>
                
                <button className="menu-button start-button" onClick={onStartGame}>
                    START GAME
                </button>
                
                {highScore > 0 && (
                    <div className="high-score">
                        <p>High Score: <strong>{highScore}</strong></p>
                    </div>
                )}
                
                <div className="instructions">
                    <h3>How to Play</h3>
                    <p><strong>Desktop:</strong> Move mouse up/down to control airplane</p>
                    <p><strong>Mobile:</strong> Tap/swipe up/down to control airplane</p>
                    <p><strong>Goal:</strong> Avoid red obstacles, collect power-ups, survive as long as possible!</p>
                    <p><strong>Power-ups:</strong></p>
                    <ul>
                        <li>🟡 Yellow - Bullets</li>
                        <li>🟠 Orange - Rockets</li>
                        <li>🟢 Green - Laser</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
