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
		this.selectedTile = null;
		this.virusAlgorithm;
		this.offLimitTiles = [];
	}

	init() {

	};

	preload() {
		//import tileset image and map json file
		this.load.image("tiles", "../../maps/tiles/quarantine-tiles-seoul.png");

		this.load.tilemapTiledJSON("Manhattan", "../../maps/manhattan.json");
		this.load.tilemapTiledJSON("London", "../../maps/london.json");
		this.load.tilemapTiledJSON("Seoul", "../../maps/seoul.json");

		this.load.json("tile-presets", "../../maps/tile-presets.json");
		this.load.image('logo', 'assets/quarantine-logo.png');
		this.load.audio('chimeSFX', 'assets/sfx/soft-chime.wav');
	}

	create() {
		//sets the initial threat level
		this.game.gameData.threatLevel = (this.game.difficulty.infectivity)/3 +
                                        (this.game.difficulty.severity)/3 + 
                                        (this.game.difficulty.lethality)/2;

		//sets up arrays for the global action buttons and tile action buttons
		this.globalActionButtons = [];
		this.tileActionButtons = [];

		//adding 'off limit' tiles.
		if(this.game.cityName === "Seoul"){
			let cityTiles = this.game.city.cityTiles;
			for(let i = 0; i < cityTiles.length; i++){
				if(cityTiles[i].getName() === "airport"){
					this.offLimitTiles.push(cityTiles[i]);
				}
			}
		}

		//add randomly generated starting positions based on the map
		var initialTiles = this.generateStartingPositions();
		this.virusAlgorithm = new VirusAlgorithm(initialTiles, this.game);

		//Set up actions
		var actionjs = this.cache.json.get('actions');
		this.game.actions = [];
		for (let i = 1; i <= 10; i++) {
			var obj = new Action(actionjs[i.toString()]);
			this.game.actions.push(obj);
		}

		//Set up keyboard listener
		let s = this.scene;
		this.input.keyboard.on("keydown-ESC", function (event) {
			s.start("pauseScreen");
		});

		const map = this.make.tilemap({ key: this.game.cityName });
		const tileset = map.addTilesetImage("QuarantineTiles", "tiles");

		this.groundLayer = map.createStaticLayer("Tile Layer", tileset, 200, 150);
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

		camera.setBounds(0, 0, map.widthInPixels + 200, map.heightInPixels + 150);

		//creates the marker to indicate where the player is hovering over tiles
		this.marker = this.add.graphics();
		this.marker.lineStyle(5, 0xffffff, 1);
		this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);
		this.marker.lineStyle(3, 0xff4f78, 1);
		this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);
		this.marker.setDepth(1);
		
		//create the marker that indicates if a tile has been highlighter
		this.selectMarker = this.add.rectangle(0, 0, map.tileWidth, map.tileHeight, 0x03cafc).setDepth(1);
		this.selectMarker.setAlpha(0);
		this.selectMarker.setOrigin(0.5, 0.5);

		//create the infobox for hovering over tiles
		this.infoBox = this.add.rectangle(0, 0, 140, 75, 0xffffff).setOrigin(0, 0.5).setDepth(1);
		this.infoText = this.add.text(0, 0, "", { fontFamily: '"Courier New"', fontSize: '14px', fontWeight: 'bold', color: '#000000' }).setDepth(1);;

		//makes the top bar displaying information about threat, morale, and cure
		this.createTopBar();

		//make the side bar displaying actions
		this.createSideBar();

		//create action buttons on the side
		this.createGlobalActionButtons();

		//create tile buttons on the side
		this.createTileActionButtons();

		var nextTurnButton = new RectangleButton(this, 100, this.game.config.height - 50, 150, 50, 0xFFFFFF, 1, 'NEXT TURN').setDepth(1);
		nextTurnButton.setScrollFactor(0);
		nextTurnButton.buttonText.setScrollFactor(0).setDepth(1);
		nextTurnButton.on('pointerdown', () => this.nextTurn(this.virusAlgorithm, this.dayCounterText, this.populationText, this.threatPercent, this.moralePercent, this.curePercent));
	}

	update(time, delta) {
		// Apply the controls to the camera each update tick of the game
		this.controls.update(delta);

		var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

		// Place the marker in world space, but snap it to the tile grid. If we convert world -> tile and
		// then tile -> world, we end up with the position of the tile under the pointer
		var pointerTileXY = this.groundLayer.worldToTileXY(worldPoint.x, worldPoint.y);
		if (pointerTileXY.y >= 0 && pointerTileXY.x >= 0) {
			var snappedWorldPoint = this.groundLayer.tileToWorldXY(pointerTileXY.x, pointerTileXY.y);
			var tilePos = this.groundLayer.getTileAtWorldXY(snappedWorldPoint.x, snappedWorldPoint.y);
			var tile;
			let pointer = this.input.activePointer;
			//displays information about the tile the mouse is currently hovering over
			if (tilePos !== null) {
				tile = this.game.city.getTile(tilePos.x, tilePos.y);
				if(pointer.isDown && tile.isInfectable && pointer.x > 200 && pointer.y > 150){
					this.tileClicked(tile, snappedWorldPoint.x, snappedWorldPoint.y);
				}
			}

			if (tile !== undefined && tilePos !== null) {
				if (tile.isInfectable && (tile.name != "bridge" || tile.name != "airport")) {
					if (snappedWorldPoint.x + 200 > this.game.config.width) {
						this.infoBox.setPosition(snappedWorldPoint.x - 148, snappedWorldPoint.y + 25);
						this.infoText.setPosition(snappedWorldPoint.x - 146, snappedWorldPoint.y + 3);
					}
					else {
						this.infoBox.setPosition(snappedWorldPoint.x + 60, snappedWorldPoint.y + 25);
						this.infoText.setPosition(snappedWorldPoint.x + 62, snappedWorldPoint.y + 3);
					}

					this.infoText.setText("Population: " + tile.population + "\nInfected: " + tile.infected +
						"\nDead: " + tile.dead + "\nMorale: " + Math.floor(tile.morale * 100) + "%");
					this.infoText.setPosition(this.infoBox.x + 2, this.infoBox.y - 30);
					//show the infobox
					this.infoBox.setAlpha(1);
					this.infoText.setAlpha(1);
				}
				else {
					//hide the infobox
					this.infoBox.setAlpha(0);
					this.infoText.setAlpha(0);
				}
			}
			else {
				//hide the infobox
				this.infoBox.setAlpha(0);
				this.infoText.setAlpha(0);
			}

			this.marker.setPosition(snappedWorldPoint.x, snappedWorldPoint.y);
		}

		var redBar = this.game.gameData.progressBarRed;
		redBar.clear();
		redBar.fillStyle(0xff0000, 1);
		redBar.fillRect(this.game.config.width - 300, 20, Math.floor(this.game.gameData.threatLevel * 200), 30);

		var greenBar = this.game.gameData.progressBarGreen;
		greenBar.clear();
		greenBar.fillStyle(0x00ff00, 1);
		greenBar.fillRect(this.game.config.width - 300, 60, Math.floor(this.game.city.getMorale() * 200), 30);

		var blueBar = this.game.gameData.progressBarBlue;
		blueBar.clear();
		blueBar.fillStyle(0x31d5fd, 1);
		blueBar.fillRect(this.game.config.width - 300, 100, Math.floor(this.game.gameData.cure * 200), 30);

		this.energyText.setText('Energy: ' + this.game.gameData.energy);

	}
	tileClicked(tile, x, y) {
		this.selectedTile = tile;

		if(this.selectedTile != null){
			this.selectMarker.setAlpha(0.7);
			this.selectMarker.setPosition(x + 25,y + 25);
			this.toggleActionButtons("tile");
		}
		else{
			this.selectMarker.setAlpha(0);
			this.toggleActionButtons("global");
		}

	}

	toggleActionButtons(str){
		//if b is true, then we hide the global actions and show the tile actions
		if(str === "tile"){
			for(let i = 0; i < this.globalActionButtons.length ; i++){
				this.globalActionButtons[i].hideButton();
			}
			for(let i = 0; i < this.tileActionButtons.length ; i++){
				this.tileActionButtons[i].showButton();
			}
		}
		//otherwise we show the global actions
		else if(str === "global"){
			this.selectMarker.setAlpha(0);
			for(let i = 0; i < this.globalActionButtons.length ; i++){
				this.globalActionButtons[i].showButton();
			}
			for(let i = 0; i < this.tileActionButtons.length ; i++){
				this.tileActionButtons[i].hideButton();
			}
		}
	}

	nextTurn(virusAlgorithm, dayCounterText, populationText, threatPercent, moralePercent, curePercent) {
		//Sets up effects for the previous turn
		this.selectedTile = null;
		this.selectMarker.setAlpha(0);
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

		//Clear effects for this turn
		this.game.effects.clear();

		//add new energy for the next day
		this.game.gameData.energy += this.game.difficulty.getEnergyToday(this.game.gameData.turn);
		this.energyText.setText('Energy: ' + this.game.gameData.energy);

		//reset button colors
		for(let i = 0; i < this.globalActionButtons.length; i++){
			let button = this.globalActionButtons[i];
			button.setHover(true);
			button.fillColor = 0xffffff;
		}
	}

	createGlobalActionButtons() {
		var testingButton = new ActionButton(this, 100, 100, "VIRUS TESTING", "- morale\n-- lethality").setDepth(1).setScrollFactor(0);
		testingButton.title.setScrollFactor(0);
		testingButton.energyText.setScrollFactor(0);
		testingButton.text.setScrollFactor(0);
		testingButton.setEnergyCost(12);
		testingButton.on('pointerdown', () => this.takeAction(6, testingButton));

		var livestreamAction = new ActionButton(this, 100, 205, "LIVESTREAM\nENERTAINMENT", "++ morale\n- infectivity").setDepth(1).setScrollFactor(0);
		livestreamAction.title.setScrollFactor(0);
		livestreamAction.energyText.setScrollFactor(0);
		livestreamAction.text.setScrollFactor(0);
		livestreamAction.setEnergyCost(5);
		livestreamAction.on('pointerdown', () => this.takeAction(7, livestreamAction));

		var medicineGlobal = new ActionButton(this, 100, 310, "DISTRIBUTE\nMEDICINE", "-- severity\n-- infectivity").setDepth(1).setScrollFactor(0);
		medicineGlobal.title.setScrollFactor(0);
		medicineGlobal.energyText.setScrollFactor(0);
		medicineGlobal.text.setScrollFactor(0);
		medicineGlobal.setEnergyCost(8);
		medicineGlobal.on('pointerdown', () => this.takeAction(8, medicineGlobal));

		var boostCureButton = new ActionButton(this, 100, 415, "BOOST CURE", "++ cure progress").setDepth(1).setScrollFactor(0);
		boostCureButton.title.setScrollFactor(0);
		boostCureButton.energyText.setScrollFactor(0);
		boostCureButton.text.setScrollFactor(0);
		boostCureButton.setEnergyCost(12);
		boostCureButton.on('pointerdown', () => this.takeAction(5, boostCureButton));

		var psaButton = new ActionButton(this, 100, 520, "PSA FROM\nMAYOR", "--- infectivity\n+ morale").setDepth(1).setScrollFactor(0);
		psaButton.title.setScrollFactor(0);
		psaButton.energyText.setScrollFactor(0);
		psaButton.text.setScrollFactor(0);
		psaButton.setEnergyCost(5);
		psaButton.on('pointerdown', () => this.takeAction(9, psaButton));

		this.globalActionButtons.push(testingButton);
		this.globalActionButtons.push(livestreamAction);
		this.globalActionButtons.push(medicineGlobal);
		this.globalActionButtons.push(boostCureButton);
		this.globalActionButtons.push(psaButton);
	}

	createTileActionButtons() {
		var recoveryButton = new ActionButton(this, 100, 100, "TEMPORARY\nCLINIC", "+++ recovery\n-- severity").setDepth(1).setScrollFactor(0);
		recoveryButton.title.setScrollFactor(0);
		recoveryButton.energyText.setScrollFactor(0);
		recoveryButton.text.setScrollFactor(0);
		recoveryButton.setEnergyCost(5);
		recoveryButton.hideButton();
		//@TODO: pointerdown take action here

		var backButton = new RectangleButton(this, 100, 595, 150, 50, 0xFFFFFF, 1, 'CANCEL').setDepth(1).setScrollFactor(0);
		backButton.buttonText.setScrollFactor(0).setDepth(1);
		backButton.on('pointerdown', () => this.toggleActionButtons("global"));
		backButton.hideButton();

		//@TODO: add buttons for tile specific actions
		//@TODO: how do we deal with multiple tile actions across multiple tiles?
		this.tileActionButtons.push(recoveryButton);
		this.tileActionButtons.push(backButton);
	}

	//creates the top bar of the screen
	createTopBar() {
		//make the back of the message box
		var rec = this.add.rectangle(200, 0, this.game.config.width - 200, 150, 0x001a24).setScrollFactor(0).setDepth(1);
		rec.setOrigin(0, 0);
		this.dayCounterText = this.add.text(rec.x + 20, rec.y + 20, 'Day ' + this.game.gameData.turn + ' of outbreak',
			{ fontFamily: '"Georgia"', fontSize: '25px', fontWeight: 'bold' }).setScrollFactor(0).setDepth(1);
		this.populationText = this.add.text(rec.x + 20, rec.y + 50, 'Population: ' + this.game.city.getPopulation() +
			'\nConfirmed Infected: ' + this.game.city.getInfected() +
			'\nDeaths: ' + this.game.city.getDead(),
			{ fontFamily: '"Georgia"', fontSize: '20px' }).setScrollFactor(0).setDepth(1);
		var logo = this.add.image(this.game.config.width / 2, 70, 'logo');
		logo.setScale(0.1);
		logo.setScrollFactor(0).setDepth(1);

		var threatText = this.add.text(this.game.config.width - 380, 25, 'Threat:',
			{ fontFamily: '"Georgia"', fontSize: '20px' }).setScrollFactor(0).setDepth(1);
		this.threatPercent = this.add.text(this.game.config.width - 80, 25, Math.floor(this.game.gameData.threatLevel * 100) + '%',
			{ fontFamily: '"Georgia"', fontSize: '20px' }).setScrollFactor(0).setDepth(1);

		var progressBoxRed = this.add.graphics().setScrollFactor(0).setDepth(1);
		progressBoxRed.lineStyle(4, 0xeeeeee, 1.0);
		progressBoxRed.fillStyle(0x8c0000, 1);
		progressBoxRed.strokeRect(this.game.config.width - 300, 20, 200, 30);
		progressBoxRed.fillRect(this.game.config.width - 300, 20, 200, 30);

		var progressBarRed = this.game.gameData.progressBarRed = this.add.graphics().setScrollFactor(0).setDepth(1);
		progressBarRed.fillStyle(0xff0000, 1);
		progressBarRed.fillRect(this.game.config.width - 300, 20, Math.floor(this.game.gameData.threatLevel * 200), 30);


		var moraleText = this.add.text(this.game.config.width - 380, 65, 'Morale:',
			{ fontFamily: '"Georgia"', fontSize: '20px' }).setScrollFactor(0).setDepth(1);
		this.moralePercent = this.add.text(this.game.config.width - 80, 65, Math.floor(this.game.city.getMorale() * 100) + '%',
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
		this.curePercent = this.add.text(this.game.config.width - 80, 105, Math.floor(this.game.gameData.cure * 100) + '%',
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

	createSideBar() {
		let sidebar = this.add.rectangle(0, 0, 200, this.game.config.height, 0x354b59).setScrollFactor(0).setDepth(1);
		sidebar.setOrigin(0, 0);

		//creates text for the energy
		this.energyText = this.add.text(50, 10, 'Energy: ' + this.game.gameData.energy,
			{ fontFamily: '"Georgia"', fontSize: '20px' }).setScrollFactor(0).setDepth(1);
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
			this.add.rectangle(index % 20 * 50 + 200, Math.floor(index / 20) * 50 + 150, 50, 50, 0xff0000, 0.2).setOrigin(0, 0).setDepth(0);
		}
	}

	//Can be used for both citywide and tile specific actions
	//Marks action as taken if have enough energy
	//If already taken, unmark it and give back energy
	takeAction(actionNum, button) {
		var action = this.game.actions[actionNum];

		if (action.hasBeenTaken() == false) {
			if (action.getCost() <= this.game.gameData.energy) {
				action.toggleTaken();
				this.game.gameData.energy -= action.getCost();
				button.fillColor = 0x696969;
				button.toggleHover();
			}
		}

		else {
			action.toggleTaken();
			this.game.gameData.energy += action.getCost();
			button.fillColor = 0xffffff;
			button.toggleHover();
		}
	}

	//generates random starting positions based on the map selected. returns an array that has two coordinates in it
	generateStartingPositions(){
		let array = [];
		let manhattanPositions = [6, 13, 66, 91, 207, 289, 352];
		let londonPositions = [11, 48, 57, 108, 167, 330, 390];
		let seoulPositions = [12, 17, 32, 42, 89, 134, 174, 294, 316];
		if(this.game.cityName === "Manhattan"){
			let r = Math.floor((Math.random() * 4));
			array.push(manhattanPositions[r]);
			r = Math.floor((Math.random() * 3) + 4);
			array.push(manhattanPositions[r]);
		}
		else if(this.game.cityName === "London"){
			let r = Math.floor((Math.random() * 4));
			array.push(londonPositions[r]);
			r = Math.floor((Math.random() * 3) + 4);
			array.push(londonPositions[r]);
		}
		else{
			let r = Math.floor((Math.random() * 5));
			array.push(seoulPositions[r]);
			r = Math.floor((Math.random() * 4) + 5);
			array.push(seoulPositions[r]);
		}
		return array;
	}

	//End conditions
	end() {
		if (this.game.city.getPopulation() == 0 || Math.floor(this.game.gameData.moraleLevel * 100) <= 0)
			this.scene.start("defeatScreen");

		else if (this.game.city.getInfected() == 0 || this.game.gameData.cure >= 1)
			this.scene.start("victoryScreen");

		if(this.game.cityName === "Seoul"){
			for(let i = 0; i < this.offLimitTiles.length; i++){
				if(this.offLimitTiles[i].getInfected() > 0){
					this.scene.start("defeatScreen");
				}
			}
		}
	}
}