import Phaser from 'phaser';
import { PowerUpType } from '../../types/GameTypes';
import { 
    COLOR_POWERUP_BULLET, 
    COLOR_POWERUP_ROCKET, 
    COLOR_POWERUP_LASER, 
    COLOR_PROJECTILE,
    PROJECTILE_SPEED,
    LASER_LENGTH
} from '../config/Constants';

export class PowerUp {
    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Rectangle;
    private type: PowerUpType;
    public isCollected: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, type: PowerUpType, speed: number) {
        this.scene = scene;
        this.type = type;

        const color = this.getColorForType(type);
        this.sprite = scene.add.rectangle(x, y, 30, 30, color);
        scene.physics.add.existing(this.sprite);
        
        const body = this.sprite.body as Phaser.Physics.Arcade.Body;
        body.setVelocityX(-speed);

        // Pulsing animation
        scene.tweens.add({
            targets: this.sprite,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    private getColorForType(type: PowerUpType): number {
        switch (type) {
            case PowerUpType.BULLET: return COLOR_POWERUP_BULLET;
            case PowerUpType.ROCKET: return COLOR_POWERUP_ROCKET;
            case PowerUpType.LASER: return COLOR_POWERUP_LASER;
        }
    }

    update(): void {
        if (this.sprite.x < -30) {
            this.destroy();
        }
    }

    getSprite(): Phaser.GameObjects.Rectangle {
        return this.sprite;
    }

    getType(): PowerUpType {
        return this.type;
    }

    collect(): void {
        if (this.isCollected) return;
        
        this.isCollected = true;

        // Collection animation
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                this.sprite.destroy();
            }
        });
    }

    destroy(): void {
        if (!this.isCollected) {
            this.isCollected = true;
            this.sprite.destroy();
        }
    }
}

export class Projectile {
    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.GameObject;
    private type: PowerUpType;
    public isDead: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, type: PowerUpType) {
        this.scene = scene;
        this.type = type;

        if (type === PowerUpType.LASER) {
            // Laser is a line
            const line = scene.add.rectangle(x, y, LASER_LENGTH, 4, COLOR_PROJECTILE);
            scene.physics.add.existing(line);
            this.sprite = line;
            
            // Laser fades quickly
            scene.tweens.add({
                targets: line,
                alpha: 0,
                duration: 200,
                onComplete: () => {
                    this.isDead = true;
                    line.destroy();
                }
            });
        } else {
            // Bullet or Rocket
            const size = type === PowerUpType.ROCKET ? 12 : 6;
            const projectile = scene.add.rectangle(x, y, size * 2, size, COLOR_PROJECTILE);
            scene.physics.add.existing(projectile);
            
            const body = projectile.body as Phaser.Physics.Arcade.Body;
            body.setVelocityX(PROJECTILE_SPEED);
            
            this.sprite = projectile;
        }
    }

    update(): void {
        if (this.isDead) return;

        const sprite = this.sprite as Phaser.GameObjects.Rectangle;
        if (sprite.x > this.scene.scale.width + 50) {
            this.destroy();
        }
    }

    getSprite(): Phaser.GameObjects.GameObject {
        return this.sprite;
    }

    getType(): PowerUpType {
        return this.type;
    }

    destroy(): void {
        if (!this.isDead) {
            this.isDead = true;
            (this.sprite as Phaser.GameObjects.Rectangle).destroy();
        }
    }
}
