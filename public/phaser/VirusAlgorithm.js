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
            this.difficultyRatio = 0.75
        }
        else if (this.difficulty.name === "medium") {
            this.difficultyRatio = 0.6
        }
        else {
            this.difficultyRatio = 0.5;
        }

        // push the initial tiles that have been infected to the infectedTiles array.
        // assume that the tiles we've read in are infectable.
        for (let i = 0; i < initialTiles.length; i++) {
            this.infectedTiles.push(initialTiles[i]);
            console.log("Pushed Index #'s: " + this.infectedTiles[i]);
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
            let infectedPeople = this.cityTiles[index].getInfected();
            //calculates the number of healthy people in the tile
            let healthyPeople = currentPopulation - infectedPeople;
            //reads in the current amount of dead people in the tile
            let deadPeople = this.cityTiles[index].getDead();

            //virus statistics, with the effects taking place
            // let infectivity = this.difficulty.getInfectivity() + this.effects.getInfectivity();
            // let severity = this.difficulty.getSeverity() + this.effects.getSeverity();
            // let lethality = this.difficulty.getLethality() + this.effects.getLethality();

            // //individual tile statistics, with the effects taking place
            // let recoveryRate = this.cityTiles[index].getRecoveryRate() + this.effects.getRecovery();
            // let newMorale = this.cityTiles[index].getMorale() + this.effects.getMorale();

            let infectivity = this.difficulty.getInfectivity();
            let severity = this.difficulty.getSeverity();
            let lethality = this.difficulty.getLethality();

            //individual tile statistics, with the effects taking place
            let recoveryRate = this.cityTiles[index].getRecoveryRate();
            let newMorale = this.cityTiles[index].getMorale();

            // Calculate how many new people are infected for each tile
            let newInfected = 0;
            if (healthyPeople > 0) {
                newInfected = healthyPeople * infectivity;
            }

            // Calculates the number of recovered people.
            let recovered = 0;
            let random = Math.random();
            if (infectedPeople > 0 && deadPeople != totalPopulation && random <= recoveryRate) {
                recovered = infectedPeople * recoveryRate;
            }

            // Calculate how many people die within each tile, if any.
            let died = 0;
            random = Math.random();
            if (infectedPeople > 0 && deadPeople != totalPopulation && random <= lethality) {
                died = infectedPeople * lethality;
            }

            // apply the number of newly infected/recovered
            newInfected = newInfected - recovered;
            //if the amount of new infected exceeds the amount of healthy people
            //change the amount of newly infected to the amount of healthy people remaining
            if (newInfected > healthyPeople) {
                newInfected = healthyPeople;
            }
            infectedPeople = infectedPeople + newInfected - died;
            currentPopulation = currentPopulation - died;
            if(infectedPeople > currentPopulation){
                infectedPeople = currentPopulation;
            }

            // Calculate the new morale for the tile using severity and morality.
            newMorale = newMorale - (severity + deadPeople / totalPopulation);
            if(newMorale < 0){
                newMorale = 0;
            }

            // If # of infected exceeds a certain ratio, check to see if the infection spreads to surrounding tiles.
            if (this.cityTiles[index].getInfectedPercentage() > this.difficultyRatio) {
                random = Math.random();
                // If the random # is equal to or less than the infected tile's infectivity rate,
                // pick a random tile and add a random number of infected to the tile.
                if (random <= this.cityTiles[index].getInfectivityRate()) {
                    // get the surrounding tiles and place it in an array
                    let surroundingTileArray = this.getSurroundingTiles(this.cityTiles, index);
                    // pick a random tile to infect from the surrounding tiles.
                    let newTileIndex = surroundingTileArray[Math.floor(Math.random() * surroundingTileArray.length)];
                    // pick a random number of people to be infected (between 1,000-2,000 * virus infectivity)
                    let numberOfNewInfected = Math.floor(Math.random() * 1000 * this.difficulty.getInfectivity()) + 1000;
                    //infect the new tile with the new number of infected
                    this.cityTiles[newTileIndex].infected = numberOfNewInfected;
                    //add the new tile index to the array of infectedTiles
                    this.infectedTiles.push(newTileIndex);
                }
            }

            // Apply the new numbers to the tile.
            console.log("Population: " + currentPopulation);
            console.log("Infected: " + infectedPeople);
            console.log("Dead: " + died);
            console.log("Morale: " + newMorale*100 + "%");
            this.cityTiles[index].population = currentPopulation;
            this.cityTiles[index].infected = infectedPeople;
            this.cityTiles[index].dead = died;
            this.cityTiles[index].morale = newMorale;
        }
        console.log("Tiles infected: " + this.infectedTiles.length);
        // @TODO
        // * Calculate overall morale for the WHOLE city
        // * Calculate overall threat level based on infection, severity, morality of the disease, and the city-wide morale
        // * Check for losing conditions (if threat level == 1.0, OR if morale = 0, OR total infected == total population)

        // Increase the cure progress.
        this.game.cure += this.difficulty.getDailyCureProgress();

        // Randomly pick infectivity, severity, or morality to increase.
        // The different chances of values being increased are weighed in favor of infectivity > severity > morality.
        let pick = Math.floor(Math.random() * 7);
        if(pick < 3){ //1/2 chance of infectivity increasing
            this.difficulty.infectivity += 0.05;
        }
        else if(pick >= 3 && pick < 5){ //1/3 chance of severity increasing
            this.difficulty.severity += 0.05;
        }
        else { //1/6 chance of lehtality increasing
            this.difficulty.morality += 0.05;
        }
    }

    // returns an array of integers that point to the infectable tiles that surround a partiulcar tile at initIndex
    getSurroundingTiles(tileArray, initIndex) {
        //an array of index numbers
        let surroundingTiles = [];
        //check north west
        if (tileArray[initIndex - 21].infectable() && tileArray[initIndex - 21].getDead === 0 && tileArray[initIndex - 21].getInfected === 0) {
            surroundingTiles.push(initIndex - 21);
        }

        //check north
        if (tileArray[initIndex - 20].infectable() && tileArray[initIndex - 20].getDead === 0 && tileArray[initIndex - 20].getInfected === 0) {
            surroundingTiles.push(initIndex - 20);
        }

        //check north east
        if (tileArray[initIndex - 19].infectable() && tileArray[initIndex - 19].getDead === 0 && tileArray[initIndex - 19].getInfected === 0) {
            surroundingTiles.push(initIndex - 19);
        }

        //check west
        if (tileArray[initIndex - 1].infectable() && tileArray[initIndex - 1].getDead === 0 && tileArray[initIndex - 1].getInfected === 0) {
            surroundingTiles.push(initIndex - 1);
        }

        //check east
        if (tileArray[initIndex + 1].infectable() && tileArray[initIndex + 1].getDead === 0 && tileArray[initIndex + 1].getInfected === 0) {
            surroundingTiles.push(initIndex + 1);
        }

        //check south west
        if (tileArray[initIndex + 19].infectable() && tileArray[initIndex + 19].getDead === 0 && tileArray[initIndex + 10].getInfected === 0) {
            surroundingTiles.push(initIndex + 19);
        }

        //check south
        if (tileArray[initIndex + 20].infectable() && tileArray[initIndex + 20].getDead === 0 && tileArray[initIndex + 20].getInfected === 0) {
            surroundingTiles.push(initIndex + 20);
        }

        //check south east
        if (tileArray[initIndex + 21].infectable() && tileArray[initIndex + 21].getDead === 0 && tileArray[initIndex + 21].getInfected === 0) {
            surroundingTiles.push(initIndex + 21);
        }

        return surroundingTiles;
    }
}