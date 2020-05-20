window.onload = function () {
    var config = {
        type: Phaser.AUTO,
        width: 1000,
        height: 700,
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
    game.mute = false;

    //Stores effects for the current turn
    //Values will be modified by the below values upon transition to the next turn
    game.effects = new Effects();

    //Stores actions that can be taken by player
    game.actions = [];

    //Contains all the data for the city including population and number of infected
    game.city = null;

    //saves the city name of the game
    game.cityName = "";

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

        game.effects.clear();
        game.city.reset();

        for(let i = 0; i < game.actions.length; i++)
            game.actions[i].reset();
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
        game.effects.clear();
        game.actions = [];
        game.city = null;
        game.cityName = "";
        game.difficulty = null;
    }
}