# Testing & Pre-Commit Hooks

## Overview

This project includes automated testing and pre-commit hooks to ensure code quality before committing changes.

## Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Pre-Commit Checks

Before committing code, the following checks run automatically:

1. **Type Checking** - Ensures TypeScript types are correct
2. **Linting** - Checks code style and potential errors
3. **Tests** - Runs all unit tests

### Manual Pre-Commit Check

```bash
npm run precommit
```

## Test Structure

Tests are located in `src/tests/`:

- `collision.test.ts` - Tests collision detection logic
- `entities.test.ts` - Tests game type definitions

## Key Bug Fix

This test suite was created to prevent the recurrence of a critical bug:

**Issue**: `TypeError: t.getSprite(...).getBounds is not a function`

**Root Cause**: Phaser `Graphics` objects don't have a `getBounds()` method like other game objects.

**Solution**: Use the physics body to manually calculate bounds:
```typescript
const bounds = new Phaser.Geom.Rectangle(
    sprite.x - body.width / 2,
    sprite.y - body.height / 2,
    body.width,
    body.height
);
```

## CI/CD Integration

The pre-commit hook ensures that:
- All code is type-safe
- Code follows linting rules
- All tests pass

This prevents broken code from being committed to the repository.

## Development Workflow

1. Make your changes
2. Run tests: `npm test`
3. Commit your changes
4. Pre-commit hook runs automatically
5. If checks pass, commit succeeds
6. If checks fail, fix issues and try again

## Important Note

**NODE_ENV**: Ensure `NODE_ENV` is not set to `production` during development, as this prevents devDependencies from being installed.

```powershell
# Windows PowerShell
$env:NODE_ENV='development'
npm install

# Or remove the variable
Remove-Item Env:\NODE_ENV
npm install
```
