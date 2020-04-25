// import SplashScreen from "./screens/SplashScreen";
// import TitleScreen from "./screens/TitleScreen";
// import ControlScreen from "./screens/ControlScreen";
// import HelpScreen from "./screens/HelpScreen";
// import DifficultyScreen from "./screens/DifficultyScreen";
// import LevelScreen from "./screens/LevelScreen";
// import NameScreen from "./screens/NameScreen";
// import GameScreen from "./screens/GameScreen";
// import PauseScreen from "./screens/PauseScreen";
// import EndScreen from "./screens/EndScreen";

// Our various game scenes, all neatly packed up.
// var splashScreen = new SplashScreen();
// var titleScreen = new TitleScreen();
// var controlScreen = new ControlScreen();
// var helpScreen = new HelpScreen();
// var difficultyScreen = new DifficultyScreen();
// var levelScreen = new LevelScreen();
// var nameScreen = new NameScreen();
// var gameScreen = new GameScreen();
// var pauseScreen = new PauseScreen();
// var endScreen = new EndScreen();

// const SPLASH_SCREEN = 'splashScreen',
//     TITLE_SCREEN = 'titleScreen',
//     CONTROL_SCREEN = 'controlScreen',
//     HELP_SCREEN = 'helpScreen',
//     DIFFICULTY_SCREEN = 'difficultyScreen',
//     LEVEL_SCREEN = 'levelScreen',
//     NAME_SCREEN = 'nameScreen',
//     GAME_SCREEN = 'game',
//     PAUSE_SCREEN = 'pauseScreen',
//     END_SCREEN = 'endScreen';

var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 700,
    backgroundColor: 0x000000,
    scene: [ControlScreen, DifficultyScreen, EndScreen, GameScreen, HelpScreen, LevelScreen, NameScreen, PauseScreen, SplashScreen, TitleScreen]
};

// Create the game with our config values
// this will also inject our canvas element into the HTML source 
// for us
var game = new Phaser.Game(config);

// Add the scenes to the game
// game.scene.add(SPLASH_SCREEN, splashScreen);
// game.scene.add(TITLE_SCREEN, titleScreen);
// game.scene.add(CONTROL_SCREEN, controlScreen);
// game.scene.add(HELP_SCREEN, helpScreen);
// game.scene.add(DIFFICULTY_SCREEN, difficultyScreen);
// game.scene.add(LEVEL_SCREEN, levelScreen);
// game.scene.add(NAME_SCREEN, nameScreen);
// game.scene.add(GAME_SCREEN, gameScreen);
// game.scene.add(PAUSE_SCREEN, pauseScreen);
// game.scene.add(END_SCREEN, endScreen);

// // start with splash screen
// game.scene.start(SPLASH_SCREEN);