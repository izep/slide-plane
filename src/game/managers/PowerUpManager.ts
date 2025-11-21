import Phaser from 'phaser';
import { PowerUp, Projectile } from '../entities/PowerUp';
import { PowerUpType } from '../../types/GameTypes';
import { EventBus, Events } from '../../utils/EventBus';
import {
    POWERUP_SPAWN_CHANCE,
    POWERUP_SPAWN_INTERVAL,
    POWERUP_DURATION,
    BULLET_FIRE_RATE,
    ROCKET_FIRE_RATE,
    LASER_FIRE_RATE,
    OBSTACLE_START_SPEED
} from '../config/Constants';

export class PowerUpManager {
    private scene: Phaser.Scene;
    private powerUps: PowerUp[] = [];
    private projectiles: Projectile[] = [];
    private spawnTimer: number = 0;
    private currentPowerUp: PowerUpType | null = null;
    private powerUpTimeRemaining: number = 0;
    private fireTimer: number = 0;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    update(delta: number): void {
        // Update spawn timer
        this.spawnTimer += delta;
        if (this.spawnTimer >= POWERUP_SPAWN_INTERVAL) {
            if (Math.random() < POWERUP_SPAWN_CHANCE) {
                console.log('[PowerUpManager] Spawning power-up');
                this.spawnPowerUp();
            } else {
                console.log('[PowerUpManager] Power-up spawn chance missed');
            }
            this.spawnTimer = 0;
        }
        
        if (Math.floor(this.spawnTimer / 1000) % 3 === 0 && this.spawnTimer > 1000 && this.spawnTimer < 1100) {
            console.log('[PowerUpManager] Time until next spawn chance:', Math.floor((POWERUP_SPAWN_INTERVAL - this.spawnTimer) / 1000), 's');
        }

        // Update power-ups
        this.powerUps.forEach(powerUp => powerUp.update());
        this.powerUps = this.powerUps.filter(powerUp => !powerUp.isCollected);

        // Update projectiles
        this.projectiles.forEach(projectile => projectile.update());
        this.projectiles = this.projectiles.filter(projectile => !projectile.isDead);

        // Update active power-up timer
        if (this.currentPowerUp) {
            this.powerUpTimeRemaining -= delta;
            this.fireTimer += delta;

            if (this.powerUpTimeRemaining <= 0) {
                this.currentPowerUp = null;
                this.powerUpTimeRemaining = 0;
                // Emit event that powerup expired
                EventBus.emit(Events.POWERUP_EXPIRED);
            }
        }
    }

    private spawnPowerUp(): void {
        const types = [PowerUpType.BULLET, PowerUpType.ROCKET, PowerUpType.LASER];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const x = this.scene.scale.width + 30;
        const y = Phaser.Math.Between(50, this.scene.scale.height - 50);

        const powerUp = new PowerUp(this.scene, x, y, type, OBSTACLE_START_SPEED);
        this.powerUps.push(powerUp);
    }

    activatePowerUp(type: PowerUpType): void {
        this.currentPowerUp = type;
        this.powerUpTimeRemaining = POWERUP_DURATION;
        this.fireTimer = 0;
    }

    canFire(): boolean {
        if (!this.currentPowerUp) return false;

        const fireRate = this.getFireRate();
        return this.fireTimer >= fireRate;
    }

    fireProjectile(x: number, y: number, enemies: any[]): Projectile | null {
        if (!this.canFire() || !this.currentPowerUp) return null;

        // For rockets, find nearest enemy to track
        let targetEnemy = null;
        if (this.currentPowerUp === PowerUpType.ROCKET && enemies.length > 0) {
            // Find nearest non-dead enemy
            const aliveEnemies = enemies.filter(e => !e.isDead);
            if (aliveEnemies.length > 0) {
                targetEnemy = aliveEnemies.reduce((nearest, enemy) => {
                    const enemySprite = enemy.getSprite();
                    const dist = Phaser.Math.Distance.Between(x, y, enemySprite.x, enemySprite.y);
                    const nearestSprite = nearest.getSprite();
                    const nearestDist = Phaser.Math.Distance.Between(x, y, nearestSprite.x, nearestSprite.y);
                    return dist < nearestDist ? enemy : nearest;
                });
            }
        }

        const projectile = new Projectile(this.scene, x, y, this.currentPowerUp, targetEnemy);
        this.projectiles.push(projectile);
        this.fireTimer = 0;

        return projectile;
    }

    private getFireRate(): number {
        switch (this.currentPowerUp) {
            case PowerUpType.BULLET: return BULLET_FIRE_RATE;
            case PowerUpType.ROCKET: return ROCKET_FIRE_RATE;
            case PowerUpType.LASER: return LASER_FIRE_RATE;
            default: return 1000;
        }
    }

    getPowerUps(): PowerUp[] {
        return this.powerUps;
    }

    getProjectiles(): Projectile[] {
        return this.projectiles;
    }

    getCurrentPowerUp(): PowerUpType | null {
        return this.currentPowerUp;
    }

    getPowerUpTimeRemaining(): number {
        return this.powerUpTimeRemaining;
    }

    getTimeUntilNextPowerUp(): number {
        const timeRemaining = Math.max(0, POWERUP_SPAWN_INTERVAL - this.spawnTimer);
        return timeRemaining;
    }

    removeProjectile(projectile: Projectile): void {
        const index = this.projectiles.indexOf(projectile);
        if (index !== -1) {
            projectile.destroy();
            this.projectiles.splice(index, 1);
        }
    }

    reset(): void {
        this.powerUps.forEach(powerUp => powerUp.destroy());
        this.projectiles.forEach(projectile => projectile.destroy());
        this.powerUps = [];
        this.projectiles = [];
        this.spawnTimer = 0;
        this.currentPowerUp = null;
        this.powerUpTimeRemaining = 0;
        this.fireTimer = 0;
    }
}
