import Phaser from 'phaser';
import { Airplane } from '../entities/Airplane';
import { ObstacleManager } from '../managers/ObstacleManager';
import { PowerUpManager } from '../managers/PowerUpManager';
import { ScoreManager } from '../managers/ScoreManager';
import { EnemyPlaneManager } from '../managers/EnemyPlaneManager';
import { EventBus, Events } from '../../utils/EventBus';
import { AIRPLANE_START_X, AIRPLANE_START_Y, GAME_WIDTH, GAME_HEIGHT, COLOR_CLOUD } from '../config/Constants';

export class GameScene extends Phaser.Scene {
    private airplane!: Airplane;
    private obstacleManager!: ObstacleManager;
    private powerUpManager!: PowerUpManager;
    private scoreManager!: ScoreManager;
    private enemyPlaneManager!: EnemyPlaneManager;
    private isPlaying: boolean = false;
    private distance: number = 0;

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
        this.enemyPlaneManager = new EnemyPlaneManager(this);
        this.distance = 0;

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

        // Add better looking fluffy clouds
        for (let i = 0; i < 8; i++) {
            const cloudGraphics = this.add.graphics();
            const x = Phaser.Math.Between(0, GAME_WIDTH);
            const y = Phaser.Math.Between(50, 400);
            const scale = Phaser.Math.FloatBetween(0.8, 1.5);
            
            cloudGraphics.fillStyle(COLOR_CLOUD, 0.7);
            // Create fluffy cloud with multiple circles
            cloudGraphics.fillCircle(x, y, 30 * scale);
            cloudGraphics.fillCircle(x + 25 * scale, y, 35 * scale);
            cloudGraphics.fillCircle(x + 50 * scale, y, 30 * scale);
            cloudGraphics.fillCircle(x + 25 * scale, y - 15 * scale, 25 * scale);
            
            this.tweens.add({
                targets: cloudGraphics,
                x: -200,
                duration: 40000 + i * 3000,
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
        console.log('[GameScene] startGame called');
        this.isPlaying = true;
        EventBus.emit(Events.GAME_START);
        console.log('[GameScene] Game started, isPlaying:', this.isPlaying);
    }

    update(_time: number, delta: number): void {
        if (!this.isPlaying || this.airplane.isDead) {
            if (!this.isPlaying) {
                console.log('[GameScene] Update skipped - not playing');
            }
            return;
        }

        // Update distance traveled (1 pixel = 0.1 meters)
        this.distance += (delta / 1000) * 30; // 30 meters per second
        
        if (Math.floor(this.distance) % 50 === 0 && this.distance > 1) {
            console.log('[GameScene] Distance:', Math.floor(this.distance), 'isPlaying:', this.isPlaying);
        }

        // Update airplane
        this.airplane.update(delta);

        // Update managers
        const difficultyLevel = this.obstacleManager.getDifficultyLevel();
        this.obstacleManager.update(delta);
        this.powerUpManager.update(delta);
        this.scoreManager.update(delta);
        this.enemyPlaneManager.update(delta, difficultyLevel, this.airplane.getPosition().y);

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
            this.powerUpManager.fireProjectile(pos.x + 30, pos.y, this.enemyPlaneManager.getEnemies());
        }

        // Check game over
        if (this.scoreManager.isGameOver()) {
            this.gameOver();
        }
    }

    private checkCollisions(): void {
        const airplaneSprite = this.airplane.getSprite();
        const body = airplaneSprite.body as Phaser.Physics.Arcade.Body;
        const airplaneBounds = new Phaser.Geom.Rectangle(
            airplaneSprite.x - body.width / 2,
            airplaneSprite.y - body.height / 2,
            body.width,
            body.height
        );

        // Check airplane vs obstacles
        this.obstacleManager.getObstacles().forEach(obstacle => {
            if (obstacle.isDead) return;

            const obstacleSprite = obstacle.getSprite();
            const obstacleBody = obstacleSprite.body as Phaser.Physics.Arcade.Body;
            const obstacleBounds = new Phaser.Geom.Rectangle(
                obstacleSprite.x - obstacleBody.width / 2,
                obstacleSprite.y - obstacleBody.height / 2,
                obstacleBody.width,
                obstacleBody.height
            );

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

        // Check airplane vs enemy planes
        this.enemyPlaneManager.getEnemies().forEach(enemy => {
            if (enemy.isDead) return;

            const enemySprite = enemy.getSprite();
            const enemyBody = enemySprite.body as Phaser.Physics.Arcade.Body;
            const enemyBounds = new Phaser.Geom.Rectangle(
                enemySprite.x - enemyBody.width / 2,
                enemySprite.y - enemyBody.height / 2,
                enemyBody.width,
                enemyBody.height
            );

            if (Phaser.Geom.Intersects.RectangleToRectangle(airplaneBounds, enemyBounds)) {
                this.handleAirplaneCollision();
                enemy.explode();
                this.enemyPlaneManager.removeEnemy(enemy);
            }
        });

        // Check projectiles vs obstacles
        this.powerUpManager.getProjectiles().forEach(projectile => {
            if (projectile.isDead) return;

            const projectileSprite = projectile.getSprite() as Phaser.GameObjects.Rectangle;
            const projectileBounds = projectileSprite.getBounds();

            // vs obstacles
            this.obstacleManager.getObstacles().forEach(obstacle => {
                if (obstacle.isDead) return;

                const obstacleSprite = obstacle.getSprite();
                const obstacleBody = obstacleSprite.body as Phaser.Physics.Arcade.Body;
                const obstacleBounds = new Phaser.Geom.Rectangle(
                    obstacleSprite.x - obstacleBody.width / 2,
                    obstacleSprite.y - obstacleBody.height / 2,
                    obstacleBody.width,
                    obstacleBody.height
                );

                if (Phaser.Geom.Intersects.RectangleToRectangle(projectileBounds, obstacleBounds)) {
                    obstacle.explode();
                    this.obstacleManager.removeObstacle(obstacle);
                    this.powerUpManager.removeProjectile(projectile);
                    this.scoreManager.obstacleDestroyed();
                }
            });

            // vs enemy planes
            this.enemyPlaneManager.getEnemies().forEach(enemy => {
                if (enemy.isDead) return;

                const enemySprite = enemy.getSprite();
                const enemyBody = enemySprite.body as Phaser.Physics.Arcade.Body;
                const enemyBounds = new Phaser.Geom.Rectangle(
                    enemySprite.x - enemyBody.width / 2,
                    enemySprite.y - enemyBody.height / 2,
                    enemyBody.width,
                    enemyBody.height
                );

                if (Phaser.Geom.Intersects.RectangleToRectangle(projectileBounds, enemyBounds)) {
                    enemy.explode();
                    this.enemyPlaneManager.removeEnemy(enemy);
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
        console.log('[GameScene] restartGame called');
        
        // Clean up existing entities
        this.airplane.destroy();
        this.obstacleManager.reset();
        this.powerUpManager.reset();
        this.scoreManager.reset();
        this.enemyPlaneManager.reset();
        this.distance = 0;

        // Reset airplane
        this.airplane = new Airplane(this, AIRPLANE_START_X, AIRPLANE_START_Y);

        // Restart the game
        this.isPlaying = true;
        EventBus.emit(Events.GAME_START);
        
        console.log('[GameScene] Game restarted, isPlaying:', this.isPlaying);
    }

    public getScoreManager(): ScoreManager {
        return this.scoreManager;
    }

    public getPowerUpManager(): PowerUpManager {
        return this.powerUpManager;
    }

    public getDistance(): number {
        console.log('[GameScene] getDistance called, returning:', this.distance);
        return this.distance;
    }

    public getTimeUntilNextPowerUp(): number {
        const time = this.powerUpManager.getTimeUntilNextPowerUp();
        console.log('[GameScene] getTimeUntilNextPowerUp called, returning:', time);
        return time;
    }
}
