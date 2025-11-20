import React from 'react';

interface GameOverProps {
    score: number;
    highScore: number;
    timeSurvived: number;
    onRestart: () => void;
    onMainMenu: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({
    score,
    highScore,
    timeSurvived,
    onRestart,
    onMainMenu
}) => {
    const isNewHighScore = score === highScore && score > 0;

    return (
        <div className="game-over-container">
            <div className="game-over-content">
                <h1 className="game-over-title">GAME OVER!</h1>
                
                {isNewHighScore && (
                    <div className="new-high-score">
                        🎉 NEW HIGH SCORE! 🎉
                    </div>
                )}
                
                <div className="stats">
                    <div className="stat-item">
                        <span className="stat-label">Final Score:</span>
                        <span className="stat-value">{score}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Time Survived:</span>
                        <span className="stat-value">{timeSurvived}s</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">High Score:</span>
                        <span className="stat-value">{highScore}</span>
                    </div>
                </div>
                
                <div className="game-over-buttons">
                    <button className="menu-button restart-button" onClick={onRestart}>
                        PLAY AGAIN
                    </button>
                    <button className="menu-button back-button" onClick={onMainMenu}>
                        MAIN MENU
                    </button>
                </div>
            </div>
        </div>
    );
};
