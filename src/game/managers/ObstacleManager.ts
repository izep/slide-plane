import Phaser from 'phaser';
import { Obstacle } from '../entities/Obstacle';
import { ObstacleType } from '../../types/GameTypes';
import {
    OBSTACLE_START_SPEED,
    OBSTACLE_SPAWN_INTERVAL,
    OBSTACLE_MIN_SPAWN_INTERVAL,
    OBSTACLE_SPAWN_DECREASE,
    OBSTACLE_SPEED_INCREASE,
    OBSTACLE_MIN_SIZE,
    OBSTACLE_MAX_SIZE,
    DIFFICULTY_INCREASE_INTERVAL,
    MAX_DIFFICULTY_LEVEL
} from '../config/Constants';

export class ObstacleManager {
    private scene: Phaser.Scene;
    private obstacles: Obstacle[] = [];
    private spawnTimer: number = 0;
    private aimedSpawnTimer: number = 0;
    private currentSpawnInterval: number = OBSTACLE_SPAWN_INTERVAL;
    private currentSpeed: number = OBSTACLE_START_SPEED;
    private difficultyLevel: number = 0;
    private difficultyTimer: number = 0;
    private markedObstacles: Set<Obstacle> = new Set();
    private playerY: number = 0;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    update(delta: number, playerY?: number): void {
        // Store player position for aimed spawns
        if (playerY !== undefined) {
            this.playerY = playerY;
        }
        
        // Update spawn timer
        this.spawnTimer += delta;
        if (this.spawnTimer >= this.currentSpawnInterval) {
            this.spawnObstacle();
            this.spawnTimer = 0;
        }

        // Update aimed spawn timer (every 0.5-2 seconds)
        this.aimedSpawnTimer += delta;
        const aimedInterval = Phaser.Math.Between(500, 2000);
        if (this.aimedSpawnTimer >= aimedInterval) {
            this.spawnAimedObstacle();
            this.aimedSpawnTimer = 0;
        }

        // Update difficulty
        this.difficultyTimer += delta;
        if (this.difficultyTimer >= DIFFICULTY_INCREASE_INTERVAL && this.difficultyLevel < MAX_DIFFICULTY_LEVEL) {
            this.increaseDifficulty();
            this.difficultyTimer = 0;
        }

        // Update all obstacles
        this.obstacles.forEach(obstacle => {
            obstacle.update();
        });

        // Remove off-screen or dead obstacles
        this.obstacles = this.obstacles.filter(obstacle => !obstacle.isDead);
    }

    private spawnObstacle(): void {
        const x = this.scene.scale.width + 50;
        const size = Phaser.Math.Between(OBSTACLE_MIN_SIZE, OBSTACLE_MAX_SIZE);
        
        // 30% chance to spawn directly in player's path (harder!)
        let y: number;
        if (Math.random() < 0.3) {
            // Spawn near center where player often is
            y = Phaser.Math.Between(this.scene.scale.height * 0.3, this.scene.scale.height * 0.7);
        } else {
            y = Phaser.Math.Between(size, this.scene.scale.height - size);
        }

        // Determine obstacle type based on difficulty
        let type = ObstacleType.STATIC;
        if (this.difficultyLevel >= 2) {
            const rand = Math.random();
            if (rand < 0.4) { // increased chance of moving obstacles
                type = ObstacleType.MOVING_VERTICAL;
            }
        }

        const obstacle = new Obstacle(this.scene, x, y, type, this.currentSpeed, size);
        this.obstacles.push(obstacle);
    }

    private spawnAimedObstacle(): void {
        const x = this.scene.scale.width + 50;
        const size = Phaser.Math.Between(OBSTACLE_MIN_SIZE, OBSTACLE_MAX_SIZE);
        
        // Aim directly at player's current position
        const y = this.playerY || this.scene.scale.height / 2;
        
        const obstacle = new Obstacle(this.scene, x, y, ObstacleType.STATIC, this.currentSpeed, size);
        this.obstacles.push(obstacle);
    }

    private increaseDifficulty(): void {
        this.difficultyLevel++;
        
        // Decrease spawn interval (spawn faster)
        this.currentSpawnInterval = Math.max(
            OBSTACLE_MIN_SPAWN_INTERVAL,
            this.currentSpawnInterval - OBSTACLE_SPAWN_DECREASE
        );

        // Increase obstacle speed
        this.currentSpeed += OBSTACLE_SPEED_INCREASE;
    }

    getObstacles(): Obstacle[] {
        return this.obstacles;
    }

    removeObstacle(obstacle: Obstacle): void {
        const index = this.obstacles.indexOf(obstacle);
        if (index !== -1) {
            this.obstacles.splice(index, 1);
        }
    }

    checkPassedObstacles(airplaneX: number): Obstacle[] {
        const passed: Obstacle[] = [];
        
        this.obstacles.forEach(obstacle => {
            if (!this.markedObstacles.has(obstacle) && obstacle.hasPassed(airplaneX)) {
                this.markedObstacles.add(obstacle);
                passed.push(obstacle);
            }
        });

        return passed;
    }

    reset(): void {
        this.obstacles.forEach(obstacle => obstacle.destroy());
        this.obstacles = [];
        this.spawnTimer = 0;
        this.aimedSpawnTimer = 0;
        this.currentSpawnInterval = OBSTACLE_SPAWN_INTERVAL;
        this.currentSpeed = OBSTACLE_START_SPEED;
        this.difficultyLevel = 0;
        this.difficultyTimer = 0;
        this.markedObstacles.clear();
        this.playerY = 0;
    }

    getDifficultyLevel(): number {
        return this.difficultyLevel;
    }
}
