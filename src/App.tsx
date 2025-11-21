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

        // Poll game scene for distance and powerup time while playing
        const pollInterval = setInterval(() => {
            if (gameState === GameState.PLAYING && phaserRef.current?.scene) {
                const scene = phaserRef.current.scene as GameScene;
                setDistance(scene.getDistance());
                setTimeUntilPowerUp(scene.getTimeUntilNextPowerUp());
            }
        }, 100); // Update 10 times per second

        return () => {
            EventBus.off(Events.GAME_OVER, handleGameOver);
            clearInterval(pollInterval);
        };
    }, [gameState]);

    const handleStartGame = () => {
        setGameState(GameState.PLAYING);
        
        // Wait for scene to be ready
        setTimeout(() => {
            if (phaserRef.current?.scene) {
                const scene = phaserRef.current.scene as GameScene;
                if (gameState === GameState.GAME_OVER) {
                    scene.restartGame();
                }
            }
        }, 100);
    };

    const handleRestart = () => {
        if (phaserRef.current?.scene) {
            const scene = phaserRef.current.scene as GameScene;
            scene.restartGame();
            setGameState(GameState.PLAYING);
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
