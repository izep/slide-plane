import Phaser from 'phaser';
import { EnemyPlane } from '../entities/EnemyPlane';
import {
    ENEMY_PLANE_START_DIFFICULTY,
    ENEMY_PLANE_SPEED,
    ENEMY_PLANE_SPAWN_INTERVAL
} from '../config/Constants';

export class EnemyPlaneManager {
    private scene: Phaser.Scene;
    private enemies: EnemyPlane[] = [];
    private spawnTimer: number = 0;
    private currentDifficulty: number = 0;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    update(delta: number, difficultyLevel: number, playerY: number): void {
        this.currentDifficulty = difficultyLevel;
        
        // Only spawn enemy planes after reaching difficulty threshold
        if (difficultyLevel >= ENEMY_PLANE_START_DIFFICULTY) {
            this.spawnTimer += delta;
            if (this.spawnTimer >= ENEMY_PLANE_SPAWN_INTERVAL) {
                this.spawnEnemyPlane();
                this.spawnTimer = 0;
            }
        }

        // Update all enemy planes
        this.enemies.forEach(enemy => {
            enemy.update(delta, playerY);
        });

        // Remove off-screen or dead enemies
        this.enemies = this.enemies.filter(enemy => !enemy.isDead);
    }

    private spawnEnemyPlane(): void {
        const x = this.scene.scale.width + 100; // Spawn from behind
        const y = Phaser.Math.Between(50, this.scene.scale.height - 50);

        const enemy = new EnemyPlane(this.scene, x, y, ENEMY_PLANE_SPEED + (this.currentDifficulty * 10));
        this.enemies.push(enemy);
    }

    getEnemies(): EnemyPlane[] {
        return this.enemies;
    }

    removeEnemy(enemy: EnemyPlane): void {
        const index = this.enemies.indexOf(enemy);
        if (index !== -1) {
            this.enemies.splice(index, 1);
        }
    }

    reset(): void {
        this.enemies.forEach(enemy => enemy.destroy());
        this.enemies = [];
        this.spawnTimer = 0;
    }
}
