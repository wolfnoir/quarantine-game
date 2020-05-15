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
		super({ key: 'gameScreen' });
		this.energyText;
	}

	init() {

	};

	preload() {
		//import tileset image and map json file
		this.load.image("tiles", "../../maps/tiles/quarantine-tiles.png");

		//@TODO: add code that loads the appropriate map based on what the player has selected
		if (this.game.cityName === "Manhattan") {
			this.load.tilemapTiledJSON("map", "../../maps/manhattan.json");
			this.load.json("mapjs", "../../maps/manhattan.json");
		}
		else if (this.game.cityName === "London") {
			this.load.tilemapTiledJSON("map", "../../maps/london.json");
			this.load.json("mapjs", "../../maps/london.json");
		}
		else {
			this.load.tilemapTiledJSON("map", "../../maps/seoul.json");
			this.load.json("mapjs", "../../maps/seoul.json");
		}
		this.load.json("tile-presets", "../../maps/tile-presets.json");
		this.load.image('logo', 'assets/quarantine-logo.png');
		this.load.audio('chimeSFX', 'assets/sfx/soft-chime.wav');
		this.load.json("actions", "../../presets/actions.json");
	}

	//@TODO: for some reason, quitting from the pause menu and restarting the game does not clear the map from the cache.
	//see if we can fix this later.

	create() {
		this.game.music.play();
		this.currentEnergy = this.game.gameData.energy;

		//@TODO: add actual randomly generated starting positions based on the map
		var initialTiles = [6, 289];
		var virusAlgorithm = new VirusAlgorithm(initialTiles, this.game);

		//Set up actions
		var actionjs = this.cache.json.get('actions');
		this.game.actions = [];
		for (let i = 1; i <= 6; i++) {
			var obj = new Action(actionjs[i.toString()]);
			this.game.actions.push(obj);
		}

		//Set up keyboard listener
		let s = this.scene;
		this.input.keyboard.on("keydown-ESC", function (event) {
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

		//creates the marker to indicate where the player is hovering over tiles
		this.marker = this.add.graphics();
		this.marker.lineStyle(5, 0xffffff, 1);
		this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);
		this.marker.lineStyle(3, 0xff4f78, 1);
		this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);
		this.marker.setDepth(1);


		//create the infobox for hovering over tiles
		this.infoBox = this.add.rectangle(0, 0, 140, 50, 0xffffff).setOrigin(0, 0.5).setDepth(1);
		this.infoText = this.add.text(0, 0, "", { fontFamily: '"Courier New"', fontSize: '14px', fontWeight: 'bold', color: '#000000' }).setDepth(1);;

		//makes the top bar displaying information about threat, morale, and cure
		this.createTopBar();

		//create action buttons on the side
		this.createActionButtons();

		//get the energy required for today
		this.game.gameData.energy += this.game.difficulty.getEnergyToday(this.game.gameData.turn);

		this.energyText = this.add.text(20, 550, 'Energy Available: ' + this.game.gameData.energy,
			{ fontFamily: '"Georgia"', fontSize: '20px' }).setScrollFactor(0).setDepth(1);

		var nextTurnButton = new RectangleButton(this, 100, this.game.config.height - 50, 150, 50, 0xFFFFFF, 1, 'NEXT TURN').setDepth(1);
		nextTurnButton.setScrollFactor(0);
		nextTurnButton.buttonText.setScrollFactor(0).setDepth(1);
		nextTurnButton.on('pointerdown', () => this.nextTurn(virusAlgorithm, dayCounterText, populationText, threatPercent, moralePercent, curePercent,
			reduceInfectivityButton, reduceSeverityButton, reduceLethalityButton, increaseRecoveryButton, increaseMoraleButton, increaseCureButton));
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
			var tilePos = this.groundLayer.getTileAtWorldXY(snappedWorldPoint.x, snappedWorldPoint.y);

			//displays information about the tile the mouse is currently hovering over
			var tile = this.game.city.getTile(tilePos.x, tilePos.y);

			if (tile.isInfectable) {
				if (snappedWorldPoint.x + 250 > this.game.config.width) {
					this.infoBox.setPosition(snappedWorldPoint.x - 148, snappedWorldPoint.y + 25);
					this.infoText.setPosition(snappedWorldPoint.x - 146, snappedWorldPoint.y + 3);
				}
				else {
					this.infoBox.setPosition(snappedWorldPoint.x + 60, snappedWorldPoint.y + 25);
					this.infoText.setPosition(snappedWorldPoint.x + 62, snappedWorldPoint.y + 3);
				}

				this.infoText.setText("Population: " + tile.population + "\nInfected: " + tile.infected + "\nDead: " + tile.dead);
				//show the infobox
				this.infoBox.setAlpha(1);
				this.infoText.setAlpha(1);
			}
			else {
				//hide the infobox
				this.infoBox.setAlpha(0);
				this.infoText.setAlpha(0);
			}

			this.marker.setPosition(snappedWorldPoint.x, snappedWorldPoint.y);
		}

		var greenBar = this.game.gameData.progressBarGreen;
		greenBar.clear();
		greenBar.fillStyle(0x00ff00, 1);
		greenBar.fillRect(this.game.config.width - 300, 60, Math.floor(this.game.city.getMorale() * 200), 30);

		var blueBar = this.game.gameData.progressBarBlue;
		blueBar.clear();
		blueBar.fillStyle(0x31d5fd, 1);
		blueBar.fillRect(this.game.config.width - 300, 100, Math.floor(this.game.gameData.cure * 200), 30);

		this.energyText.setText('Energy Available: ' + this.game.gameData.energy);

	}
	tileClicked(tile) {
		tile.setAlpha(0);
	}

	nextTurn(virusAlgorithm, dayCounterText, populationText, threatPercent, moralePercent, curePercent,
		reduceInfectivityButton, reduceSeverityButton, reduceLethalityButton, increaseRecoveryButton, increaseMoraleButton, increaseCureButton) {
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
			'\nDeaths: ' + this.game.city.getDead());
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
		this.energyText.setText('Energy Available: ' + this.game.gameData.energy);

		//reset button colors
		reduceInfectivityButton.fillColor = 0xFFFFFF;
		reduceSeverityButton.fillColor = 0xFFFFFF;
		reduceLethalityButton.fillColor = 0xFFFFFF;
		increaseRecoveryButton.fillColor = 0xFFFFFF;
		increaseMoraleButton.fillColor = 0xFFFFFF;
		increaseCureButton.fillColor = 0xFFFFFF;
	}

	createActionButtons(){
		var reduceInfectivityButton = new RectangleButton(this, 80, 180, 150, 50, 0xFFFFFF, 1, 'REDUCE\nINFECTIVITY').setDepth(1).setScrollFactor(0);
		reduceInfectivityButton.buttonText.setScrollFactor(0).setDepth(1);
		reduceInfectivityButton.on('pointerdown', () => this.takeAction(0, reduceInfectivityButton));

		var reduceSeverityButton = new RectangleButton(this, 80, 240, 150, 50, 0xFFFFFF, 1, 'REDUCE\nSEVERITY').setDepth(1).setScrollFactor(0);
		reduceSeverityButton.buttonText.setScrollFactor(0).setDepth(1);
		reduceSeverityButton.on('pointerdown', () => this.takeAction(1, reduceSeverityButton));

		var reduceLethalityButton = new RectangleButton(this, 80, 300, 150, 50, 0xFFFFFF, 1, 'REDUCE\nLETHALITY').setDepth(1).setScrollFactor(0);
		reduceLethalityButton.buttonText.setScrollFactor(0).setDepth(1);
		reduceLethalityButton.on('pointerdown', () => this.takeAction(2, reduceLethalityButton));

		var increaseRecoveryButton = new RectangleButton(this, 80, 360, 150, 50, 0xFFFFFF, 1, 'INCREASE\nRECOVERY').setDepth(1).setScrollFactor(0);
		increaseRecoveryButton.buttonText.setScrollFactor(0).setDepth(1);
		increaseRecoveryButton.on('pointerdown', () => this.takeAction(3, increaseRecoveryButton));

		var increaseMoraleButton = new RectangleButton(this, 80, 420, 150, 50, 0xFFFFFF, 1, 'BOOST\nMORALE').setDepth(1).setScrollFactor(0);
		increaseMoraleButton.buttonText.setScrollFactor(0).setDepth(1);
		increaseMoraleButton.on('pointerdown', () => this.takeAction(4, increaseMoraleButton));

		var increaseCureButton = new RectangleButton(this, 80, 480, 150, 50, 0xFFFFFF, 1, 'BOOST\nCURE').setDepth(1).setScrollFactor(0);
		increaseCureButton.buttonText.setScrollFactor(0).setDepth(1);
		increaseCureButton.on('pointerdown', () => this.takeAction(5, increaseCureButton));
	}

	//creates the top bar of the screen
	createTopBar() {
		//make the back of the message box
		var rec = this.add.rectangle(0, 0, this.game.config.width, 150, 0x001a24).setScrollFactor(0).setDepth(1);
		rec.setOrigin(0, 0);
		var dayCounterText = this.add.text(rec.x + 20, rec.y + 20, 'Day ' + this.game.gameData.turn + ' of outbreak',
			{ fontFamily: '"Georgia"', fontSize: '25px', fontWeight: 'bold' }).setScrollFactor(0).setDepth(1);
		var populationText = this.add.text(rec.x + 20, rec.y + 50, 'Population: ' + this.game.city.getPopulation() +
			'\nConfirmed Infected: ' + this.game.city.getInfected() +
			'\nDeaths: ' + this.game.city.getDead(),
			{ fontFamily: '"Georgia"', fontSize: '20px' }).setScrollFactor(0).setDepth(1);
		var logo = this.add.image(this.game.config.width / 2 - 50, 70, 'logo');
		logo.setScale(0.1);
		logo.setScrollFactor(0).setDepth(1);

		var threatText = this.add.text(this.game.config.width - 380, 25, 'Threat:',
			{ fontFamily: '"Georgia"', fontSize: '20px' }).setScrollFactor(0).setDepth(1);
		var threatPercent = this.add.text(this.game.config.width - 80, 25, '0%',
			{ fontFamily: '"Georgia"', fontSize: '20px' }).setScrollFactor(0).setDepth(1);

		var progressBoxRed = this.add.graphics().setScrollFactor(0).setDepth(1);
		progressBoxRed.lineStyle(4, 0xeeeeee, 1.0);
		progressBoxRed.fillStyle(0x8c0000, 1);
		progressBoxRed.strokeRect(this.game.config.width - 300, 20, 200, 30);
		progressBoxRed.fillRect(this.game.config.width - 300, 20, 200, 30);

		var progressBarRed = this.game.gameData.progressBarRed = this.add.graphics().setScrollFactor(0).setDepth(1);
		progressBarRed.fillStyle(0xff0000, 1);
		progressBarRed.fillRect(this.game.config.width - 300, 20, 150, 30);


		var moraleText = this.add.text(this.game.config.width - 380, 65, 'Morale:',
			{ fontFamily: '"Georgia"', fontSize: '20px' }).setScrollFactor(0).setDepth(1);
		var moralePercent = this.add.text(this.game.config.width - 80, 65, Math.floor(this.game.city.getMorale() * 100) + '%',
			{ fontFamily: '"Georgia"', fontSize: '20px' }).setScrollFactor(0).setDepth(1);

		var progressBoxGreen = this.add.graphics().setScrollFactor(0).setDepth(1);
		progressBoxGreen.lineStyle(4, 0xeeeeee, 1);
		progressBoxGreen.fillStyle(0x245f24, 1);
		progressBoxGreen.strokeRect(this.game.config.width - 300, 60, 200, 30);
		progressBoxGreen.fillRect(this.game.config.width - 300, 60, 200, 30);

		var progressBarGreen = this.game.gameData.progressBarGreen = this.add.graphics().setScrollFactor(0).setDepth(1);
		progressBarGreen.fillStyle(0x00ff00, 1);
		progressBarGreen.fillRect(this.game.config.width - 300, 60, Math.floor(this.game.city.getMorale() * 200), 30);

		var cureText = this.add.text(this.game.config.width - 380, 105, 'Cure:',
			{ fontFamily: '"Georgia"', fontSize: '20px' }).setScrollFactor(0).setDepth(1);
		var curePercent = this.add.text(this.game.config.width - 80, 105, Math.floor(this.game.gameData.cure * 100) + '%',
			{ fontFamily: '"Georgia"', fontSize: '20px' }).setScrollFactor(0).setDepth(1);

		var progressBoxBlue = this.add.graphics().setScrollFactor(0).setDepth(1);
		progressBoxBlue.lineStyle(4, 0xeeeeee, 1);
		progressBoxBlue.fillStyle(0x034157, 1);
		progressBoxBlue.strokeRect(this.game.config.width - 300, 100, 200, 30);
		progressBoxBlue.fillRect(this.game.config.width - 300, 100, 200, 30);

		var progressBarBlue = this.game.gameData.progressBarBlue = this.add.graphics().setScrollFactor(0).setDepth(1);
		progressBarBlue.fillStyle(0x31d5fd, 1);
		progressBarBlue.fillRect(this.game.config.width - 300, 100, Math.floor(this.game.gameData.cure * 200), 30, 10);
	}


	//End conditions
	end() {
		if (this.game.city.getPopulation() == 0 || this.game.gameData.moraleLevel <= 0)
			this.scene.start("defeatScreen");

		else if (this.game.city.getInfected() == 0 || this.game.gameData.cure >= 1)
			this.scene.start("victoryScreen");
	}

	updateEffects() {
		//Adds all actions to effects
		for (let i = 0; i < this.game.actions.length; i++) {
			let action = this.game.actions[i];

			if (action.hasBeenTaken()) {
				this.game.effects.addAction(this.game.actions[i]);
				action.toggleTaken();
			}
		}
	}

	//@TODO: make it so that it actually reflects the % of people infected, doofus
	updateInfectedTint(virusAlgorithm) {
		let infectedTiles = virusAlgorithm.infectedTiles;
		for (let i = 0; i < infectedTiles.length; i++) {
			let index = infectedTiles[i];
			this.add.rectangle(index % 20 * 50, Math.floor(index / 20) * 50 + 150, 50, 50, 0xff0000, 0.2).setOrigin(0, 0).setDepth(0);
		}
	}

	//Marks action as taken if have enough energy
	//If already taken, unmark it and give back energy
	takeAction(actionNum, button) {
		var action = this.game.actions[actionNum];

		if (action.hasBeenTaken() == false) {
			if (action.getCost() <= this.game.gameData.energy) {
				action.toggleTaken();
				this.game.gameData.energy -= action.getCost();
				button.fillColor = 0x696969;
			}
		}

		else {
			action.toggleTaken();
			this.game.gameData.energy += action.getCost();
			button.fillColor = 0xFFFFFF;
		}
	}
}