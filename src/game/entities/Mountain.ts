import Phaser from 'phaser';

export class Mountain {
    private sprite: Phaser.GameObjects.Graphics;
    private width: number;
    private height: number;
    public isDead: boolean = false;

    constructor(scene: Phaser.Scene, x: number, speed: number) {
        this.width = Phaser.Math.Between(150, 300);
        this.height = Phaser.Math.Between(80, 150);
        
        const y = scene.scale.height - this.height / 2;
        this.sprite = this.createMountain(scene, x, y);
        scene.physics.add.existing(this.sprite);
        
        const body = this.sprite.body as Phaser.Physics.Arcade.Body;
        body.setImmovable(true);
        body.setVelocityX(-speed);
    }

    private createMountain(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Graphics {
        const graphics = scene.add.graphics({ x, y });
        
        // Create mountain shape with multiple peaks
        const peaks = Phaser.Math.Between(2, 4);
        const peakWidth = this.width / peaks;
        
        graphics.fillStyle(0x8B7355, 1); // Brown mountain color
        graphics.beginPath();
        graphics.moveTo(-this.width / 2, this.height / 2);
        
        for (let i = 0; i < peaks; i++) {
            const peakX = -this.width / 2 + (i + 0.5) * peakWidth;
            const peakY = -this.height / 2 + Phaser.Math.Between(0, 20);
            graphics.lineTo(peakX, peakY);
        }
        
        graphics.lineTo(this.width / 2, this.height / 2);
        graphics.closePath();
        graphics.fillPath();
        
        // Add snow caps on peaks
        graphics.fillStyle(0xFFFFFF, 1);
        for (let i = 0; i < peaks; i++) {
            const peakX = -this.width / 2 + (i + 0.5) * peakWidth;
            const peakY = -this.height / 2 + Phaser.Math.Between(0, 20);
            graphics.fillTriangle(
                peakX - 15, peakY + 15,
                peakX, peakY,
                peakX + 15, peakY + 15
            );
        }
        
        return graphics;
    }

    update(): void {
        if (this.isDead) return;

        // Check if off screen (left side)
        if (this.sprite.x < -this.width) {
            this.destroy();
        }
    }

    getSprite(): Phaser.GameObjects.Graphics {
        return this.sprite;
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    destroy(): void {
        if (!this.isDead) {
            this.isDead = true;
            this.sprite.destroy();
        }
    }
}
