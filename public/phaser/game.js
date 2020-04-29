window.onload = function () {
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        backgroundColor: 0xFFFFFF,
        dom: {
            createContainer: true
        },
        scene: [SplashScreen, ControlScreen, DifficultyScreen, EndScreen, GameScreen, HelpScreen, LevelScreen, NameScreen, PauseScreen,  TitleScreen]
    }

    // Create the game with our config values
    // this will also inject our canvas element into the HTML source 
    // for us
    var game = new Phaser.Game(config);

    //Stores global variable with game data
    //Values are placeholders so far
    game.gameData = {
        diseaseName: "",
        threatLevel: 0,
        morale: 1,
        population: 100,
        infected: 1,
        infectivity: 0.05,
        severity: 0.01,
        lethality: 0.01,
        cure: 0,
        cureProgressPerDay: 0,
        energy: 1
    };
}