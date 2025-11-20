import { STORAGE_KEY_HIGH_SCORE, STORAGE_KEY_SETTINGS } from '../game/config/Constants';

export interface GameSettings {
    soundEnabled: boolean;
    musicEnabled: boolean;
    volume: number;
}

class StorageManagerClass {
    getHighScore(): number {
        const score = localStorage.getItem(STORAGE_KEY_HIGH_SCORE);
        return score ? parseInt(score, 10) : 0;
    }

    setHighScore(score: number): void {
        localStorage.setItem(STORAGE_KEY_HIGH_SCORE, score.toString());
    }

    getSettings(): GameSettings {
        const settings = localStorage.getItem(STORAGE_KEY_SETTINGS);
        if (settings) {
            return JSON.parse(settings);
        }
        return {
            soundEnabled: true,
            musicEnabled: true,
            volume: 0.7
        };
    }

    setSettings(settings: GameSettings): void {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    }

    clear(): void {
        localStorage.removeItem(STORAGE_KEY_HIGH_SCORE);
        localStorage.removeItem(STORAGE_KEY_SETTINGS);
    }
}

export const StorageManager = new StorageManagerClass();
