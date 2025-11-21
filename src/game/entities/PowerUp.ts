import Phaser from 'phaser';
import { PowerUpType } from '../../types/GameTypes';
import { 
    COLOR_PROJECTILE,
    PROJECTILE_SPEED,
    LASER_LENGTH
} from '../config/Constants';

export class PowerUp {
    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Container;
    private type: PowerUpType;
    public isCollected: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, type: PowerUpType, speed: number) {
        this.scene = scene;
        this.type = type;

        this.sprite = this.createPowerUpSprite(scene, x, y, type);
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

    private createPowerUpSprite(scene: Phaser.Scene, x: number, y: number, type: PowerUpType): Phaser.GameObjects.Container {
        const textureName = `powerup-${type}`;
        const sprite = scene.add.sprite(0, 0, textureName);
        return scene.add.container(x, y, [sprite]);
    }

    update(): void {
        if (this.sprite.x < -30) {
            this.destroy();
        }
    }

    getSprite(): Phaser.GameObjects.Container {
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
    private _targetEnemy: any;
    public isDead: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, type: PowerUpType, targetEnemy?: any) {
        this.scene = scene;
        this.type = type;
        this._targetEnemy = targetEnemy;

        if (type === PowerUpType.LASER) {
            // Laser beam - make it more visible
            const graphics = scene.add.graphics();
            graphics.fillStyle(0x00FF00, 1);
            graphics.fillRect(0, -2, LASER_LENGTH, 4);
            graphics.generateTexture('laser-beam', LASER_LENGTH, 4);
            graphics.destroy();
            
            const line = scene.add.sprite(x, y, 'laser-beam');
            scene.physics.add.existing(line);
            this.sprite = line;
            
            // Laser fades quickly
            scene.tweens.add({
                targets: line,
                alpha: 0,
                duration: 300,
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

        const sprite = this.sprite as Phaser.GameObjects.Rectangle | Phaser.GameObjects.Sprite;
        
        // Rockets track nearest enemy
        if (this.type === PowerUpType.ROCKET && this._targetEnemy && !this._targetEnemy.isDead) {
            const body = sprite.body as Phaser.Physics.Arcade.Body;
            const targetSprite = this._targetEnemy.getSprite();
            
            // Calculate angle to target
            const angle = Phaser.Math.Angle.Between(
                sprite.x, sprite.y,
                targetSprite.x, targetSprite.y
            );
            
            // Update velocity to track target
            body.setVelocity(
                Math.cos(angle) * PROJECTILE_SPEED,
                Math.sin(angle) * PROJECTILE_SPEED
            );
            
            // Rotate sprite to face direction
            sprite.rotation = angle;
        }

        // Check if off screen
        if (sprite.x > this.scene.scale.width + 100 || sprite.x < -100 ||
            sprite.y > this.scene.scale.height + 100 || sprite.y < -100) {
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
