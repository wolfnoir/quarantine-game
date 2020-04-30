class RectangleButton extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, fillColor, fillAlpha, text) {
        super(scene, x, y, width, height, fillColor, fillAlpha);

        this.setInteractive({ useHandCursor: true })
        scene.add.existing(this);
        this.buttonText = scene.add.text(x, y, text,
            { fontFamily: '"Courier New"', fontSize: '20px', fontWeight: 900, color: '0x000000' }).setOrigin(0.5);
    }
}