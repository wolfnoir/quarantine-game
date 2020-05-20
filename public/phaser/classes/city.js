class City{
    constructor(obj, presets, actions){
        this.obj = obj
        this.presets = presets
        this.actions = actions
        this.cityTiles = [];
        var data = obj.layers[0].data;

        for(let i = 0; i < data.length; i++){
            var num = data[i];
            var key = num.toString();
            var tile = new CityTile(presets[key][0], actions);
            this.cityTiles.push(tile);
        }
    }

    getPopulation(){
        var pop = 0;

        for(let i = 0; i < this.cityTiles.length; i++)
            pop += this.cityTiles[i].getPopulation();

        return pop;
    }

    getMorale(){
        let totalMorale = 0;
        let numOfInfectableTiles = 0;

        for(let i = 0; i < this.cityTiles.length; i++){
            if(this.cityTiles[i].infectable() && this.cityTiles[i].getName() != "bridge"){
                totalMorale += this.cityTiles[i].getMorale();
                numOfInfectableTiles += 1;
            }
        }

        return totalMorale / numOfInfectableTiles;
    }

    getInfected(){
        var infected = 0;

        for(let i = 0; i < this.cityTiles.length; i++)
            infected += this.cityTiles[i].getInfected();

        return infected;
    }

    getDead(){
        var dead = 0;

        for(let i = 0; i < this.cityTiles.length; i++)
            dead += this.cityTiles[i].getDead();

        return dead;
    }

    getInfectedPercentage(){
        return this.getInfected() / this.getPopulation();
    }

    getTile(x, y){
        return this.cityTiles[y * 20 + x];
    }

    nextTurn(){
        for(let i = 0; i < this.cityTiles.length; i++){
            this.cityTiles[i].resetActions();
            this.cityTiles[i].clearEffects();
        }
    }

    reset(){
        this.cityTiles = [];
        var data = this.obj.layers[0].data;

        for(let i = 0; i < data.length; i++){
            var num = data[i];
            var key = num.toString();
            var tile = new CityTile(this.presets[key][0], this.actions);
            this.cityTiles.push(tile);
        }
    }
}