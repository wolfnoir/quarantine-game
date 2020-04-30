class Virus{
    constructor(name, obj){
        this.name = name;
        this.infectivity = obj.infectivity;
        this.severity = obj.severity;
        this.lethality = obj.lethality;
    }

    getName(){
        return this.name;
    }

    getInfectivity(){
        return this.infectivity;
    }

    getSeverity(){
        return this.severity;
    }

    getLethality(){
        return this.lethality;
    }
}