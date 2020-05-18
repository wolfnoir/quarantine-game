class RectangleButton extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, fillColor, fillAlpha, text) {
        super(scene, x, y, width, height, fillColor, fillAlpha);
        this.color = fillColor;
        this.allowHover = true;

        this.setInteractive({ useHandCursor: true })
        scene.add.existing(this);
        this.buttonText = scene.add.text(x, y, text,
            { fontFamily: '"Courier New"', fontSize: '20px', fontWeight: 900, color: '0x000000' }).setOrigin(0.5);
        
        super.on('pointerover', () => this.hoverOver());
        super.on('pointerout', () => this.hoverOut());
    }

    hideButton(){
        this.buttonText.setAlpha(0);
        super.setAlpha(0);
    }

    toggleHover(){
        this.allowHover = !this.allowHover
    }

    setHover(bool){
        this.allowHover = bool;
    }

    showButton(){
        this.buttonText.setAlpha(1);
        super.setAlpha(1);
    }

    hoverOver(){
        if(this.allowHover){
            super.setFillStyle(0x696969);
        }
    }

    hoverOut(){
        if(this.allowHover){
            super.setFillStyle(this.color);
        }
    }

}