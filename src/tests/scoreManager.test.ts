import { describe, it, expect } from 'vitest';
import { ScoreManager } from '../game/managers/ScoreManager';

describe('ScoreManager', () => {
  it('increments score and updates high score', () => {
    const sm = new ScoreManager();
    const initialHigh = sm.getHighScore();
    sm.addScore(5000);
    expect(sm.getScore()).toBeGreaterThanOrEqual(5000);
    if (initialHigh < 5000) {
      expect(sm.getHighScore()).toBe(sm.getScore());
    }
  });

  it('loses lives and detects game over', () => {
    const sm = new ScoreManager();
    expect(sm.isGameOver()).toBe(false);
    for (let i = 0; i < 3; i++) sm.loseLife();
    expect(sm.isGameOver()).toBe(true);
  });
});
