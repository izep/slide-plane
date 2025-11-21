import { PowerUpType, ObstacleType } from '../../types/GameTypes';

export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 768;

// Airplane constants
export const AIRPLANE_START_X = 150;
export const AIRPLANE_START_Y = GAME_HEIGHT / 2;
export const AIRPLANE_SPEED = 400; // pixels per second - faster
export const AIRPLANE_SIZE = 60;

// Obstacle constants
export const OBSTACLE_START_SPEED = 300; // faster
export const OBSTACLE_SPAWN_INTERVAL = 1400; // more frequent
export const OBSTACLE_MIN_SPAWN_INTERVAL = 500; // much faster at high difficulty
export const OBSTACLE_SPAWN_DECREASE = 80; // decrease per level
export const OBSTACLE_SPEED_INCREASE = 20; // increase per level - faster scaling
export const OBSTACLE_MIN_SIZE = 40;
export const OBSTACLE_MAX_SIZE = 100;

// Enemy plane constants
export const ENEMY_PLANE_START_DIFFICULTY = 3; // level when enemy planes start
export const ENEMY_PLANE_SPEED = 250;
export const ENEMY_PLANE_SPAWN_INTERVAL = 8000; // every 8 seconds
export const ENEMY_PLANE_SIZE = 50;

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
export const COLOR_AIRPLANE = 0xcccccc; // silver/gray for WWII plane
export const COLOR_OBSTACLE = 0x8B4513; // brown for crates
export const COLOR_CLOUD = 0xf0f0f0;
export const COLOR_ENEMY_PLANE = 0x8B0000; // dark red
export const COLOR_POWERUP_BULLET = 0xffff44;
export const COLOR_POWERUP_ROCKET = 0xff8844;
export const COLOR_POWERUP_LASER = 0x44ff44;
export const COLOR_PROJECTILE = 0xffffff;
export const COLOR_EXPLOSION = 0xff6600;
export const COLOR_DOG_WHITE = 0xffffff;
export const COLOR_DOG_BLACK = 0x000000;
export const COLOR_GOGGLES = 0x8B4513;

// Lives
export const STARTING_LIVES = 3;

// Storage keys
export const STORAGE_KEY_HIGH_SCORE = 'slide_plane_high_score';
export const STORAGE_KEY_SETTINGS = 'slide_plane_settings';
