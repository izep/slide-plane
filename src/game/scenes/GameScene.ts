import Phaser from 'phaser';
import { Airplane } from '../entities/Airplane';
import { ObstacleManager } from '../managers/ObstacleManager';
import { PowerUpManager } from '../managers/PowerUpManager';
import { ScoreManager } from '../managers/ScoreManager';
import { EventBus, Events } from '../../utils/EventBus';
import { AIRPLANE_START_X, AIRPLANE_START_Y, GAME_WIDTH, GAME_HEIGHT } from '../config/Constants';

export class GameScene extends Phaser.Scene {
    private airplane!: Airplane;
    private obstacleManager!: ObstacleManager;
    private powerUpManager!: PowerUpManager;
    private scoreManager!: ScoreManager;
    private isPlaying: boolean = false;
    private backgroundSpeed: number = 2;

    constructor() {
        super({ key: 'GameScene' });
    }

    preload(): void {
        // Create a simple particle texture
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(4, 4, 4);
        graphics.generateTexture('particle', 8, 8);
        graphics.destroy();
    }

    create(): void {
        // Create scrolling background
        this.createBackground();

        // Initialize managers
        this.obstacleManager = new ObstacleManager(this);
        this.powerUpManager = new PowerUpManager(this);
        this.scoreManager = new ScoreManager();

        // Create airplane
        this.airplane = new Airplane(this, AIRPLANE_START_X, AIRPLANE_START_Y);

        // Setup input
        this.setupInput();

        // Setup collisions
        this.setupCollisions();

        // Start the game
        this.startGame();

        // Enable scene to emit events
        EventBus.emit('current-scene-ready', this);
    }

    private createBackground(): void {
        // Simple gradient background
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xE0F6FF, 0xE0F6FF, 1);
        graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Add some clouds
        for (let i = 0; i < 5; i++) {
            const cloud = this.add.rectangle(
                Phaser.Math.Between(0, GAME_WIDTH),
                Phaser.Math.Between(50, 300),
                Phaser.Math.Between(80, 150),
                40,
                0xffffff,
                0.6
            );
            this.tweens.add({
                targets: cloud,
                x: -100,
                duration: 30000 + i * 5000,
                repeat: -1
            });
        }
    }

    private setupInput(): void {
        // Mouse input
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.isPlaying && !this.airplane.isDead) {
                this.airplane.setTargetY(pointer.y);
            }
        });

        // Touch input
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (this.isPlaying && !this.airplane.isDead) {
                this.airplane.setTargetY(pointer.y);
            }
        });

        // Keyboard for pause
        this.input.keyboard?.on('keydown-ESC', () => {
            this.togglePause();
        });
    }

    private setupCollisions(): void {
        // Collision detection is handled in update loop using physics overlap
    }

    private startGame(): void {
        this.isPlaying = true;
        EventBus.emit(Events.GAME_START);
    }

    update(time: number, delta: number): void {
        if (!this.isPlaying || this.airplane.isDead) return;

        // Update airplane
        this.airplane.update(delta);

        // Update managers
        this.obstacleManager.update(delta);
        this.powerUpManager.update(delta);
        this.scoreManager.update(delta);

        // Check collisions
        this.checkCollisions();

        // Check passed obstacles
        const passedObstacles = this.obstacleManager.checkPassedObstacles(this.airplane.getPosition().x);
        passedObstacles.forEach(() => {
            this.scoreManager.obstaclePass();
        });

        // Auto-fire if power-up is active
        if (this.powerUpManager.canFire()) {
            const pos = this.airplane.getPosition();
            this.powerUpManager.fireProjectile(pos.x + 30, pos.y);
        }

        // Check game over
        if (this.scoreManager.isGameOver()) {
            this.gameOver();
        }
    }

    private checkCollisions(): void {
        const airplaneSprite = this.airplane.getSprite();
        const airplaneBounds = airplaneSprite.getBounds();

        // Check airplane vs obstacles
        this.obstacleManager.getObstacles().forEach(obstacle => {
            if (obstacle.isDead) return;

            const obstacleSprite = obstacle.getSprite();
            const obstacleBounds = obstacleSprite.getBounds();

            if (Phaser.Geom.Intersects.RectangleToRectangle(airplaneBounds, obstacleBounds)) {
                this.handleAirplaneCollision();
                obstacle.explode();
                this.obstacleManager.removeObstacle(obstacle);
            }
        });

        // Check airplane vs power-ups
        this.powerUpManager.getPowerUps().forEach(powerUp => {
            if (powerUp.isCollected) return;

            const powerUpSprite = powerUp.getSprite();
            const powerUpBounds = powerUpSprite.getBounds();

            if (Phaser.Geom.Intersects.RectangleToRectangle(airplaneBounds, powerUpBounds)) {
                powerUp.collect();
                this.powerUpManager.activatePowerUp(powerUp.getType());
                EventBus.emit(Events.POWERUP_COLLECTED, { type: powerUp.getType() });
            }
        });

        // Check projectiles vs obstacles
        this.powerUpManager.getProjectiles().forEach(projectile => {
            if (projectile.isDead) return;

            const projectileSprite = projectile.getSprite() as Phaser.GameObjects.Rectangle;
            const projectileBounds = projectileSprite.getBounds();

            this.obstacleManager.getObstacles().forEach(obstacle => {
                if (obstacle.isDead) return;

                const obstacleSprite = obstacle.getSprite();
                const obstacleBounds = obstacleSprite.getBounds();

                if (Phaser.Geom.Intersects.RectangleToRectangle(projectileBounds, obstacleBounds)) {
                    obstacle.explode();
                    this.obstacleManager.removeObstacle(obstacle);
                    this.powerUpManager.removeProjectile(projectile);
                    this.scoreManager.obstacleDestroyed();
                }
            });
        });
    }

    private handleAirplaneCollision(): void {
        this.scoreManager.loseLife();

        if (this.scoreManager.isGameOver()) {
            this.airplane.die();
        } else {
            // Flash effect for damage
            this.tweens.add({
                targets: this.airplane.getSprite(),
                alpha: 0.3,
                duration: 100,
                yoyo: true,
                repeat: 3
            });
        }
    }

    private gameOver(): void {
        this.isPlaying = false;
        
        EventBus.emit(Events.GAME_OVER, {
            score: this.scoreManager.getScore(),
            highScore: this.scoreManager.getHighScore(),
            timeSurvived: this.scoreManager.getTimeSurvived()
        });

        // Wait a bit then allow restart
        this.time.delayedCall(2000, () => {
            // Scene will be restarted from React UI
        });
    }

    private togglePause(): void {
        if (this.isPlaying) {
            this.scene.pause();
            EventBus.emit(Events.GAME_PAUSE);
        } else {
            this.scene.resume();
            EventBus.emit(Events.GAME_RESUME);
        }
    }

    public restartGame(): void {
        // Reset all managers
        this.obstacleManager.reset();
        this.powerUpManager.reset();
        this.scoreManager.reset();

        // Reset airplane
        if (this.airplane) {
            this.airplane.destroy();
        }
        this.airplane = new Airplane(this, AIRPLANE_START_X, AIRPLANE_START_Y);

        // Restart game
        this.startGame();
    }

    public getScoreManager(): ScoreManager {
        return this.scoreManager;
    }

    public getPowerUpManager(): PowerUpManager {
        return this.powerUpManager;
    }
}
