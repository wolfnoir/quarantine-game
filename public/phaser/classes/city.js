class City{
    constructor(obj, presets){
        this.cityTiles = [];
        this.infectedTiles = [];

        var data = obj.layers[0].data;

        for(let i = 0; i < data.length; i++){
            var num = data[i];
            var key = num.toString();
            var tile = new CityTile(presets[key][0]);
            this.cityTiles.push(tile);
        }
    }
}