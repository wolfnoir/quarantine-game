//This is where the effects of actions will be recorded
//Each field defaults to 0
//Each field represents how much the corresponding variable will change due to actions taken this turn
//i.e. if infectivity is by default 0.33 in the difficulty and this class's infectivity is -0.17, then infectivity will be treated as 0.16 when moving to the next turn

class Effects {
    constructor(){
        this.infectivity = 0;
        this.severity = 0;
        this.lethality = 0;
        this.recovery = 0;
        this.morale = 0;
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

    getRecovery(){
        return this.recovery;
    }

    getMorale(){
        return this.morale;
    }

    changeInfectivity(amt){
        this.infectivity += amt;
    }

    changeSeverity(amt){
        this.severity += amt;
    }

    changeLethality(amt){
        this.lethality += amt;
    }

    changeRecovery(amt){
        this.recovery += amt;
    }

    changeMorale(amt){
        this.morale += amt;
    }
}