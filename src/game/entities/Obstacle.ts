import Phaser from 'phaser';
import { ObstacleType } from '../../types/GameTypes';
import { COLOR_OBSTACLE, COLOR_EXPLOSION } from '../config/Constants';

export class Obstacle {
    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Graphics;
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

        // Create crate-style obstacle
        this.sprite = this.createCrate(scene, x, y, size);
        scene.physics.add.existing(this.sprite);
        
        const body = this.sprite.body as Phaser.Physics.Arcade.Body;
        body.setVelocityX(-speed);

        // Setup movement bounds for vertical movement
        this.minY = size / 2;
        this.maxY = scene.scale.height - size / 2;
        
        // For diagonal movement, set initial Y velocity
        if (type === ObstacleType.MOVING_VERTICAL) {
            body.setVelocityY(speed * this.moveDirection);
        }
    }

    private createCrate(scene: Phaser.Scene, x: number, y: number, size: number): Phaser.GameObjects.Graphics {
        const graphics = scene.add.graphics({ x, y });
        const half = size / 2;
        
        // Brown crate
        graphics.fillStyle(COLOR_OBSTACLE, 1);
        graphics.fillRect(-half, -half, size, size);
        
        // Wood grain lines (darker brown)
        graphics.lineStyle(2, 0x654321, 1);
        graphics.lineBetween(-half, -half + size * 0.3, half, -half + size * 0.3);
        graphics.lineBetween(-half, half - size * 0.3, half, half - size * 0.3);
        graphics.lineBetween(-half + size * 0.3, -half, -half + size * 0.3, half);
        graphics.lineBetween(half - size * 0.3, -half, half - size * 0.3, half);
        
        // Corner brackets (metal)
        graphics.fillStyle(0x444444, 1);
        const bracketSize = size * 0.15;
        // Top-left
        graphics.fillRect(-half, -half, bracketSize, bracketSize * 2);
        graphics.fillRect(-half, -half, bracketSize * 2, bracketSize);
        // Top-right
        graphics.fillRect(half - bracketSize, -half, bracketSize, bracketSize * 2);
        graphics.fillRect(half - bracketSize * 2, -half, bracketSize * 2, bracketSize);
        // Bottom-left
        graphics.fillRect(-half, half - bracketSize * 2, bracketSize, bracketSize * 2);
        graphics.fillRect(-half, half - bracketSize, bracketSize * 2, bracketSize);
        // Bottom-right
        graphics.fillRect(half - bracketSize, half - bracketSize * 2, bracketSize, bracketSize * 2);
        graphics.fillRect(half - bracketSize * 2, half - bracketSize, bracketSize * 2, bracketSize);
        
        return graphics;
    }

    update(delta: number): void {
        if (this.isDead) return;

        // Handle diagonal bouncing for moving obstacles
        if (this.type === ObstacleType.MOVING_VERTICAL) {
            const body = this.sprite.body as Phaser.Physics.Arcade.Body;
            
            // Bounce off top or bottom edges
            if (this.sprite.y <= this.minY && body.velocity.y < 0) {
                body.setVelocityY(Math.abs(body.velocity.y));
            } else if (this.sprite.y >= this.maxY && body.velocity.y > 0) {
                body.setVelocityY(-Math.abs(body.velocity.y));
            }
        }

        // Check if off screen (left side)
        if (this.sprite.x < -this.size) {
            this.destroy();
        }
    }

    isOffScreen(): boolean {
        return this.sprite.x < -this.size;
    }

    getSprite(): Phaser.GameObjects.Graphics {
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
