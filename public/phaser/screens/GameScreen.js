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
	}

	create() {
		//Set up data structure for city
		var mapjs = this.cache.json.get('mapjs');
		var presets = this.cache.json.get('tile-presets');
		this.game.city = new City(mapjs, presets);

		const map = this.make.tilemap({ key: "map" });
		const tileset = map.addTilesetImage("QuarantineTiles", "tiles");
	
		this.groundLayer = map.createStaticLayer("Tile Layer", tileset, 0, 0);
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

		this.marker = this.add.graphics();
		this.marker.lineStyle(5, 0xffffff, 1);
		this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);
		this.marker.lineStyle(3, 0xff4f78, 1);
		this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);
	}

	update(time, delta) {
		// Apply the controls to the camera each update tick of the game
		this.controls.update(delta);

		var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

		// Place the marker in world space, but snap it to the tile grid. If we convert world -> tile and
		// then tile -> world, we end up with the position of the tile under the pointer
		var pointerTileXY = this.groundLayer.worldToTileXY(worldPoint.x, worldPoint.y);
		var snappedWorldPoint = this.groundLayer.tileToWorldXY(pointerTileXY.x, pointerTileXY.y);
		var tile = this.groundLayer.getTileAtWorldXY(snappedWorldPoint.x, snappedWorldPoint.y);
		this.marker.setPosition(snappedWorldPoint.x, snappedWorldPoint.y);

	}
	tileClicked(tile){
		tile.setAlpha(0);
	}

	end() {
		
	}

}