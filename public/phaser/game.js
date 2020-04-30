window.onload = function () {
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        backgroundColor: 0xFFFFFF,
        dom: {
            createContainer: true
        },
        scene: [SplashScreen, ControlScreen, DifficultyScreen, DefeatScreen, VictoryScreen, GameScreen, HelpScreen, LevelScreen, NameScreen, PauseScreen,  TitleScreen]
    }

    // Create the game with our config values
    // this will also inject our canvas element into the HTML source 
    // for us
    var game = new Phaser.Game(config);

    //Stores global variable with game data
    game.gameData = {
        name: "",
        threatLevel: 0,
        moraleLevel: 5,
        cure: 0,
        energy: 0,
        turn: 1,
    };

    //Will store main track so we can start or stop it at times
    game.music = null;

    //Stores effects for the current turn
    //Values will be modified by the below values upon transition to the next turn
    game.effects = null;

    //Stores actions that can be taken by player
    game.actions = [];

    //Contains all the data for the city including population and number of infected
    game.city = null;

    //Contains all variables relating to difficulty including diseaser parameters and cure progression
    game.difficulty = null;

    game.resetData = function() {
        game.gameData = {
            threatLevel: 0,
            moraleLevel: 5,
            cure: 0,
            energy: 0,
            turn: 1,
        };
    }

    game.resetAll = function() {
        game.gameData = {
            name: "",
            threatLevel: 0,
            moraleLevel: 5,
            cure: 0,
            energy: 0,
            turn: 1,
        };

        //Will store main track so we can start or stop it at times
        game.effects = null;
        game.actions = [];
        game.city = null;
        game.difficulty = null;
    }
}