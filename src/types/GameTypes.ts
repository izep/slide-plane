export interface Position {
  x: number;
  y: number;
}

export enum PowerUpType {
  BULLET = 'bullet',
  ROCKET = 'rocket',
  LASER = 'laser'
}

export enum ObstacleType {
  STATIC = 'static',
  MOVING_VERTICAL = 'movingVertical',
  MOVING_HORIZONTAL = 'movingHorizontal'
}

export interface GameState {
  score: number;
  lives: number;
  isPlaying: boolean;
  isPaused: boolean;
  currentPowerUp: PowerUpType | null;
  powerUpTimeRemaining: number;
  highScore: number;
}

export interface ObstacleConfig {
  type: ObstacleType;
  speed: number;
  size: number;
  color: number;
}

export interface PowerUpConfig {
  type: PowerUpType;
  duration: number;
  fireRate: number;
}

export interface GameConfig {
  width: number;
  height: number;
  gravity: number;
  airplaneSpeed: number;
  obstacleSpeed: number;
  difficultyIncrease: number;
}

export interface EventData {
  [key: string]: any;
}
