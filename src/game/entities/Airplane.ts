import Phaser from 'phaser';
import { AIRPLANE_SPEED, AIRPLANE_SIZE, COLOR_AIRPLANE, COLOR_DOG_WHITE, COLOR_DOG_BLACK, COLOR_GOGGLES } from '../config/Constants';

export class Airplane {
    private scene: Phaser.Scene;
    private container: Phaser.GameObjects.Container;
    private targetY: number;
    public isDead: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        this.targetY = y;

        // Create WWII-style airplane with dog pilot
        this.container = this.createWWIIPlane(scene, x, y);
        scene.physics.add.existing(this.container);
        
        const body = this.container.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        body.setSize(AIRPLANE_SIZE, AIRPLANE_SIZE * 0.5);
    }

    private createWWIIPlane(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
        const graphics = scene.add.graphics();
        
        // Plane fuselage (gray)
        graphics.fillStyle(COLOR_AIRPLANE, 1);
        graphics.fillRect(-25, -8, 50, 16);
        
        // Wings
        graphics.fillRect(-15, -20, 30, 40);
        
        // Tail
        graphics.fillRect(-28, -6, 10, 12);
        graphics.fillRect(-30, -12, 8, 8); // tail fin
        
        // Propeller nose (darker)
        graphics.fillStyle(0x666666, 1);
        graphics.fillCircle(28, 0, 6);
        
        // Dog pilot
        // White head
        graphics.fillStyle(COLOR_DOG_WHITE, 1);
        graphics.fillCircle(10, -2, 8);
        
        // Black ears
        graphics.fillStyle(COLOR_DOG_BLACK, 1);
        graphics.fillEllipse(5, -8, 6, 10); // left ear
        graphics.fillEllipse(15, -8, 6, 10); // right ear
        
        // Goggles
        graphics.fillStyle(COLOR_GOGGLES, 1);
        graphics.fillRect(8, -4, 8, 4);
        
        // Flight cap
        graphics.fillStyle(COLOR_GOGGLES, 1);
        graphics.fillEllipse(10, -8, 10, 6);
        
        graphics.generateTexture('ww2plane', 60, 50);
        graphics.destroy();
        
        const planeSprite = scene.add.sprite(0, 0, 'ww2plane');
        const container = scene.add.container(x, y, [planeSprite]);
        
        return container;
    }

    update(delta: number): void {
        if (this.isDead) return;

        // Smoothly move airplane towards target Y position
        const currentY = this.container.y;
        const diff = this.targetY - currentY;
        
        if (Math.abs(diff) > 1) {
            const moveSpeed = AIRPLANE_SPEED * (delta / 1000);
            const moveAmount = Math.sign(diff) * Math.min(Math.abs(diff), moveSpeed);
            this.container.y += moveAmount;
        }

        // Keep within bounds
        const minY = AIRPLANE_SIZE / 2;
        const maxY = this.scene.scale.height - AIRPLANE_SIZE / 2;
        this.container.y = Phaser.Math.Clamp(this.container.y, minY, maxY);
    }

    setTargetY(y: number): void {
        this.targetY = y;
    }

    getSprite(): Phaser.GameObjects.Container {
        return this.container;
    }

    getPosition(): { x: number, y: number } {
        return { x: this.container.x, y: this.container.y };
    }

    die(): void {
        this.isDead = true;
        this.playDeathAnimation();
    }

    private playDeathAnimation(): void {
        // Explosion effect
        const particles = this.scene.add.particles(this.container.x, this.container.y, 'particle', {
            speed: { min: 100, max: 300 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            lifespan: 500,
            quantity: 20,
            tint: [0xff0000, 0xff6600, 0xffff00]
        });

        // Fade out and destroy
        this.scene.tweens.add({
            targets: this.container,
            alpha: 0,
            angle: 360,
            duration: 500,
            onComplete: () => {
                particles.destroy();
            }
        });
    }

    destroy(): void {
        this.container.destroy();
    }
}
