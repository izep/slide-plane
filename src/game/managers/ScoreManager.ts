import {
    SCORE_PER_SECOND,
    SCORE_PER_OBSTACLE_PASSED,
    SCORE_PER_OBSTACLE_DESTROYED,
    STARTING_LIVES
} from '../config/Constants';
import { StorageManager } from '../../utils/StorageManager';
import { EventBus, Events } from '../../utils/EventBus';

export class ScoreManager {
    private score: number = 0;
    private lives: number = STARTING_LIVES;
    private highScore: number = 0;
    private timeSurvived: number = 0;

    constructor() {
        this.highScore = StorageManager.getHighScore();
    }

    update(delta: number): void {
        // Add time-based score
        this.timeSurvived += delta;
        const timeScore = (delta / 1000) * SCORE_PER_SECOND;
        this.addScore(timeScore);
    }

    addScore(points: number): void {
        this.score += Math.floor(points);
        EventBus.emit(Events.SCORE_UPDATE, { score: this.score });

        if (this.score > this.highScore) {
            this.highScore = this.score;
            StorageManager.setHighScore(this.highScore);
            EventBus.emit(Events.HIGH_SCORE_UPDATE, { highScore: this.highScore });
        }
    }

    obstaclePass(): void {
        this.addScore(SCORE_PER_OBSTACLE_PASSED);
    }

    obstacleDestroyed(): void {
        this.addScore(SCORE_PER_OBSTACLE_DESTROYED);
        EventBus.emit(Events.OBSTACLE_DESTROYED);
    }

    loseLife(): void {
        this.lives--;
        EventBus.emit(Events.LIVES_UPDATE, { lives: this.lives });
    }

    getScore(): number {
        return this.score;
    }

    getLives(): number {
        return this.lives;
    }

    getHighScore(): number {
        return this.highScore;
    }

    getTimeSurvived(): number {
        return Math.floor(this.timeSurvived / 1000);
    }

    isGameOver(): boolean {
        return this.lives <= 0;
    }

    reset(): void {
        this.score = 0;
        this.lives = STARTING_LIVES;
        this.timeSurvived = 0;
        EventBus.emit(Events.SCORE_UPDATE, { score: this.score });
        EventBus.emit(Events.LIVES_UPDATE, { lives: this.lives });
    }
}
