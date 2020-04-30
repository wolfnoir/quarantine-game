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
        this.effects = game.effects;

        // the difficulty ratio
        // determines how many people must be infected in a tile before the algorithm checks if the virus spreads
        this.difficultyRatio = 0;
        if (this.difficulty.name === "easy") {
            this.difficultyRatio = 0.5
        }
        else if (this.difficulty.name === "medium") {
            this.difficultyRatio = 0.4
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

    runVirusTurn() {
        // Check to see if any special events will occur. If so, apply the effects.
        // Check which tiles are currently infected (greater than 0% infected).
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

            //virus statistics, with the effects taking place
            // let infectivity = this.difficulty.getInfectivity() + this.effects.getInfectivity();
            // let severity = this.difficulty.getSeverity() + this.effects.getSeverity();
            // let lethality = this.difficulty.getLethality() + this.effects.getLethality();

            // //individual tile statistics, with the effects taking place
            // let recoveryRate = this.cityTiles[index].getRecoveryRate() + this.effects.getRecovery();
            // let newMorale = this.cityTiles[index].getMorale() + this.effects.getMorale();
            
            //virus statistics
            let infectivity = this.difficulty.getInfectivity();
            let severity = this.difficulty.getSeverity();
            let lethality = this.difficulty.getLethality();

            //individual tile statistics, with the effects taking place
            let recoveryRate = this.cityTiles[index].getRecoveryRate();
            let newMorale = this.cityTiles[index].getMorale();

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
                died = Math.floor(currentInfected * lethality);
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
            newMorale = newMorale - (severity * (newInfected + currentInfected)/totalPopulation + deadPeople / totalPopulation);
            if (newMorale < 0) {
                newMorale = 0;
            }

            // If # of infected exceeds a certain ratio, check to see if the infection spreads to surrounding tiles.
            if(this.cityTiles[index].getInfectedPercentage () >= this.difficultyRatio){
                let randomNumber = Math.random();
                let numberArray = [-21, -20, -19, -1, 1, 19, 20, 21];
                // If the random # is equal to or less than the infected tile's infectivity rate,
                // pick a random tile next to the infected tile, and add a random number of infected to the new tile.
                if(random <= this.cityTiles[index].getInfectivityRate()){
                    randomNumber = Math.floor(Math.random() * 9);
                }
            }

            // If # of infected exceeds a certain ratio, check to see if the infection spreads to surrounding tiles.
            // if (this.cityTiles[index].getInfectedPercentage() > this.difficultyRatio) {
            //     random = Math.random();
            //     // If the random # is equal to or less than the infected tile's infectivity rate,
            //     // pick a random tile and add a random number of infected to the tile.
            //     if (random <= this.cityTiles[index].getInfectivityRate()) {
            //         // get the surrounding tiles and place it in an array
            //         let surroundingTileArray = this.getSurroundingTiles(this.cityTiles, index);
            //         console.log(surroundingTileArray);
            //         // pick a random tile to infect from the surrounding tiles.
            //         let num = Math.floor(Math.random() * surroundingTileArray.length)
            //         let newTileIndex = surroundingTileArray[num];
            //         // pick a random number of people to be infected (between 1,000-2,000 * virus infectivity)
            //         let numberOfNewInfected = Math.floor(Math.random() * 1000 * this.difficulty.getInfectivity()) + 1000;
            //         //infect the new tile with the new number of infected
            //         this.cityTiles[newTileIndex].infected = numberOfNewInfected;
            //         //add the new tile index to the array of infectedTiles
            //         this.infectedTiles.push(newTileIndex);
            //     }
            // }

            // Apply the new numbers to the tile.
            this.cityTiles[index].population = currentPopulation;
            this.cityTiles[index].infected = currentInfected + newInfected;
            this.cityTiles[index].dead += died;
            this.cityTiles[index].morale = newMorale;
        }
        console.log("Tiles infected: " + this.infectedTiles.length);

        //@TODO:
        // * Calculate overall threat level based on infection, severity, morality of the disease, and the city-wide morale

        // Increase the cure progress.
        this.game.gameData.cure += this.difficulty.getDailyCureProgress();

        // Randomly pick infectivity, severity, or morality to increase.
        // The different chances of values being increased are weighed in favor of infectivity > severity > morality.
        let pick = Math.floor(Math.random() * 7);
        if (pick < 3) { //1/2 chance of infectivity increasing
            this.difficulty.infectivity += 0.05;
        }
        else if (pick >= 3 && pick < 5) { //1/3 chance of severity increasing
            this.difficulty.severity += 0.05;
        }
        else { //1/6 chance of lehtality increasing
            this.difficulty.lethality += 0.05;
        }
        console.log("Infectivity: " + this.difficulty.infectivity);
        console.log("Severity: " + this.difficulty.severity);
        console.log("Lethality: " + this.difficulty.lethality);
        console.log("Cure Progress: " + Math.floor(this.game.gameData.cure * 100) + "%");
    }

    // returns an array of integers that point to the infectable tiles that surround a partiulcar tile at initIndex
    getSurroundingTiles(tileArray, initIndex) {
        //an array of index numbers
        let surroundingTiles = [];
        //check north west
        if (initIndex - 21 >= 0) {
            if (tileArray[initIndex - 21].infectable() && tileArray[initIndex - 21].getDead === 0 && tileArray[initIndex - 21].getInfected === 0) {
                surroundingTiles.push(initIndex - 21);
            }
        }

        //check north
        if (initIndex - 20 >= 0) {
            if (tileArray[initIndex - 20].infectable() && tileArray[initIndex - 20].getDead === 0 && tileArray[initIndex - 20].getInfected === 0) {
                surroundingTiles.push(initIndex - 20);
            }
        }
        //check north east
        if (initIndex - 19 >= 0) {
            if (tileArray[initIndex - 19].infectable() && tileArray[initIndex - 19].getDead === 0 && tileArray[initIndex - 19].getInfected === 0) {
                surroundingTiles.push(initIndex - 19);
            }
        }

        //check west
        if (initIndex - 1 >= 0) {
            if (tileArray[initIndex - 1].infectable() && tileArray[initIndex - 1].getDead === 0 && tileArray[initIndex - 1].getInfected === 0) {
                surroundingTiles.push(initIndex - 1);
            }
        }
        //check east
        if (initIndex + 1 <= 400) {
            if (tileArray[initIndex + 1].infectable() && tileArray[initIndex + 1].getDead === 0 && tileArray[initIndex + 1].getInfected === 0) {
                surroundingTiles.push(initIndex + 1);
            }
        }
        //check south west
        if (initIndex + 19 <= 400) {
            if (tileArray[initIndex + 19].infectable() && tileArray[initIndex + 19].getDead === 0 && tileArray[initIndex + 10].getInfected === 0) {
                surroundingTiles.push(initIndex + 19);
            }
        }
        //check south
        if (initIndex + 20 <= 400) {
            if (tileArray[initIndex + 20].infectable() && tileArray[initIndex + 20].getDead === 0 && tileArray[initIndex + 20].getInfected === 0) {
                surroundingTiles.push(initIndex + 20);
            }
        }
        //check south east
        if (initIndex + 21 <= 400) {
            if (tileArray[initIndex + 21].infectable() && tileArray[initIndex + 21].getDead === 0 && tileArray[initIndex + 21].getInfected === 0) {
                surroundingTiles.push(initIndex + 21);
            }
        }
        return surroundingTiles;
    }
}