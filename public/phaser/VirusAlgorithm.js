class VirusAlgorithm {

    /*
    * initialTiles : Array that has the indicies of the initially infected tiles.
    * difficultyRatio : the % at which the algorithm checks if the disease spreads to another tile. Based on game difficulty.
    * game : Game. Contains important global game data for this algorithm to use, such as the city we're using.
    * 
    * The constructor adds the initialTiles to an array of infectedTiles.
    * !!!IMPORTANT NOTE!!!
    * infectedTiles[] stores the INDEX of EACH INFECTED TILE, NOT THE ACTUAL TILE ITSELF.
    */

    constructor(initialTiles, game) {
        this.game = game;
        this.infectedTiles = [];
        this.city = game.city;
        this.cityTiles = game.city.cityTiles;
        this.difficulty = game.difficulty;

        this.totalTiles = 0;
        for(let i = 0; i < this.cityTiles.length; i++){
            if(this.cityTiles[i].infectable() && this.cityTiles[i].getName() != "bridge"){
                this.totalTiles = this.totalTiles + 1;
            }
        }

        this.tempInfectivity = 0;
        this.tempSeverity = 0;
        this.tempLethality = 0;

        // the difficulty ratio
        // determines how many people must be infected in a tile before the algorithm checks if the virus spreads
        this.difficultyRatio = 0;
        if (this.difficulty.name === "easy") {
            this.difficultyRatio = 0.5;
        }
        else if (this.difficulty.name === "medium") {
            this.difficultyRatio = 0.4;
        }
        else {
            this.difficultyRatio = 0.3;
        }

        // push the initial tiles that have been infected to the infectedTiles array.
        // assume that the tiles we've read in are infectable.
        for (let i = 0; i < initialTiles.length; i++) {
            this.infectedTiles.push(initialTiles[i]);
        }
    }

    getInfectedTiles(){
        return this.infectedTiles;
    }

    runVirusTurn() {
        // Check to see if any special events will occur. If so, apply the effects.
        // Check which tiles are currently infected (greater than 0% infected).
        let newTilesInfected = [];
        for (let i = 0; i < this.infectedTiles.length; i++) {
            let index = this.infectedTiles[i];
            //calculates the total original population of the tile
            let totalPopulation = this.cityTiles[index].getPopulation() + this.cityTiles[index].getDead();
            //reads in the current population (including those infected)
            let currentPopulation = this.cityTiles[index].getPopulation();
            //reads in the current amount of infected people in the tile
            let currentInfected = this.cityTiles[index].getInfected();
            //calculates the number of healthy people in the tile
            let healthyPeople = currentPopulation - currentInfected;
            //reads in the current amount of dead people in the tile
            let deadPeople = this.cityTiles[index].getDead();

            //gets the actions for that specific tile
            this.cityTiles[index].updateEffects();

            let tileInfectivity = this.cityTiles[index].effects.getInfectivity();
            let tileSeverity = this.cityTiles[index].effects.getSeverity();
            let tileLethality = this.cityTiles[index].effects.getLethality();
            let tileRecovery = this.cityTiles[index].effects.getRecovery();
            let tileMorale = this.cityTiles[index].effects.getMorale();

            //virus statistics
            let infectivity = this.difficulty.getInfectivity() + this.game.effects.getInfectivity() + this.tempInfectivity + tileInfectivity;
            let severity = this.difficulty.getSeverity() + this.game.effects.getSeverity() + this.tempSeverity + tileSeverity;
            let lethality = this.difficulty.getLethality() + this.game.effects.getLethality() + this.tempLethality + tileLethality;

            //individual tile statistics, with the effects taking place
            let recoveryRate = this.cityTiles[index].getRecoveryRate() + this.game.effects.getRecovery() + tileRecovery;
            let newMorale = this.cityTiles[index].getMorale() + this.game.effects.getMorale() + tileMorale;

            if(infectivity < 0)
                infectivity = 0;
            else if(infectivity > 1)
                infectivity = 1;
            if(severity < 0)
                severity = 0;
            else if(severity > 1)
                severity = 1;
            if(lethality < 0)
                lethality = 0;
            else if(lethality > 1)
                lethality = 1;

            // Calculate how many new people are infected for each tile
            let newInfected = 0;
            if (healthyPeople > 0) {
                newInfected = Math.floor(healthyPeople * infectivity / 2);
            }

            // Calculates the number of recovered people.
            let recovered = 0;
            let random = Math.random();
            if (currentInfected > 0 && deadPeople != totalPopulation && random <= recoveryRate) {
                recovered = Math.floor(currentInfected * recoveryRate);
            }

            // Calculate how many people die within each tile, if any.
            let died = 0;
            random = Math.random();
            if (currentInfected > 0 && deadPeople != totalPopulation && random <= lethality) {
                died = Math.floor(currentInfected * lethality * 0.5);
            }

            // apply the number of newly infected/recovered
            currentInfected = currentInfected - died;
            currentPopulation = currentPopulation - died;

            newInfected = newInfected - recovered;
            //if the amount of new infected exceeds the amount of healthy people
            //change the amount of newly infected to the amount of healthy people remaining
            if (newInfected + currentInfected > currentPopulation) {
                newInfected = currentPopulation - currentInfected;
            }

            // Calculate the new morale for the tile using severity and morality.
            newMorale = newMorale - (severity * ((newInfected + currentInfected) / totalPopulation) + deadPeople / totalPopulation)/2;
            if (newMorale < 0) {
                newMorale = 0;
            }
            else if(newMorale > 1){
                newMorale = 1;
            }

            // If # of infected exceeds a certain ratio, check to see if the infection spreads to surrounding tiles.
            if (this.cityTiles[index].getInfectedPercentage() > this.difficultyRatio && !this.cityTiles[index].isQuarantined()) {
                //if the tile is quarantined we dont check for this
                random = Math.random();
                // If the random # is equal to or less than the infected tile's infectivity rate,
                // pick a random tile and add a random number of infected to the tile.
                if (random <= this.cityTiles[index].getInfectivityRate()) {
                    // get the surrounding tiles and place it in an array
                    let surroundingTileArray = [];
                    surroundingTileArray = this.getSurroundingTiles(this.cityTiles, index);
                    // pick a random tile to infect from the surrounding tiles.
                    if (surroundingTileArray.length > 0) {
                        let num = Math.floor(Math.random() * surroundingTileArray.length)
                        let newTileIndex = surroundingTileArray[num];
                        // pick a random number of people to be infected
                        let numberOfNewInfected = Math.floor(Math.random() * (1000 * this.difficulty.getInfectivity()));
                        //infect the new tile with the new number of infected
                        this.cityTiles[newTileIndex].infected = numberOfNewInfected;
                        //add the new tile index to the array of infectedTiles
                        newTilesInfected.push(newTileIndex);
                    }
                }
            }

            // Apply the new numbers to the tile.
            this.cityTiles[index].population = currentPopulation;
            this.cityTiles[index].infected = currentInfected + newInfected;
            this.cityTiles[index].dead += died;
            this.cityTiles[index].morale = newMorale;
        }

        for(let i = 0; i < newTilesInfected.length; i++){
            this.infectedTiles.push(newTilesInfected[i]);
        }

        // * Calculate overall threat level based on infection, severity, and morality of the disease
        // this.game.gameData.threatLevel = (this.difficulty.infectivity + this.tempInfectivity)/5 +
        //                                 (this.difficulty.severity + this.tempSeverity)/5 + 
        //                                 (this.difficulty.lethality + this.tempLethality)/4 + (this.infectedTiles.length/this.totalTiles);

        this.game.gameData.threatLevel = (this.infectedTiles.length/this.totalTiles);

        // Increase the cure progress.
        this.game.gameData.cure = this.game.gameData.cure + this.game.difficulty.getDailyCureProgress() + this.game.effects.getCureProgress();
        // Randomly pick infectivity, severity, or morality to increase.
        // The different chances of values being increased are weighed in favor of infectivity > severity > morality.
        let pick = Math.floor(Math.random() * 7);
        if (pick < 3) { //1/2 chance of infectivity increasing
            this.tempInfectivity += 0.02;
        }
        else if (pick >= 3 && pick < 5) { //1/3 chance of severity increasing
            this.tempSeverity += 0.02;
        }
        else { //1/6 chance of lehtality increasing
            this.tempLethality += 0.02;
        }
        console.log("Infectivity: " + (this.difficulty.infectivity + this.tempInfectivity + this.game.effects.getInfectivity()));
        console.log("Severity: " + (this.difficulty.severity + this.tempSeverity + this.game.effects.getSeverity()));
        console.log("Lethality: " + (this.difficulty.lethality + this.tempLethality + this.game.effects.getLethality()));
        console.log("Cure Progress: " + Math.floor(this.game.gameData.cure * 100) + "%");
    }

    // returns an array of integers that point to the infectable tiles that surround a partiulcar tile at initIndex
    //@TODO: Something goes wrong when the infection reaches the right side of the screen--it wraps around to infect the tiles
    //on the left! yikes! fix this!!!
    getSurroundingTiles(tileArray, initIndex) {
        //get the column (x) and row (y) from initIndex
        let x = initIndex%20;
        let y = Math.floor(initIndex/20);
        let hasBridge = false;
        let bridgeIndexes = [];

        let surroundingTiles = [];
        // //check north west
        // if (x - 1 >= 0 && y - 1 >= 0) {
        //     if (tileArray[initIndex - 21].getName() != "bridge" && tileArray[initIndex - 21].infectable() && tileArray[initIndex - 21].getDead() === 0 && tileArray[initIndex - 21].getInfected() === 0) {
        //         surroundingTiles.push(initIndex - 21);
        //     }
        // }

        //check north
        if (y - 1 >= 0) {
            if(tileArray[initIndex - 20].getName() === "bridge" && tileArray[initIndex - 20].infectable()){
                hasBridge = true;
                bridgeIndexes.push(initIndex - 20);
            }
            else if (tileArray[initIndex - 20].infectable() && tileArray[initIndex - 20].getDead() === 0 &&
                        tileArray[initIndex - 20].getInfected() === 0 && !tileArray[initIndex - 20].isQuarantined()) {
                surroundingTiles.push(initIndex - 20);
            }
        }
        // //check north east
        // if (x + 1 <= 19 && y - 1 >= 0) {
        //     if (tileArray[initIndex - 19].getName() != "bridge" && tileArray[initIndex - 19].infectable() && tileArray[initIndex - 19].getDead() === 0 && tileArray[initIndex - 19].getInfected() === 0) {
        //         surroundingTiles.push(initIndex - 19);
        //     }
        // }

        //check west
        if (x - 1 >= 0) {
            if(tileArray[initIndex - 1].getName() === "bridge" && tileArray[initIndex - 1].infectable()){
                hasBridge = true;
                bridgeIndexes.push(initIndex - 1);
            }
            else if (tileArray[initIndex - 1].infectable() && tileArray[initIndex - 1].getDead() === 0 &&
                        tileArray[initIndex - 1].getInfected() === 0 && !tileArray[initIndex - 1].isQuarantined()) {
                surroundingTiles.push(initIndex - 1);
            }
        }
        //check east
        if (x + 1 <= 19) {
            if(tileArray[initIndex + 1].getName() === "bridge" && tileArray[initIndex + 1].infectable()){
                hasBridge = true;
                bridgeIndexes.push(initIndex + 1);
            }
            else if (tileArray[initIndex + 1].infectable() && tileArray[initIndex + 1].getDead() === 0 &&
                        tileArray[initIndex + 1].getInfected() === 0 && !tileArray[initIndex + 1].isQuarantined()) {
                surroundingTiles.push(initIndex + 1);
            }
        }
        // //check south west
        // if (x - 1 >= 0 && y + 1 <= 19) {
        //     if (tileArray[initIndex + 19].getName() != "bridge" && tileArray[initIndex + 19].infectable() && tileArray[initIndex + 19].getDead() === 0 && tileArray[initIndex + 10].getInfected() === 0) {
        //         surroundingTiles.push(initIndex + 19);
        //     }
        // }
        //check south
        if (y + 1 <= 19) {
            if(tileArray[initIndex + 20].getName() === "bridge" && tileArray[initIndex + 20].infectable()){
                hasBridge = true;
                bridgeIndexes.push(initIndex + 20);
            }
            else if (tileArray[initIndex + 20].infectable() && tileArray[initIndex + 20].getDead() === 0 &&
                        tileArray[initIndex + 20].getInfected() === 0 && !tileArray[initIndex + 20].isQuarantined()) {
                surroundingTiles.push(initIndex + 20);
            }
        }
        // //check south east
        // if (y + 1 <= 19 && x + 1 <= 19) {
        //     if (tileArray[initIndex + 21].getName() != "bridge" && tileArray[initIndex + 21].infectable() && tileArray[initIndex + 21].getDead() === 0 && tileArray[initIndex + 21].getInfected() === 0) {
        //         surroundingTiles.push(initIndex + 21);
        //     }
        // }

        // check to see if hasBridge == true. if so, follow the bridge until we end up on land
        // we add the land we find to surrounding tiles if its not infected yet
        // (we only need to check north/south/east/west! convenient.)
        // for this check, we assume that:
        // 1) the bridge connects to land (aka doesnt go to the edge of the screen)
        // 2) the bridge selected is, in fact, infectable and not blocked off by an action
        // 3) the bridge is a straight line--it only goes north to south or west to east. no diagonal bridges allowed!

        if(hasBridge){
            //loop through how many bridge indexes we have
            for(let i = 0; i < bridgeIndexes.length; i++){
                //save the x and y pos of the bridges, just in case?
                let bridgeX = initIndex%20;
                let bridgeY = Math.floor(initIndex/20);
                let currentBridgeIndex = bridgeIndexes[i];

                let direction = 0; //saves the # we add to the index to find the next bridge/land tile
                //check north
                if(tileArray[currentBridgeIndex - 20].getName() === "bridge"){
                    direction = -20;
                }
                //check west
                else if(tileArray[currentBridgeIndex - 1].getName() === "bridge"){
                    direction = -1;
                }
                //check east
                else if(tileArray[currentBridgeIndex + 1].getName() === "bridge"){
                    direction = 1;
                }
                //check south
                else if(tileArray[currentBridgeIndex + 20].getName() === "bridge"){
                    direction = 20;
                }

                let nextTile = tileArray[currentBridgeIndex + direction];
                currentBridgeIndex = currentBridgeIndex + direction;

                //continue in the direction the bridge is heading until we find a tile is not a bridge tile
                while(nextTile.getName() === "bridge"){
                    if(nextTile.isInfectable){
                        nextTile = tileArray[currentBridgeIndex + direction];
                        currentBridgeIndex = currentBridgeIndex + direction;
                    }
                    else{
                        return surroundingTiles;
                    }
                }

                //push the tile we've found to "suroundingTiles" array if no ones been infected yet
                if(nextTile.getDead() === 0 && nextTile.getInfected() === 0){
                    surroundingTiles.push(currentBridgeIndex);
                }
            }
        }

        return surroundingTiles;
    }
}