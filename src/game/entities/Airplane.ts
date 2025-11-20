import Phaser from 'phaser';
import { AIRPLANE_SPEED, AIRPLANE_SIZE, COLOR_AIRPLANE } from '../config/Constants';

export class Airplane {
    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Rectangle;
    private targetY: number;
    public isDead: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        this.targetY = y;

        // Create airplane sprite (using rectangle for now, will be replaced with actual sprite)
        this.sprite = scene.add.rectangle(x, y, AIRPLANE_SIZE, AIRPLANE_SIZE * 0.6, COLOR_AIRPLANE);
        scene.physics.add.existing(this.sprite);
        
        const body = this.sprite.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        body.setSize(AIRPLANE_SIZE, AIRPLANE_SIZE * 0.6);
    }

    update(delta: number): void {
        if (this.isDead) return;

        // Smoothly move airplane towards target Y position
        const currentY = this.sprite.y;
        const diff = this.targetY - currentY;
        
        if (Math.abs(diff) > 1) {
            const moveSpeed = AIRPLANE_SPEED * (delta / 1000);
            const moveAmount = Math.sign(diff) * Math.min(Math.abs(diff), moveSpeed);
            this.sprite.y += moveAmount;
        }

        // Keep within bounds
        const minY = AIRPLANE_SIZE / 2;
        const maxY = this.scene.scale.height - AIRPLANE_SIZE / 2;
        this.sprite.y = Phaser.Math.Clamp(this.sprite.y, minY, maxY);
    }

    setTargetY(y: number): void {
        this.targetY = y;
    }

    getSprite(): Phaser.GameObjects.Rectangle {
        return this.sprite;
    }

    getPosition(): { x: number, y: number } {
        return { x: this.sprite.x, y: this.sprite.y };
    }

    die(): void {
        this.isDead = true;
        this.playDeathAnimation();
    }

    private playDeathAnimation(): void {
        // Explosion effect
        const particles = this.scene.add.particles(this.sprite.x, this.sprite.y, 'particle', {
            speed: { min: 100, max: 300 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            lifespan: 500,
            quantity: 20,
            tint: [0xff0000, 0xff6600, 0xffff00]
        });

        // Fade out and destroy
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            angle: 360,
            duration: 500,
            onComplete: () => {
                particles.destroy();
            }
        });
    }

    destroy(): void {
        this.sprite.destroy();
    }
}
