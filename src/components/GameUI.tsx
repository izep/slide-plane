import React, { useEffect, useState } from 'react';
import { EventBus, Events } from '../utils/EventBus';
import { PowerUpType } from '../types/GameTypes';

interface GameUIProps {
    isPlaying: boolean;
    distance?: number;
    timeUntilPowerUp?: number;
}

export const GameUI: React.FC<GameUIProps> = ({ isPlaying, distance = 0, timeUntilPowerUp = 0 }) => {
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [currentPowerUp, setCurrentPowerUp] = useState<PowerUpType | null>(null);

    useEffect(() => {
        const handleScoreUpdate = (data: any) => {
            setScore(data.score);
        };

        const handleLivesUpdate = (data: any) => {
            setLives(data.lives);
        };

        const handlePowerUpCollected = (data: any) => {
            setCurrentPowerUp(data.type);
        };

        const handlePowerUpExpired = () => {
            setCurrentPowerUp(null);
        };

        const handleGameStart = () => {
            setScore(0);
            setLives(3);
            setCurrentPowerUp(null);
        };

        EventBus.on(Events.SCORE_UPDATE, handleScoreUpdate);
        EventBus.on(Events.LIVES_UPDATE, handleLivesUpdate);
        EventBus.on(Events.POWERUP_COLLECTED, handlePowerUpCollected);
        EventBus.on(Events.POWERUP_EXPIRED, handlePowerUpExpired);
        EventBus.on(Events.GAME_START, handleGameStart);

        return () => {
            EventBus.off(Events.SCORE_UPDATE, handleScoreUpdate);
            EventBus.off(Events.LIVES_UPDATE, handleLivesUpdate);
            EventBus.off(Events.POWERUP_COLLECTED, handlePowerUpCollected);
            EventBus.off(Events.POWERUP_EXPIRED, handlePowerUpExpired);
            EventBus.off(Events.GAME_START, handleGameStart);
        };
    }, []);

    if (!isPlaying) return null;

    const getPowerUpDisplay = () => {
        switch (currentPowerUp) {
            case PowerUpType.BULLET: return '🟡 Bullets';
            case PowerUpType.ROCKET: return '🟠 Rockets';
            case PowerUpType.LASER: return '🟢 Laser';
            default: return null;
        }
    };

    return (
        <div className="game-ui">
            <div className="hud-top">
                <div className="hud-item">
                    <span className="hud-label">Score:</span>
                    <span className="hud-value">{score}</span>
                </div>
                <div className="hud-item">
                    <span className="hud-label">Distance:</span>
                    <span className="hud-value">{Math.floor(distance)}m</span>
                </div>
                <div className="hud-item">
                    <span className="hud-label">Lives:</span>
                    <span className="hud-value">{'❤️'.repeat(lives)}</span>
                </div>
            </div>
            
            <div className="hud-bottom">
                <div className="hud-item-small">
                    <span className="hud-label-small">Next Power-up:</span>
                    <span className="hud-value-small">{Math.ceil(timeUntilPowerUp / 1000)}s</span>
                </div>
            </div>
            
            {currentPowerUp && (
                <div className="powerup-indicator">
                    <span className="powerup-label">Active:</span>
                    <span className="powerup-name">{getPowerUpDisplay()}</span>
                </div>
            )}
        </div>
    );
};
