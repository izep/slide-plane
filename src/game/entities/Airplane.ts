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
        
        // Fuselage (longer, sleeker)
        graphics.fillStyle(COLOR_AIRPLANE, 1);
        graphics.fillRect(-30, -10, 60, 20);
        graphics.fillCircle(28, 0, 10); // rounded nose
        
        // Wings (biplane style)
        graphics.fillRect(-20, -28, 40, 56);
        graphics.fillRect(-18, -32, 36, 8); // top wing
        graphics.fillRect(-18, 24, 36, 8); // bottom wing strut
        
        // Wing struts
        graphics.lineStyle(2, 0x666666, 1);
        graphics.lineBetween(-15, -24, -15, 24);
        graphics.lineBetween(0, -24, 0, 24);
        graphics.lineBetween(15, -24, 15, 24);
        
        // Tail assembly
        graphics.fillStyle(COLOR_AIRPLANE, 1);
        graphics.fillRect(-35, -8, 12, 16);
        graphics.fillRect(-38, -16, 10, 12); // vertical stabilizer
        graphics.fillRect(-38, 4, 10, 12); // horizontal stabilizer
        
        // Propeller (darker metal)
        graphics.fillStyle(0x444444, 1);
        graphics.fillCircle(35, 0, 8);
        graphics.fillRect(33, -20, 4, 40); // propeller blade vertical
        graphics.fillRect(15, -2, 20, 4); // propeller blade horizontal
        
        // Cockpit window (darker)
        graphics.fillStyle(0x87CEEB, 0.6);
        graphics.fillRect(-8, -8, 16, 16);
        
        // Dog pilot (bigger, more detailed)
        // White fluffy body
        graphics.fillStyle(COLOR_DOG_WHITE, 1);
        graphics.fillCircle(5, 0, 12); // head
        graphics.fillCircle(2, 4, 8); // snout
        
        // Black nose
        graphics.fillStyle(COLOR_DOG_BLACK, 1);
        graphics.fillCircle(6, 4, 3);
        
        // Floppy ears (using arcs instead of rotated ellipses)
        graphics.fillStyle(COLOR_DOG_WHITE, 1);
        // Left ear
        graphics.beginPath();
        graphics.arc(-2, -6, 6, 0, Math.PI, false);
        graphics.fillPath();
        // Right ear
        graphics.beginPath();
        graphics.arc(12, -6, 6, 0, Math.PI, false);
        graphics.fillPath();
        
        // Inner ear (pink)
        graphics.fillStyle(0xFFB6C1, 1);
        // Left inner ear
        graphics.beginPath();
        graphics.arc(-2, -6, 3, 0, Math.PI, false);
        graphics.fillPath();
        // Right inner ear
        graphics.beginPath();
        graphics.arc(12, -6, 3, 0, Math.PI, false);
        graphics.fillPath();
        
        // Goggles
        graphics.fillStyle(COLOR_GOGGLES, 1);
        graphics.fillCircle(2, -1, 5); // left lens
        graphics.fillCircle(8, -1, 5); // right lens
        graphics.lineStyle(2, COLOR_GOGGLES, 1);
        graphics.strokeCircle(2, -1, 5);
        graphics.strokeCircle(8, -1, 5);
        graphics.lineBetween(7, -1, 3, -1); // bridge
        
        // Flight cap
        graphics.fillStyle(COLOR_GOGGLES, 1);
        graphics.fillEllipse(5, -10, 14, 8); // x, y, width, height
        
        // Goggles strap
        graphics.lineStyle(2, COLOR_GOGGLES, 1);
        graphics.lineBetween(-3, -1, -7, 0);
        graphics.lineBetween(13, -1, 17, 0);
        
        graphics.generateTexture('ww2plane', 80, 70);
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
