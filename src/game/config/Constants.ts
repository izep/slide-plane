import { PowerUpType, ObstacleType } from '../../types/GameTypes';

export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 768;

// Airplane constants
export const AIRPLANE_START_X = 150;
export const AIRPLANE_START_Y = GAME_HEIGHT / 2;
export const AIRPLANE_SPEED = 300; // pixels per second
export const AIRPLANE_SIZE = 50;

// Obstacle constants
export const OBSTACLE_START_SPEED = 200;
export const OBSTACLE_SPAWN_INTERVAL = 2000; // milliseconds
export const OBSTACLE_MIN_SPAWN_INTERVAL = 800;
export const OBSTACLE_SPAWN_DECREASE = 50; // decrease per level
export const OBSTACLE_SPEED_INCREASE = 10; // increase per level
export const OBSTACLE_MIN_SIZE = 30;
export const OBSTACLE_MAX_SIZE = 80;

// Difficulty constants
export const DIFFICULTY_INCREASE_INTERVAL = 10000; // every 10 seconds
export const MAX_DIFFICULTY_LEVEL = 10;

// Power-up constants
export const POWERUP_DURATION = 5000; // milliseconds
export const POWERUP_SPAWN_CHANCE = 0.15; // 15% chance
export const POWERUP_SPAWN_INTERVAL = 15000; // check every 15 seconds

export const BULLET_FIRE_RATE = 200; // milliseconds
export const ROCKET_FIRE_RATE = 500;
export const LASER_FIRE_RATE = 100;

export const PROJECTILE_SPEED = 600;
export const LASER_LENGTH = 200;

// Scoring constants
export const SCORE_PER_SECOND = 10;
export const SCORE_PER_OBSTACLE_PASSED = 50;
export const SCORE_PER_OBSTACLE_DESTROYED = 100;

// Colors
export const COLOR_AIRPLANE = 0x4488ff;
export const COLOR_OBSTACLE = 0xff4444;
export const COLOR_POWERUP_BULLET = 0xffff44;
export const COLOR_POWERUP_ROCKET = 0xff8844;
export const COLOR_POWERUP_LASER = 0x44ff44;
export const COLOR_PROJECTILE = 0xffffff;
export const COLOR_EXPLOSION = 0xff6600;

// Lives
export const STARTING_LIVES = 3;

// Storage keys
export const STORAGE_KEY_HIGH_SCORE = 'slide_plane_high_score';
export const STORAGE_KEY_SETTINGS = 'slide_plane_settings';
