import { EventData } from '../types/GameTypes';

type EventCallback = (data?: EventData) => void;

class EventBusClass {
    private events: Map<string, EventCallback[]>;

    constructor() {
        this.events = new Map();
    }

    on(event: string, callback: EventCallback): void {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)!.push(callback);
    }

    off(event: string, callback: EventCallback): void {
        const callbacks = this.events.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(event: string, data?: EventData): void {
        const callbacks = this.events.get(event);
        if (callbacks) {
            callbacks.forEach(callback => callback(data));
        }
    }

    removeAll(): void {
        this.events.clear();
    }
}

export const EventBus = new EventBusClass();

// Event names
export const Events = {
    GAME_START: 'game-start',
    GAME_OVER: 'game-over',
    GAME_PAUSE: 'game-pause',
    GAME_RESUME: 'game-resume',
    SCORE_UPDATE: 'score-update',
    LIVES_UPDATE: 'lives-update',
    POWERUP_COLLECTED: 'powerup-collected',
    POWERUP_EXPIRED: 'powerup-expired',
    OBSTACLE_DESTROYED: 'obstacle-destroyed',
    HIGH_SCORE_UPDATE: 'high-score-update'
};
