import Phaser from 'phaser';
import { Mountain } from '../entities/Mountain';

const MOUNTAIN_SPAWN_INTERVAL = 8000; // Every 8 seconds
const MOUNTAIN_SPEED = 200; // Slower than obstacles

export class MountainManager {
    private scene: Phaser.Scene;
    private mountains: Mountain[] = [];
    private spawnTimer: number = 0;
    private currentSpeed: number = MOUNTAIN_SPEED;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    update(delta: number, currentSpeed: number): void {
        // Update speed based on game difficulty
        this.currentSpeed = currentSpeed * 0.7; // Mountains move slower than obstacles
        
        // Update spawn timer
        this.spawnTimer += delta;
        if (this.spawnTimer >= MOUNTAIN_SPAWN_INTERVAL) {
            this.spawnMountain();
            this.spawnTimer = 0;
        }

        // Update all mountains
        this.mountains.forEach(mountain => {
            mountain.update();
        });

        // Remove off-screen or dead mountains
        this.mountains = this.mountains.filter(mountain => !mountain.isDead);
    }

    private spawnMountain(): void {
        const x = this.scene.scale.width + 150;
        const mountain = new Mountain(this.scene, x, this.currentSpeed);
        this.mountains.push(mountain);
    }

    getMountains(): Mountain[] {
        return this.mountains;
    }

    removeMountain(mountain: Mountain): void {
        const index = this.mountains.indexOf(mountain);
        if (index !== -1) {
            this.mountains.splice(index, 1);
        }
    }

    reset(): void {
        this.mountains.forEach(mountain => mountain.destroy());
        this.mountains = [];
        this.spawnTimer = 0;
        this.currentSpeed = MOUNTAIN_SPEED;
    }
}
