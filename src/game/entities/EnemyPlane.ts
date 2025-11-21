import Phaser from 'phaser';
import { ENEMY_PLANE_SPEED, ENEMY_PLANE_SIZE, COLOR_ENEMY_PLANE } from '../config/Constants';

export class EnemyPlane {
    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Graphics;
    private speed: number;
    private targetY: number;
    public isDead: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, speed: number) {
        this.scene = scene;
        this.speed = speed;
        this.targetY = y;

        // Create enemy plane sprite (red, facing left)
        this.sprite = this.createEnemyPlane(scene, x, y);
        scene.physics.add.existing(this.sprite);
        
        const body = this.sprite.body as Phaser.Physics.Arcade.Body;
        body.setVelocityX(-speed);
        body.setSize(ENEMY_PLANE_SIZE, ENEMY_PLANE_SIZE * 0.6);
    }

    private createEnemyPlane(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Graphics {
        const graphics = scene.add.graphics({ x, y });
        
        // Red enemy plane (facing left, chasing player)
        graphics.fillStyle(COLOR_ENEMY_PLANE, 1);
        
        // Fuselage
        graphics.fillRect(-20, -6, 40, 12);
        
        // Wings
        graphics.fillRect(-10, -15, 20, 30);
        
        // Tail
        graphics.fillRect(18, -4, 8, 8);
        graphics.fillRect(20, -8, 6, 6);
        
        // Propeller
        graphics.fillStyle(0x660000, 1);
        graphics.fillCircle(-22, 0, 5);
        
        return graphics;
    }

    update(delta: number, playerY: number): void {
        if (this.isDead) return;

        // Chase player's Y position
        const currentY = this.sprite.y;
        const diff = playerY - currentY;
        
        if (Math.abs(diff) > 5) {
            const chaseSpeed = (this.speed * 0.3) * (delta / 1000);
            const moveAmount = Math.sign(diff) * Math.min(Math.abs(diff), chaseSpeed);
            this.sprite.y += moveAmount;
        }

        // Keep within bounds
        const minY = ENEMY_PLANE_SIZE / 2;
        const maxY = this.scene.scale.height - ENEMY_PLANE_SIZE / 2;
        this.sprite.y = Phaser.Math.Clamp(this.sprite.y, minY, maxY);

        // Check if off screen (left side)
        if (this.sprite.x < -ENEMY_PLANE_SIZE) {
            this.destroy();
        }
    }

    isOffScreen(): boolean {
        return this.sprite.x < -ENEMY_PLANE_SIZE;
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
            tint: [0xff0000, 0xff6600, 0xffaa00]
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
}
