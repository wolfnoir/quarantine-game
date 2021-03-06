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
        if(game.cityName === "Manhattan"){
            var mapjs = this.cache.json.get('manhattanjs');
		    var presets = this.cache.json.get('tile-presets');
		    var actionjs = this.cache.json.get('tileactions');
		    game.city = new City(mapjs, presets, actionjs);
        }
        else if(game.cityName === "London"){
            var mapjs = this.cache.json.get('londonjs');
		    var presets = this.cache.json.get('tile-presets');
		    var actionjs = this.cache.json.get('tileactions');
		    game.city = new City(mapjs, presets, actionjs);
        }
        else{
            var mapjs = this.cache.json.get('seouljs');
            var presets = this.cache.json.get('tile-presets');
            var actionjs = this.cache.json.get('tileactions');
            game.city = new City(mapjs, presets, actionjs);
        }
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