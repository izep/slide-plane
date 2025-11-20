import Phaser from 'phaser';
import { ObstacleType } from '../../types/GameTypes';
import { COLOR_OBSTACLE, COLOR_EXPLOSION } from '../config/Constants';

export class Obstacle {
    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Rectangle;
    private type: ObstacleType;
    private speed: number;
    private size: number;
    private moveDirection: number = 1; // For vertical movement
    private minY: number;
    private maxY: number;
    public isDead: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, type: ObstacleType, speed: number, size: number) {
        this.scene = scene;
        this.type = type;
        this.speed = speed;
        this.size = size;

        // Create obstacle sprite
        this.sprite = scene.add.rectangle(x, y, size, size, COLOR_OBSTACLE);
        scene.physics.add.existing(this.sprite);
        
        const body = this.sprite.body as Phaser.Physics.Arcade.Body;
        body.setVelocityX(-speed);

        // Setup movement bounds for vertical movement
        this.minY = size;
        this.maxY = scene.scale.height - size;
    }

    update(delta: number): void {
        if (this.isDead) return;

        // Handle different obstacle types
        if (this.type === ObstacleType.MOVING_VERTICAL) {
            const body = this.sprite.body as Phaser.Physics.Arcade.Body;
            
            // Change direction at bounds
            if (this.sprite.y <= this.minY || this.sprite.y >= this.maxY) {
                this.moveDirection *= -1;
            }
            
            body.setVelocityY(this.speed * this.moveDirection);
        }

        // Check if off screen (left side)
        if (this.sprite.x < -this.size) {
            this.destroy();
        }
    }

    isOffScreen(): boolean {
        return this.sprite.x < -this.size;
    }

    getSprite(): Phaser.GameObjects.Rectangle {
        return this.sprite;
    }

    destroy(): void {
        if (!this.isDead) {
            this.isDead = true;
            this.sprite.destroy();
        }
    }

    explode(): void {
        if (this.isDead) return;
        
        this.isDead = true;

        // Create explosion particles
        const particles = this.scene.add.particles(this.sprite.x, this.sprite.y, 'particle', {
            speed: { min: 50, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.8, end: 0 },
            lifespan: 400,
            quantity: 15,
            tint: [COLOR_EXPLOSION, COLOR_OBSTACLE, 0xffaa00]
        });

        // Explosion tween
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 300,
            onComplete: () => {
                this.sprite.destroy();
                particles.destroy();
            }
        });
    }

    hasPassed(airplaneX: number): boolean {
        return this.sprite.x + this.size / 2 < airplaneX;
    }
}
