# GitHub Copilot Instructions for Slide Plane

This is a **Phaser 3 + React + TypeScript** side-scrolling airplane game. Use these instructions to understand the codebase and make appropriate suggestions.

## Tech Stack

- **Game Engine**: Phaser 3.90.0
- **UI Framework**: React 19.0.0
- **Build Tool**: Vite 6.3.1
- **Language**: TypeScript 5.7.2
- **Testing**: Vitest 4.0.12

## Architecture

### Game Entities Pattern
All game entities (Airplane, Obstacle, EnemyPlane, PowerUp) follow this pattern:
- Return `Graphics`, `Container`, or `Rectangle` objects from `getSprite()`
- Include an `isDead: boolean` flag
- Implement `update(delta: number)`, `getSprite()`, and `destroy()` methods
- Use physics bodies for collision detection

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
- Entities managed by Manager classes (ObstacleManager, PowerUpManager, EnemyPlaneManager)
- EventBus handles Phaser ↔ React communication

## File Organization

```
src/
├── game/
│   ├── config/Constants.ts      # All game constants - use these instead of hard-coding
│   ├── entities/                # Player, obstacles, enemies, power-ups
│   ├── managers/                # Spawning and lifecycle management
│   └── scenes/GameScene.ts      # Main game loop
├── components/                  # React UI components (HUD, menus)
├── utils/                       # EventBus, storage
└── types/GameTypes.ts           # Type definitions
```

## Critical Rules

### Never:
1. Call `.getBounds()` on Graphics objects - use physics body instead
2. Modify Phaser objects after calling `.destroy()`
3. Create entities without physics bodies
4. Hard-code values - use `Constants.ts`
5. Skip running tests before committing

### Always:
1. Use physics body for collision bounds
2. Check `isDead` before updating entities
3. Clean up in `destroy()` methods
4. Use EventBus for Phaser ↔ React communication
5. Add tests for new features
6. Update constants in `Constants.ts` for game values

## Development Commands

```bash
npm run dev           # Start dev server
npm run test:run      # Run tests
npm run type-check    # TypeScript validation
npm run build-nolog   # Build for production
```

## Testing

- Tests in `src/tests/`
- Use Vitest with jsdom environment
- Test structure: Arrange → Act → Assert
- Must pass before committing (enforced by pre-commit hook)

## Common Patterns

### Creating Entities
```typescript
export class NewEntity {
    private sprite: Phaser.GameObjects.Graphics;
    public isDead: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.sprite = this.createSprite(scene, x, y);
        scene.physics.add.existing(this.sprite);
    }

    update(delta: number): void { /* ... */ }
    getSprite(): Phaser.GameObjects.Graphics { return this.sprite; }
    destroy(): void {
        if (!this.isDead) {
            this.isDead = true;
            this.sprite.destroy();
        }
    }
}
```

### Graphics Creation
```typescript
const graphics = scene.add.graphics({ x, y });
graphics.fillStyle(COLOR_CONSTANT, 1);
graphics.fillRect(-width/2, -height/2, width, height);
// Don't call generateTexture unless creating a sprite
```

### React Event Handlers
```typescript
useEffect(() => {
    const handler = (data: EventData) => { /* ... */ };
    EventBus.on(Events.GAME_OVER, handler);
    return () => EventBus.off(Events.GAME_OVER, handler);
}, []);
```

## Code Style

- Use TypeScript strict mode
- Follow existing naming conventions
- Prefer const over let
- Use arrow functions for callbacks
- Clean up resources in useEffect cleanup functions

## Performance

- Remove off-screen entities immediately
- Set `isDead` flag to prevent updates
- Reuse textures when possible
- Limit particle counts

For more details, see `AGENTS.md` in the repository root.
