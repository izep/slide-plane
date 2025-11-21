import { describe, it, expect } from 'vitest';
import { PowerUpFireController } from '../game/managers/PowerUpFireController';
import { PowerUpType } from '../types/GameTypes';

describe('PowerUpFireController', () => {
  it('enforces fire rate for bullet', () => {
    const ctrl = new PowerUpFireController();
    ctrl.activate(PowerUpType.BULLET);
    expect(ctrl.canFire()).toBe(false);
    ctrl['fireTimer'] = 250; // bullet fire rate 200
    expect(ctrl.canFire()).toBe(true);
    ctrl.consumeShot();
    expect(ctrl.canFire()).toBe(false);
  });

  it('expires after duration', () => {
    const ctrl = new PowerUpFireController();
    ctrl.activate(PowerUpType.ROCKET);
    ctrl.update(6000); // > POWERUP_DURATION
    expect(ctrl.getCurrent()).toBe(null);
  });
});
