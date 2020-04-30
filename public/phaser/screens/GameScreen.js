//Contains map information at the center of the screen.
//The tiles in the screen will be clickable and should display various information.
//Each tile will be highlighted with a color corresponding to how many people are infected.
//At the top of the screen is a bar display the stats of the game--threat level, morale level,
//and cure progress, as well as population and other relevant information. Below that is a scrolling
//newsfeed that displays random bits of news. On the left side of the screen will be a menu
//displaying all the possible actions the player will be able to take, as well as their corresponding
//energy points. A graphic at top should update according to how many energy points the player has left
//to spend this turn. On the bottom right is a 'next turn' button for the player to progress. For special
//events, a pop-up window will show up in the center of the screen. Pressing the escape key will allow the
//player to access the in-game menu.

class GameScreen extends Phaser.Scene {

	constructor() {
		super({key : 'gameScreen'});
	}

	init() {
		
	};

	preload() {
		//import tileset image and map json file
		this.load.image("tiles", "../../maps/tiles/quarantine-tiles.png");
		this.load.tilemapTiledJSON("map", "../../maps/manhattan.json");
		this.load.json("mapjs", "../../maps/manhattan.json");
		this.load.json("tile-presets", "../../maps/tile-presets.json");
		this.load.image('logo', 'assets/quarantine-logo.png');
		this.load.audio('chimeSFX', 'assets/sfx/soft-chime.wav');
		this.load.json("actions", "../../presets/actions.json");
	}

	create() {
		this.game.music.play()

		//Set up data structure for city
		var mapjs = this.cache.json.get('mapjs');
		var presets = this.cache.json.get('tile-presets');
		this.game.city = new City(mapjs, presets);
		var initialTiles = [6, 289];
		var virusAlgorithm = new VirusAlgorithm(initialTiles, this.game);

		//Set up actions
		var actionjs = this.cache.json.get('actions');
		this.game.actions = [];
		for(let i = 1; i <= 6; i++){
			var obj = new Action(actionjs[i.toString()]);
			this.game.actions.push(obj);
		}

		//Set up keyboard listener
		let s = this.scene;
		this.input.keyboard.on("keydown-ESC", function(event){
			s.start("pauseScreen");
		});

		const map = this.make.tilemap({ key: "map" });
		const tileset = map.addTilesetImage("QuarantineTiles", "tiles");
	
		this.groundLayer = map.createStaticLayer("Tile Layer", tileset, 0, 150);
		const camera = this.cameras.main;

		const cursors = this.input.keyboard.createCursorKeys();
		this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
		  camera: camera,
		  left: cursors.left,
		  right: cursors.right,
		  up: cursors.up,
		  down: cursors.down,
		  speed: 0.5
		});
	  
		camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels + 150);

		this.marker = this.add.graphics();
		this.marker.lineStyle(5, 0xffffff, 1);
		this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);
		this.marker.lineStyle(3, 0xff4f78, 1);
		this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);

		var group = this.add.group();
        //make the back of the message box
		var rec = this.add.rectangle(0, 0, this.game.config.width, 150, 0x001a24).setScrollFactor(0).setDepth(1);
		rec.setOrigin(0, 0);
		var dayCounterText = this.add.text(rec.x + 20, rec.y + 20, 'Day ' + this.game.gameData.turn + ' of outbreak',
			{fontFamily: '"Georgia"', fontSize: '25px', fontWeight: 'bold'}).setScrollFactor(0).setDepth(1);
		var populationText = this.add.text(rec.x + 20, rec.y + 50, 'Population: ' + this.game.city.getPopulation() +
			'\nConfirmed Infected: ' + this.game.city.getInfected() +
			'\nDeaths: ' + this.game.city.getDead(),
			{fontFamily: '"Georgia"', fontSize: '20px'}).setScrollFactor(0).setDepth(1);
		var logo = this.add.image(this.game.config.width/2 - 50, 70, 'logo');
		logo.setScale(0.1);
		logo.setScrollFactor(0).setDepth(1);
		
		var threatText = this.add.text(410, 25, 'Threat:',
			{fontFamily: '"Georgia"', fontSize: '20px'}).setScrollFactor(0).setDepth(1);
		var threatPercent = this.add.text(720, 25, '0%',
			{fontFamily: '"Georgia"', fontSize: '20px'}).setScrollFactor(0).setDepth(1);

		var progressBoxRed = this.add.graphics().setScrollFactor(0).setDepth(1);
		progressBoxRed.fillStyle(0x8c0000, 1);
		progressBoxRed.fillRoundedRect(500, 20, 200, 30, 10);

		var progressBarRed = this.add.graphics().setScrollFactor(0).setDepth(1);
		progressBarRed.fillStyle(0xff0000, 1);
		progressBarRed.fillRoundedRect(500, 20, 150, 30, 10);

		var moraleText = this.add.text(410, 65, 'Morale:',
			{fontFamily: '"Georgia"', fontSize: '20px'}).setScrollFactor(0).setDepth(1);
		var moralePercent = this.add.text(720, 65, Math.floor(this.game.city.getMorale() * 100) + '%',
			{fontFamily: '"Georgia"', fontSize: '20px'}).setScrollFactor(0).setDepth(1);

		var progressBoxGreen = this.add.graphics().setScrollFactor(0).setDepth(1);
		progressBoxGreen.fillStyle(0x245f24, 1);
		progressBoxGreen.fillRoundedRect(500, 60, 200, 30, 10);

		var progressBarGreen = this.add.graphics().setScrollFactor(0).setDepth(1);
		progressBarGreen.fillStyle(0x00ff00, 1);
		progressBarGreen.fillRoundedRect(500, 60, 100, 30, 10);

		var cureText = this.add.text(410, 105, 'Cure:',
			{fontFamily: '"Georgia"', fontSize: '20px'}).setScrollFactor(0).setDepth(1);
		var curePercent = this.add.text(720, 105, Math.floor(this.game.gameData.cure * 100) + '%',
			{fontFamily: '"Georgia"', fontSize: '20px'}).setScrollFactor(0).setDepth(1);

		var progressBoxBlue = this.add.graphics().setScrollFactor(0).setDepth(1);
		progressBoxBlue.fillStyle(0x034157, 1);
		progressBoxBlue.fillRoundedRect(500, 100, 200, 30, 10);

		var progressBarBlue = this.add.graphics().setScrollFactor(0).setDepth(1);
		progressBarBlue.fillStyle(0x31d5fd, 1);
		progressBarBlue.fillRoundedRect(500, 100, 33, 30, 10);
	
		var reduceInfectivityButton = new RectangleButton(this, 80, 180, 150, 50, 0xFFFFFF, 1, 'REDUCE\nINFECTIVITY').setDepth(1).setScrollFactor(0);
		reduceInfectivityButton.buttonText.setScrollFactor(0).setDepth(1);
		reduceInfectivityButton.on('pointerdown', () => this.game.actions[0].toggleTaken());

		var reduceSeverityButton = new RectangleButton(this, 80, 240, 150, 50, 0xFFFFFF, 1, 'REDUCE\nSEVERITY').setDepth(1).setScrollFactor(0);
		reduceSeverityButton.buttonText.setScrollFactor(0).setDepth(1);
		reduceSeverityButton.on('pointerdown', () => this.game.actions[1].toggleTaken());

		var reduceLethalityButton = new RectangleButton(this, 80, 300, 150, 50, 0xFFFFFF, 1, 'REDUCE\nLETHALITY').setDepth(1).setScrollFactor(0);
		reduceLethalityButton.buttonText.setScrollFactor(0).setDepth(1);
		reduceLethalityButton.on('pointerdown', () => this.game.actions[2].toggleTaken());

		var increaseRecoveryButton = new RectangleButton(this, 80, 360, 150, 50, 0xFFFFFF, 1, 'INCREASE\nRECOVERY').setDepth(1).setScrollFactor(0);
		increaseRecoveryButton.buttonText.setScrollFactor(0).setDepth(1);
		increaseRecoveryButton.on('pointerdown', () => this.game.actions[3].toggleTaken());

		var increaseMoraleButton = new RectangleButton(this, 80, 420, 150, 50, 0xFFFFFF, 1, 'BOOST\nMORALE').setDepth(1).setScrollFactor(0);
		increaseMoraleButton.buttonText.setScrollFactor(0).setDepth(1);
		increaseMoraleButton.on('pointerdown', () => this.game.actions[4].toggleTaken());

		var increaseCureButton = new RectangleButton(this, 80, 480, 150, 50, 0xFFFFFF, 1, 'BOOST\nCURE').setDepth(1).setScrollFactor(0);
		increaseCureButton.buttonText.setScrollFactor(0).setDepth(1);
		increaseCureButton.on('pointerdown', () => this.game.actions[5].toggleTaken());

		//get the energy required for today
		this.game.gameData.energy += this.game.difficulty.getEnergyToday(this.game.gameData.turn);

		var energyText = this.add.text(20, 550, 'Energy Available: ' + this.game.gameData.energy,
		{fontFamily: '"Georgia"', fontSize: '20px'}).setScrollFactor(0).setDepth(1);

		var nextTurnButton = new RectangleButton(this, 700, 550, 150, 50, 0xFFFFFF, 1, 'NEXT TURN').setDepth(1);
		nextTurnButton.setScrollFactor(0);
		nextTurnButton.buttonText.setScrollFactor(0).setDepth(1);
		nextTurnButton.on('pointerdown', () => this.nextTurn(virusAlgorithm, dayCounterText, populationText, threatPercent, moralePercent, curePercent, energyText));
	}

	update(time, delta) {
		// Apply the controls to the camera each update tick of the game
		this.controls.update(delta);

		var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

		// Place the marker in world space, but snap it to the tile grid. If we convert world -> tile and
		// then tile -> world, we end up with the position of the tile under the pointer
		var pointerTileXY = this.groundLayer.worldToTileXY(worldPoint.x, worldPoint.y);
		if (pointerTileXY.y >= 0) {
			var snappedWorldPoint = this.groundLayer.tileToWorldXY(pointerTileXY.x, pointerTileXY.y);
			var tile = this.groundLayer.getTileAtWorldXY(snappedWorldPoint.x, snappedWorldPoint.y);
			//console.log(this.game.city.getTile(tile.x, tile.y));
			this.marker.setPosition(snappedWorldPoint.x, snappedWorldPoint.y);
		}
	}
	tileClicked(tile){
		tile.setAlpha(0);
	}

	nextTurn(virusAlgorithm, dayCounterText, populationText, threatPercent, moralePercent, curePercent, energyText){
		//Sets up effects for the previous turn
		this.game.effects = new Effects();
		this.updateEffects();

		this.game.gameData.turn += 1;

		//run the virus turn
		virusAlgorithm.runVirusTurn();

		//change the text on the screen
		dayCounterText.setText('Day ' + this.game.gameData.turn + ' of outbreak');
		populationText.setText('Population: ' + this.game.city.getPopulation() +
		'\nConfirmed Infected: ' + this.game.city.getInfected() +
		'\nDeaths: ' + this.game.city.getDead(),);
		threatPercent.setText(Math.floor(this.game.gameData.threatLevel * 100) + "%");
		moralePercent.setText(Math.floor(this.game.city.getMorale() * 100) + '%');
		curePercent.setText(Math.floor(this.game.gameData.cure * 100) + '%');

		this.game.gameData.moraleLevel = this.game.city.getMorale();

		this.updateInfectedTint(virusAlgorithm);

		//Check end conditions
		this.end()

		this.game.effects = new Effects();

		//add new energy for the next day
		this.game.gameData.energy += this.game.difficulty.getEnergyToday(this.game.gameData.turn);
		energyText.setText('Energy Available: ' + this.game.gameData.energy);
	}

	
	//End conditions
	end() {
		if(this.game.city.getPopulation() == 0 || this.game.gameData.moraleLevel <= 0)
			this.scene.start("defeatScreen");

		else if(this.game.city.getInfected() == 0 || this.game.gameData.cure >= 1)
			this.scene.start("victoryScreen");
	}

	updateEffects(){
		//Adds all actions to effects
		for(let i = 0; i < this.game.actions.length; i++){
			let action = this.game.actions[i];
			
			if(action.hasBeenTaken()){
				this.game.effects.addAction(this.game.actions[i]);
				action.toggleTaken();
			}
		}
	}

	updateInfectedTint(virusAlgorithm){
		let infectedTiles = virusAlgorithm.infectedTiles;
		for(let i = 0; i < infectedTiles.length; i++){
			let index = infectedTiles[i];
			this.add.rectangle(index%20 * 50, Math.floor(index/20) * 50 + 150, 50, 50, 0xff0000, 0.2).setOrigin(0, 0).setDepth(0);
		}
	}
}