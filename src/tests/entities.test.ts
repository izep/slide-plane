import { describe, it, expect } from 'vitest';
import { ObstacleType, PowerUpType } from '../types/GameTypes';

describe('Game Types', () => {
    it('should have correct obstacle types', () => {
        expect(ObstacleType.STATIC).toBeDefined();
        expect(ObstacleType.MOVING_VERTICAL).toBeDefined();
    });

    it('should have correct power-up types', () => {
        expect(PowerUpType.BULLET).toBeDefined();
        expect(PowerUpType.ROCKET).toBeDefined();
        expect(PowerUpType.LASER).toBeDefined();
    });
});


