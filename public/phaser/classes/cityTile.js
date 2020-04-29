class CityTile {
    constructor(obj){
        this.population = obj.population;
        this.infected = obj.infected;
        this.dead = obj.dead;
        this.morale = obj.morale;
        this.infectivity = obj.infectivity;
        this.recovery = obj.recovery;
    }
}