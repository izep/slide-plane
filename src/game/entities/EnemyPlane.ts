import Phaser from 'phaser';
import { ENEMY_PLANE_SIZE, COLOR_ENEMY_PLANE } from '../config/Constants';

// Cat color palettes for variety
const CAT_COLORS = [
    { fur: 0xFF8C00, stripes: 0x8B4513, name: 'orange' },      // Orange tabby
    { fur: 0x000000, stripes: 0x1a1a1a, name: 'black' },       // Black cat
    { fur: 0xFFFFFF, stripes: 0xE0E0E0, name: 'white' },       // White cat
    { fur: 0x808080, stripes: 0x505050, name: 'gray' },        // Gray cat
    { fur: 0xD2691E, stripes: 0x8B4513, name: 'brown' },       // Brown tabby
    { fur: 0xF5DEB3, stripes: 0xD2B48C, name: 'siamese' },     // Siamese
    { fur: 0x4A4A4A, stripes: 0x000000, name: 'tuxedo' },      // Tuxedo
];

export class EnemyPlane {
    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Graphics;
    private speed: number;
    public isDead: boolean = false;
    private catColor: typeof CAT_COLORS[0];

    constructor(scene: Phaser.Scene, x: number, y: number, speed: number) {
        this.scene = scene;
        this.speed = speed;
        this.catColor = CAT_COLORS[Math.floor(Math.random() * CAT_COLORS.length)];

        // Create enemy plane sprite (chasing from behind, facing right)
        this.sprite = this.createEnemyPlane(scene, x, y);
        scene.physics.add.existing(this.sprite);
        
        const body = this.sprite.body as Phaser.Physics.Arcade.Body;
        body.setVelocityX(speed); // Positive velocity to chase from behind
        body.setSize(ENEMY_PLANE_SIZE, ENEMY_PLANE_SIZE * 0.6);
    }

    private createEnemyPlane(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Graphics {
        const graphics = scene.add.graphics({ x, y });
        
        // Red enemy plane (facing right, chasing from behind)
        graphics.fillStyle(COLOR_ENEMY_PLANE, 1);
        
        // Fuselage (facing right)
        graphics.fillRect(-20, -8, 45, 16);
        graphics.fillCircle(23, 0, 9); // rounded nose on right
        
        // Wings
        graphics.fillRect(-15, -18, 30, 36);
        
        // Tail (on left now)
        graphics.fillRect(-25, -6, 10, 12);
        graphics.fillRect(-27, -12, 8, 8); // tail fin
        
        // Propeller (on right, darker red)
        graphics.fillStyle(0x660000, 1);
        graphics.fillCircle(28, 0, 7);
        
        // Cat pilot (facing right, using random color)
        const catFur = this.catColor.fur;
        const catStripes = this.catColor.stripes;
        
        // Cat head (round)
        graphics.fillStyle(catFur, 1);
        graphics.fillCircle(5, -2, 10);
        
        // Pointy ears (triangular, facing right)
        graphics.beginPath();
        graphics.moveTo(2, -10);
        graphics.lineTo(6, -16);
        graphics.lineTo(10, -10);
        graphics.closePath();
        graphics.fillPath();
        
        graphics.beginPath();
        graphics.moveTo(-8, -10);
        graphics.lineTo(-4, -16);
        graphics.lineTo(0, -10);
        graphics.closePath();
        graphics.fillPath();
        
        // Inner ear (pink, facing right)
        graphics.fillStyle(0xFFB6C1, 1);
        graphics.beginPath();
        graphics.moveTo(4, -11);
        graphics.lineTo(6, -14);
        graphics.lineTo(8, -11);
        graphics.closePath();
        graphics.fillPath();
        
        graphics.beginPath();
        graphics.moveTo(-6, -11);
        graphics.lineTo(-4, -14);
        graphics.lineTo(-2, -11);
        graphics.closePath();
        graphics.fillPath();
        
        // Stripes or markings (if not white/black, facing right)
        if (this.catColor.name === 'orange' || this.catColor.name === 'brown') {
            graphics.lineStyle(2, catStripes, 1);
            graphics.lineBetween(2, -6, 8, -6);
            graphics.lineBetween(2, -2, 8, -2);
            graphics.lineBetween(2, 2, 8, 2);
        }
        
        // Snout/muzzle (lighter, on right side)
        const muzzleColor = catFur === 0x000000 ? 0x2a2a2a : 
                           catFur === 0xFFFFFF ? 0xFFFFFF : 
                           Phaser.Display.Color.GetColor(
                               Math.min(255, Phaser.Display.Color.IntegerToRGB(catFur).r + 40),
                               Math.min(255, Phaser.Display.Color.IntegerToRGB(catFur).g + 40),
                               Math.min(255, Phaser.Display.Color.IntegerToRGB(catFur).b + 40)
                           );
        graphics.fillStyle(muzzleColor, 1);
        graphics.fillCircle(8, 2, 6);
        
        // Nose (small black triangle, facing right)
        graphics.fillStyle(0x000000, 1);
        graphics.beginPath();
        graphics.moveTo(10, 0);
        graphics.lineTo(8, 3);
        graphics.lineTo(12, 3);
        graphics.closePath();
        graphics.fillPath();
        
        // Evil pilot goggles (red tinted, facing right)
        graphics.fillStyle(0x8B0000, 0.7);
        graphics.fillCircle(2, -3, 4);
        graphics.fillCircle(8, -3, 4);
        graphics.lineStyle(2, 0x8B0000, 1);
        graphics.strokeCircle(2, -3, 4);
        graphics.strokeCircle(8, -3, 4);
        graphics.lineBetween(4, -3, 6, -3); // bridge
        
        // Flight helmet (dark)
        graphics.fillStyle(0x2a2a2a, 1);
        graphics.fillEllipse(-5, -10, 12, 7);
        
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
