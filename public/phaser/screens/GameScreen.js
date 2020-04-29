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
		this.load.image("tiles", "../../../maps/tiles/quarantine-tiles.png");
		this.load.tilemapTiledJSON("map", "../../../maps/manhattan.json");
	}

	create() {
		const map = this.make.tilemap({ key: "map" });
		const tileset = map.addTilesetImage("QuarantineTiles", "tiles");
	
		const belowLayer = map.createStaticLayer("Tile Layer", tileset, 0, 0);
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
	  
		camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
	}

	update(time, delta) {
		// Apply the controls to the camera each update tick of the game
		this.controls.update(delta);
	}


	end() {
		
	}

}