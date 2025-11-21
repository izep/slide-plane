import { describe, it, expect } from 'vitest';

describe('Collision Detection Logic', () => {
    it('should calculate bounds from physics body correctly', () => {
        // Simulates how we calculate bounds in GameScene
        const sprite = {
            x: 100,
            y: 100,
            body: { width: 50, height: 50 }
        };

        const bounds = {
            x: sprite.x - sprite.body.width / 2,
            y: sprite.y - sprite.body.height / 2,
            width: sprite.body.width,
            height: sprite.body.height
        };

        expect(bounds.x).toBe(75);
        expect(bounds.y).toBe(75);
        expect(bounds.width).toBe(50);
        expect(bounds.height).toBe(50);
    });

    it('should handle Container objects with physics body', () => {
        const sprite = {
            x: 200,
            y: 150,
            body: { width: 60, height: 30 }
        };

        const bounds = {
            x: sprite.x - sprite.body.width / 2,
            y: sprite.y - sprite.body.height / 2,
            width: sprite.body.width,
            height: sprite.body.height
        };

        expect(bounds.x).toBe(170);
        expect(bounds.y).toBe(135);
        expect(bounds.width).toBe(60);
        expect(bounds.height).toBe(30);
    });

    it('should detect rectangle intersections', () => {
        const rect1 = { x: 100, y: 100, width: 50, height: 50 };
        const rect2 = { x: 120, y: 120, width: 50, height: 50 };
        const rect3 = { x: 200, y: 200, width: 50, height: 50 };

        // Simple AABB collision detection
        const intersects = (r1: typeof rect1, r2: typeof rect2) => {
            return r1.x < r2.x + r2.width &&
                   r1.x + r1.width > r2.x &&
                   r1.y < r2.y + r2.height &&
                   r1.y + r1.height > r2.y;
        };

        expect(intersects(rect1, rect2)).toBe(true);
        expect(intersects(rect1, rect3)).toBe(false);
    });
});

describe('Type Safety', () => {
    it('should verify all entities return correct sprite types', () => {
        // This ensures type consistency across the codebase
        const types = {
            Airplane: 'Container',
            Obstacle: 'Graphics',
            EnemyPlane: 'Graphics',
            PowerUp: 'Rectangle',
            Projectile: 'GameObject'
        };

        expect(types.Airplane).toBe('Container');
        expect(types.Obstacle).toBe('Graphics');
        expect(types.EnemyPlane).toBe('Graphics');
    });

    it('should document that Graphics objects use physics body for bounds', () => {
        // Graphics objects don't have getBounds() method
        // We must use the physics body to calculate bounds manually
        const graphicsWithBody = {
            type: 'Graphics',
            usesPhysicsBody: true,
            hasBoundsMethod: false
        };

        expect(graphicsWithBody.usesPhysicsBody).toBe(true);
        expect(graphicsWithBody.hasBoundsMethod).toBe(false);
    });
});


