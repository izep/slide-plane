# ✈️ Slide Plane

A fast-paced side-scrolling airplane game built with Phaser 3, React, and TypeScript. Dodge obstacles, collect power-ups, and survive as long as you can!

## 🎮 Game Features

- **Simple Controls**: Move your mouse up/down on desktop, or touch/swipe on mobile to control the airplane
- **Progressive Difficulty**: Obstacles spawn faster and move quicker as you survive longer
- **Power-Up System**: Collect three types of power-ups to destroy obstacles:
  - 🟡 **Bullets**: Rapid-fire projectiles
  - 🟠 **Rockets**: Explosive projectiles
  - 🟢 **Laser**: Continuous beam weapon
- **Animated Effects**: Explosions, power-up collection animations, and crash sequences
- **Score Tracking**: Earn points for survival time and destroying obstacles
- **High Score**: Your best score is saved locally
- **Lives System**: Start with 3 lives, lose one per collision
- **Mobile Responsive**: Full touch support for tablets and phones

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/izep/slide-plane.git
cd slide-plane

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:8080`

### Building for Production

```bash
# Build the game
npm run build

# The built files will be in the dist/ directory
```

## 🎯 How to Play

1. **Start the Game**: Click "START GAME" from the main menu
2. **Control Your Airplane**: 
   - **Desktop**: Move your mouse up and down
   - **Mobile**: Touch and drag or swipe up and down
3. **Avoid Obstacles**: Red squares are obstacles - don't hit them!
4. **Collect Power-Ups**: Grab colored squares to activate weapons for 5 seconds
5. **Survive**: The game gets harder over time - how long can you last?

## 📝 Game Mechanics

### Scoring

- **Survival**: +10 points per second
- **Pass Obstacle**: +50 points per obstacle passed
- **Destroy Obstacle**: +100 points per obstacle destroyed with power-ups

### Difficulty Scaling

Every 10 seconds:
- Obstacles spawn more frequently
- Obstacles move faster
- More obstacle variety (moving obstacles appear at higher difficulty levels)

### Power-Ups

- **Duration**: Each power-up lasts 5 seconds
- **Spawn Rate**: Power-ups have a 15% chance to spawn every 15 seconds
- **Types**:
  - Bullets: Fire rate 200ms
  - Rockets: Fire rate 500ms, larger projectiles
  - Lasers: Fire rate 100ms, instant-hit beam

## 🛠️ Technology Stack

- **Phaser 3**: HTML5 game framework for 2D games
- **React 19**: UI components and state management
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **LocalStorage**: Save high scores and settings

## 📁 Project Structure

```
src/
├── components/          # React UI components
│   ├── MainMenu.tsx    # Start screen
│   ├── GameUI.tsx      # HUD overlay
│   └── GameOver.tsx    # End game screen
├── game/               # Phaser game logic
│   ├── scenes/         # Game scenes
│   │   └── GameScene.ts
│   ├── entities/       # Game objects
│   │   ├── Airplane.ts
│   │   ├── Obstacle.ts
│   │   └── PowerUp.ts
│   ├── managers/       # Game systems
│   │   ├── ObstacleManager.ts
│   │   ├── PowerUpManager.ts
│   │   └── ScoreManager.ts
│   └── config/         # Configuration
│       └── Constants.ts
├── utils/              # Utility functions
│   ├── EventBus.ts    # React-Phaser communication
│   └── StorageManager.ts
└── types/              # TypeScript definitions
    └── GameTypes.ts
```

## 🎨 Customization

Game parameters can be adjusted in `src/game/config/Constants.ts`:

- Airplane speed
- Obstacle spawn rates and speeds
- Power-up duration and fire rates
- Scoring values
- Difficulty progression

## 📜 License

MIT License - feel free to use this project for learning or as a base for your own games!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👨‍💻 Author

**izep**

- GitHub: [@izep](https://github.com/izep)

## 🙏 Acknowledgments

- Phaser 3 game framework
- React and TypeScript communities
- Inspired by classic side-scrolling games

---

Made with ❤️ and lots of ☕
