# AGENTS.MD - AI Assistant Guidelines

## Repository Overview

This is a **Phaser 3 + React + TypeScript** side-scrolling airplane game where a dog pilot flies a WWII-style plane, avoiding obstacles and enemy cat pilots.

## Tech Stack

- **Game Engine**: Phaser 3.90.0
- **UI Framework**: React 19.0.0
- **Build Tool**: Vite 6.3.1
- **Language**: TypeScript 5.7.2
- **Testing**: Vitest 4.0.12
- **Deployment**: GitHub Pages

## Key Architecture Patterns

### Game Entities
All game entities follow this pattern:
- Return `Graphics`, `Container`, or `Rectangle` objects from `getSprite()`
- **DO NOT** use `.getBounds()` on Graphics objects - use physics body instead
- Always use physics bodies for collision detection

### Collision Detection
**CRITICAL**: Graphics objects don't have `.getBounds()` method!

```typescript
// ❌ WRONG - will cause runtime error
const bounds = sprite.getBounds();

// ✅ CORRECT - use physics body
const body = sprite.body as Phaser.Physics.Arcade.Body;
const bounds = new Phaser.Geom.Rectangle(
    sprite.x - body.width / 2,
    sprite.y - body.height / 2,
    body.width,
    body.height
);
```

### Scene Management
- `GameScene.ts` - Main game loop
- Entities are managed by Manager classes (ObstacleManager, PowerUpManager, etc.)
- EventBus handles communication between Phaser and React

## File Structure

```
src/
├── game/
│   ├── config/
│   │   └── Constants.ts          # All game constants
│   ├── entities/
│   │   ├── Airplane.ts           # Player (returns Container)
│   │   ├── Obstacle.ts           # Crates (returns Graphics)
│   │   ├── EnemyPlane.ts         # Cats (returns Graphics)
│   │   ├── PowerUp.ts            # Power-ups (returns Rectangle)
│   │   └── ...
│   ├── managers/
│   │   ├── ObstacleManager.ts    # Spawns/manages obstacles
│   │   ├── PowerUpManager.ts     # Spawns/manages power-ups
│   │   ├── EnemyPlaneManager.ts  # Spawns/manages enemies
│   │   └── ScoreManager.ts       # Score/lives/time tracking
│   └── scenes/
│       └── GameScene.ts          # Main game scene
├── components/
│   ├── GameHUD.tsx               # Score/distance/lives display
│   └── GameOver.tsx              # Game over screen
└── tests/
    ├── collision.test.ts         # Collision logic tests
    └── entities.test.ts          # Type safety tests
```

## Important Constants

See `src/game/config/Constants.ts` for all game values:
- `AIRPLANE_SPEED`, `AIRPLANE_SIZE` - Player settings
- `OBSTACLE_*` - Obstacle spawn rates and speeds
- `POWERUP_*` - Power-up spawn rates
- `DIFFICULTY_*` - Difficulty progression
- `COLOR_*` - All color constants

## Development Workflow

### Before Making Changes
```bash
npm run test:run      # Run tests
npm run type-check    # TypeScript validation
npm run lint          # Code style check
```

### Making Changes
1. Update types in `src/types/GameTypes.ts` if needed
2. Update constants in `src/game/config/Constants.ts`
3. Make code changes
4. Add/update tests in `src/tests/`
5. Run validation (above commands)

### After Every Change
**CRITICAL**: Test, commit, push, and deploy after EVERY request:
```bash
npm run test:run      # Must pass
npm run build-nolog   # Must succeed
git add .
git commit -m "Description of change"
git push
npm run deploy        # Deploy to GitHub Pages
```

### Testing Changes Locally
```bash
npm run dev           # Start dev server
# Test at http://localhost:8080
```

### Building and Deploying
```bash
npm run build-nolog   # Build for production
npm run deploy        # Deploy to GitHub Pages
```

## Common Patterns

### Creating New Entities
```typescript
export class NewEntity {
    private sprite: Phaser.GameObjects.Graphics;
    public isDead: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.sprite = this.createSprite(scene, x, y);
        scene.physics.add.existing(this.sprite);
    }

    update(delta: number): void {
        // Update logic
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
}
```

### Adding Event Listeners
```typescript
// In React component
useEffect(() => {
    const handler = (data: EventData) => {
        // Handle event
    };
    
    EventBus.on(Events.GAME_OVER, handler);
    
    return () => {
        EventBus.off(Events.GAME_OVER, handler);
    };
}, []);
```

### Spawning with Managers
```typescript
// In Manager class
private spawnTimer: number = 0;

update(delta: number): void {
    this.spawnTimer += delta;
    if (this.spawnTimer >= this.spawnInterval) {
        this.spawn();
        this.spawnTimer = 0;
    }
}
```

## Critical Rules

### ❌ Never Do
1. Call `.getBounds()` on Graphics objects
2. Modify Phaser objects after calling `.destroy()`
3. Create entities without physics bodies
4. Forget to clean up event listeners
5. Hard-code values (use Constants.ts)
6. Skip running tests before committing

### ✅ Always Do
1. Use physics body for collision bounds
2. Check `isDead` before updating entities
3. Clean up in `destroy()` methods
4. Use EventBus for Phaser ↔ React communication
5. Add tests for new features
6. Update version in package.json before deploying

## Graphics Creation

All graphics use `scene.add.graphics()`:

```typescript
const graphics = scene.add.graphics({ x, y });
graphics.fillStyle(COLOR_CONSTANT, 1);
graphics.fillRect(-width/2, -height/2, width, height);
// Don't call generateTexture unless creating a sprite
```

For sprites from graphics:
```typescript
graphics.generateTexture('textureName', width, height);
graphics.destroy();
const sprite = scene.add.sprite(x, y, 'textureName');
```

## Testing

### Unit Tests
Tests are in `src/tests/`. Run with:
```bash
npm run test          # Watch mode
npm run test:run      # Run once
npm run test:ui       # Interactive UI
npm run test:coverage # Coverage report
```

### Test Structure
```typescript
describe('Feature', () => {
    it('should do something', () => {
        // Arrange
        const input = setupInput();
        
        // Act
        const result = doSomething(input);
        
        // Assert
        expect(result).toBe(expected);
    });
});
```

## Pre-commit Hooks

Hooks run automatically on `git commit`:
1. Type checking
2. Linting
3. Unit tests

If any fail, commit is blocked. Fix issues before committing.

## Debugging

### Browser Console
- Open DevTools (F12)
- Check Console for errors
- Use breakpoints in Sources tab

### Common Issues
- **"getBounds is not a function"**: Using .getBounds() on Graphics object
- **Objects not colliding**: Physics body not set or wrong size
- **Events not firing**: EventBus listener not registered or wrong event name
- **Build fails**: Check TypeScript errors with `npm run type-check`

## Performance

### Entity Management
- Remove off-screen entities immediately
- Use object pooling for frequently spawned entities
- Set `isDead` flag to prevent updates

### Graphics
- Reuse textures when possible
- Destroy graphics after generating textures
- Limit particle counts

## Deployment

### Version Management
Always increment version in `package.json`:
```json
{
  "version": "1.0.2"  // Increment patch for bug fixes
}
```

### Cache Busting
Vite automatically hashes files. Users may need hard refresh:
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

## Resources

- [Phaser 3 Docs](https://photonstorm.github.io/phaser3-docs/)
- [Phaser Examples](https://phaser.io/examples)
- [Vitest Docs](https://vitest.dev/)
- [React Docs](https://react.dev/)

## Getting Help

When stuck:
1. Check browser console for errors
2. Review similar code in existing entities
3. Check Constants.ts for configurable values
4. Run tests to verify changes
5. Review BUGFIX.md for known issues

## Quick Reference

```bash
# Development
npm run dev           # Start dev server
npm run test          # Run tests in watch mode
npm run type-check    # Check TypeScript
npm run lint          # Lint code

# Building
npm run build-nolog   # Build for production
npm run deploy        # Deploy to GitHub Pages

# Testing
npm run test:run      # Run tests once
npm run test:coverage # Coverage report
npm run precommit     # Run all checks
```

---

**Remember**: Always test locally before deploying, and increment the version number!
