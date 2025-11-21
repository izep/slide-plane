import { useRef, useState, useEffect } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';
import { MainMenu } from './components/MainMenu';
import { GameUI } from './components/GameUI';
import { GameOver } from './components/GameOver';
import { EventBus, Events } from './utils/EventBus';
import { GameScene } from './game/scenes/GameScene';
import './index.css';

enum GameState {
    MAIN_MENU,
    PLAYING,
    GAME_OVER
}

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [gameState, setGameState] = useState<GameState>(GameState.MAIN_MENU);
    const [finalScore, setFinalScore] = useState(0);
    const [finalHighScore, setFinalHighScore] = useState(0);
    const [finalTimeSurvived, setFinalTimeSurvived] = useState(0);
    const [distance, setDistance] = useState(0);
    const [timeUntilPowerUp, setTimeUntilPowerUp] = useState(0);

    useEffect(() => {
        const handleGameOver = (data: any) => {
            setFinalScore(data.score);
            setFinalHighScore(data.highScore);
            setFinalTimeSurvived(data.timeSurvived);
            setGameState(GameState.GAME_OVER);
        };

        EventBus.on(Events.GAME_OVER, handleGameOver);

        return () => {
            EventBus.off(Events.GAME_OVER, handleGameOver);
        };
    }, []);

    // Separate effect for polling to avoid recreating interval
    useEffect(() => {
        // Poll game scene for distance and powerup time while playing
        const pollInterval = setInterval(() => {
            if (gameState === GameState.PLAYING && phaserRef.current?.scene) {
                const scene = phaserRef.current.scene as GameScene;
                const dist = scene.getDistance();
                const powerupTime = scene.getTimeUntilNextPowerUp();
                
                console.log('[App] Poll - Distance:', dist, 'PowerupTime:', powerupTime);
                
                setDistance(dist);
                setTimeUntilPowerUp(powerupTime);
            }
        }, 100); // Update 10 times per second

        return () => {
            clearInterval(pollInterval);
        };
    }, [gameState]);

    const handleStartGame = () => {
        console.log('[App] handleStartGame called, current state:', gameState);
        
        // Reset all UI state
        setDistance(0);
        setTimeUntilPowerUp(0);
        setFinalScore(0);
        setFinalHighScore(0);
        setFinalTimeSurvived(0);
        
        setGameState(GameState.PLAYING);
        console.log('[App] Game state set to PLAYING');
        
        // Use Phaser's scene restart mechanism for clean restart
        setTimeout(() => {
            if (phaserRef.current?.game) {
                const sceneManager = phaserRef.current.game.scene;
                const gameScene = sceneManager.getScene('GameScene') as GameScene;
                
                if (gameScene) {
                    console.log('[App] Restarting GameScene');
                    sceneManager.stop('GameScene');
                    sceneManager.start('GameScene');
                } else {
                    console.warn('[App] GameScene not found!');
                }
            } else {
                console.warn('[App] No game available!');
            }
        }, 100);
    };

    const handleRestart = () => {
        // Reset UI state first
        setDistance(0);
        setTimeUntilPowerUp(0);
        
        setGameState(GameState.PLAYING);
        
        // Use Phaser's scene restart mechanism for clean restart
        if (phaserRef.current?.game) {
            const sceneManager = phaserRef.current.game.scene;
            sceneManager.stop('GameScene');
            sceneManager.start('GameScene');
        }
    };

    const handleMainMenu = () => {
        setGameState(GameState.MAIN_MENU);
    };

    return (
        <div id="app">
            {gameState === GameState.MAIN_MENU && (
                <MainMenu onStartGame={handleStartGame} />
            )}
            
            <PhaserGame ref={phaserRef} currentActiveScene={() => {}} />
            
            <GameUI 
                isPlaying={gameState === GameState.PLAYING} 
                distance={distance}
                timeUntilPowerUp={timeUntilPowerUp}
            />
            
            {gameState === GameState.GAME_OVER && (
                <GameOver
                    score={finalScore}
                    highScore={finalHighScore}
                    timeSurvived={finalTimeSurvived}
                    onRestart={handleRestart}
                    onMainMenu={handleMainMenu}
                />
            )}
        </div>
    );
}

export default App
