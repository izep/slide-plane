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
                console.log('[EnemyPlaneManager] Spawning enemy at difficulty:', difficultyLevel);
                this.spawnEnemyPlane();
                this.spawnTimer = 0;
            }
        } else {
            if (Math.floor(this.spawnTimer / 1000) % 5 === 0 && this.spawnTimer > 1000) {
                console.log('[EnemyPlaneManager] Waiting for difficulty', ENEMY_PLANE_START_DIFFICULTY, 'current:', difficultyLevel);
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
        const x = -100; // Spawn from behind (left side)
        const y = Phaser.Math.Between(50, this.scene.scale.height - 50);

        console.log('[EnemyPlaneManager] Spawning enemy cat plane at:', x, y);
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
