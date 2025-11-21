import { PowerUpType } from '../../types/GameTypes';
import { POWERUP_DURATION, BULLET_FIRE_RATE, ROCKET_FIRE_RATE, LASER_FIRE_RATE } from '../config/Constants';

export class PowerUpFireController {
  private current: PowerUpType | null = null;
  private remaining: number = 0;
  private fireTimer: number = 0;

  activate(type: PowerUpType) {
    this.current = type;
    this.remaining = POWERUP_DURATION;
    this.fireTimer = 0;
  }

  update(delta: number) {
    if (this.current) {
      this.remaining -= delta;
      this.fireTimer += delta;
      if (this.remaining <= 0) {
        this.current = null;
        this.remaining = 0;
      }
    }
  }

  canFire(): boolean {
    return this.current !== null && this.fireTimer >= this.getFireRate();
  }

  consumeShot() { this.fireTimer = 0; }

  getCurrent() { return this.current; }
  getRemaining() { return this.remaining; }

  private getFireRate(): number {
    switch (this.current) {
      case PowerUpType.BULLET: return BULLET_FIRE_RATE;
      case PowerUpType.ROCKET: return ROCKET_FIRE_RATE;
      case PowerUpType.LASER: return LASER_FIRE_RATE;
      default: return 999999;
    }
  }
}
