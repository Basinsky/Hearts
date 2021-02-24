//
//  hearts-Server.js
//  
//  Created by Basinsky on 24 Feb 2021
//  
//  Server script for hearts game  
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

(function() {    
    var myID;   
    var playerData = {"players": []};    
    var CARDS_PER_HAND = 13;
    var MAX_PLAYERS = 4;
    var newDeck;    
    var trick = [0];
    var seatsTaken = ["free","free","free","free"];
    var turn = 0;  
    var isInProgress = false; 
    var textDisplay0ID;
    var textDisplay1ID;
    var textDisplay2ID;
    var textDisplay3ID;
    var indicator0ID;
    var indicator1ID;
    var indicator2ID;
    var indicator3ID;
    var display = ["X","X","X","X"];
    var indicator = ["X","X","X","X"];
    var suit = "";
    var waitForNextRound = true;
    var OFF_COLOR = { r: 100, g: 100, b: 0 };
    var ON_COLOR = { r: 200, g: 200, b: 0 };
    var START_COLOR = { r: 0, g: 100, b: 0 };
    var YOU_HAVE_SUIT_MESSAGE_TIME_MS = 2000;
    var END_ROUND_WAIT_TIME_MS = 3000;
    var STARTUP_TIME_MS = 1000;

    this.remotelyCallable = [
        "registerUser",
        "reset",
        "playCardRequest"                       
    ];

    this.preload = function (entityID) {
        myID = entityID;             
    };

    this.registerUser = function(id,param) {
        if (!isInProgress) {            
            var candidateID = param[0];
            var candidateName = param[1];
            var userAccount = param[2];
            var seat = parseInt(param[3]);           
            if (seatsTaken[seat] === "free") {
                playerData.players.push({
                    "id": candidateID,
                    "name": candidateName,
                    "userAccount": userAccount,
                    "seat": seat,
                    "totalscore": 0,
                    "score": 0,
                    "hand": null,
                    "tricks": 0                    
                });
                seatsTaken[seat] = "taken";                          
                Entities.editEntity(display[seat],{text: candidateName});
                Entities.editEntity(indicator[seat],{color: OFF_COLOR});                         
            } else if (seatsTaken[seat] === "taken") {                
                for (var i = 0; i < playerData.players.length; i++) {
                    if (userAccount === playerData.players[i].userAccount && seat === playerData.players[i].seat ) {
                        playerData.players.splice(i,1);
                        seatsTaken[seat] = "free";                       
                        Entities.editEntity(display[seat],{text: "P" + seat + "-Click button to play"});
                        Entities.editEntity(indicator[seat],{color: START_COLOR});                       
                    }
                }
            }
            if (playerData.players.length >= MAX_PLAYERS) {
                print("starting game");
                isInProgress = true;
                startGame();
            }
        }        
    };

    this.playCardRequest = function(id,param) {        
        var userAccount = param[2];
        var requestedCard = param[3];
        var requestedCardID = param[4];        
        if (waitForNextRound) {
            for (var i = 0; i < playerData.players.length; i++) {
                if (userAccount === playerData.players[i].userAccount) {
                    if (playerData.players[i].seat === turn) {
                        var canPlay = false;
                        var myHand = playerData.players[i].hand;                    
                        if (myHand.indexOf(requestedCard) !== -1) {
                            if (trick.length === 1) {
                                suit = requestedCard.slice(0,1);                                
                                canPlay = true; 
                            }                        
                            if (trick.length >= 2) {
                                if (requestedCard.slice(0,1) === suit) {                                   
                                    canPlay = true;
                                } else {                                    
                                    var haveSuit = false;
                                    for (var l = 0; l < myHand.length; l++ ) {
                                        if (myHand[l].slice(0,1) === suit) {
                                            haveSuit = true;                                            
                                        }                                   
                                    }
                                    if (haveSuit) {
                                        Entities.editEntity(display[turn],{text: "You have suit!"});
                                        Script.setTimeout(function () {         
                                            updateScore();   
                                        }, YOU_HAVE_SUIT_MESSAGE_TIME_MS);
                                    } else {                                        
                                        canPlay = true;
                                    }
                                }
                            } 
                        }
                        if (canPlay) {
                            Entities.callEntityClientMethod(
                                playerData.players[i].id,              
                                myID, 
                                "playCard",
                                [requestedCard,requestedCardID,playerData.players[i].seat]
                            );

                            var index = myHand.indexOf(requestedCard);
                            myHand.splice(index,1);
                            turn++;                            
                            var turnIndicator = trick[0]+turn;
                            updateIndicators(turnIndicator);
                            trick.push(requestedCard);                           
                            if (turn >= 4 ) {                            
                                turn = 0;                                                 
                            } 
                
                            if (trick.length >= 5 ) {
                                waitForNextRound = false; 
                                turn = checkTrickWinner(trick);
                                Script.setTimeout(function () {
                                    var children = Entities.getChildrenIDs(myID);        
                                    for (var i in children) {
                                        var entityProps = Entities.getEntityProperties(children[i]);
                                        if (entityProps.name === "played") {
                                            Entities.deleteEntity(entityProps.id);
                                        }
                                    }
                                    trick = [];
                                    trick.push(turn);
                                    suit = ""; 
                                    waitForNextRound = true;                                            
                                }, END_ROUND_WAIT_TIME_MS);                                                
                            } 
                        }    
                    }
                }            
            } 
        }       
    };

    // Use Dealer class from https://gist.github.com/1149151
    var Dealer = function (decks, suits, cards) {

        var pack = [],	// cards yet to be dealt (stock/shoe)
            played = 0,	// cards already dealt,
            suitsLen,
            cardsLen,
            i,
            j,
            
            // Fisher-Yates shuffle - http://jsfromhell.com/array/shuffle
            shuffle = function () { 
                for (var j, x, p = pack, i = p.length; i; j = ~~(Math.random() * i), x = p[--i], p[i] = p[j], p[j] = x);
            };

        // pack defaults
        decks = decks || 1;
        suits = suits || ['H', 'C', 'D', 'S'];
        cards = cards || [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

        suitsLen = j = suits.length;
        cardsLen = cards.length;

        // generate single deck
        while (j--) {
            for (i = 0; i < cardsLen; i++) {
                pack.push(suits[j] + cards[i]);
            }
        }

        // put the right number of decks in the pack
        while (--decks) {
            pack = pack.concat(pack.slice(0, suitsLen * cardsLen));
        }

        // shuffle the new pack
        shuffle();

        return {

            // deals from the top of the deck, defaults to 1 card
            deal: function (num) {
                num = num || 1;
                played += num;
                return pack.slice(played - num, played);
            },

            // put the played cards back in the deck and reshuffle
            resetDeck: function () {
                played = 0;
                shuffle();
            }
        };
    };

    function checkTrickWinner(currentTrick) {
        var seatWhoStartedRound = currentTrick[0];
        var suit = currentTrick[1].slice(0,1);
        var highestValue = 0;
        var playerWithHighestCard = 0;
        var roundWinner = 0;
        var points = 0;
        for (var i = 1; i < currentTrick.length; i++) {           
            if (currentTrick[i].slice(0,1) === suit) {
                var getValue = parseInt(currentTrick[i].slice(1));
                if (getValue > highestValue) {
                    highestValue = getValue;
                    playerWithHighestCard = i;
                }
            }
        }
        for (var j = 1; j < currentTrick.length; j++) {
            if (currentTrick[j] === "C21") {
                points = points + 2;
            }
            if (currentTrick[j] === "S22") {
                points = points + 5;
            }
            if (currentTrick[j].slice(0,1) === "H") {
                points++;
            }
        }
        roundWinner = (playerWithHighestCard-1) + seatWhoStartedRound;
        if (roundWinner > 3) {
            roundWinner = roundWinner - 4;
        }        
        playerData.players[roundWinner].tricks = playerData.players[roundWinner].tricks + 1;
        playerData.players[roundWinner].score = playerData.players[roundWinner].score + points;
        updateScore();
        updateIndicators(roundWinner);  
        print ("winner of the round was seat: " + roundWinner + " and got: " + points + "points");
        print ("suit: " + suit);        
        return roundWinner;        
    }

    function setupNewRound() {
        newDeck.resetDeck();
        for (var i = 0; i < playerData.players.length; i++) {
            playerData.players[i].hand = newDeck.deal(CARDS_PER_HAND);
            playerData.players[i].score = 0;
            playerData.players[i].tricks = 0;            
            Entities.callEntityClientMethod(
                playerData.players[i].id,              
                myID, 
                "transferHand",
                [playerData.players[i].seat,JSON.stringify(playerData.players[i].hand)]
            );
        }
        turn = 0;
        updateScore();  
        updateIndicators(0);     
    }

    function startGame() { 
        newDeck = new Dealer;
        Entities.editEntity(indicator[0],{color: ON_COLOR});   
        for (var j = 0; j < playerData.players.length; j++) {
            playerData.players[j].totalscore = 0;        
        }
        setupNewRound();
    }

    function setupEntities() {
        var children = Entities.getChildrenIDs(myID);        
        for (var i in children) {
            var entityProps = Entities.getEntityProperties(children[i]);
            if (entityProps.type === "Text") {
                if (entityProps.description === "0") {
                    textDisplay0ID = entityProps.id;
                    display[0] = textDisplay0ID;                    
                }
                if (entityProps.description === "1") {
                    textDisplay1ID = entityProps.id;
                    display[1] = textDisplay1ID; 
                }
                if (entityProps.description === "2") {
                    textDisplay2ID = entityProps.id;
                    display[2] = textDisplay2ID; 
                }
                if (entityProps.description === "3") {
                    textDisplay3ID = entityProps.id;
                    display[3] = textDisplay3ID; 
                }
            }            
            if (entityProps.name.slice(0,14) === "HeartsRegister") {
                if (entityProps.description === "0") {
                    indicator0ID = entityProps.id;
                    indicator[0] = indicator0ID;                    
                }
                if (entityProps.description === "1") {
                    indicator1ID = entityProps.id;
                    indicator[1] = indicator1ID; 
                }
                if (entityProps.description === "2") {
                    indicator2ID = entityProps.id;
                    indicator[2] = indicator2ID; 
                }
                if (entityProps.description === "3") {
                    indicator3ID = entityProps.id;
                    indicator[3] = indicator3ID; 
                }
            }
            print(JSON.stringify(indicator));
        }
    }

    function updateScore() {
        var totalTricks = 0;
        for (var i = 0; i < playerData.players.length; i++) {
            totalTricks = totalTricks + playerData.players[i].tricks;            
        }

        for (var j = 0; j < playerData.players.length; j++) {
            if (totalTricks >= 13) {
                playerData.players[j].totalscore =
                playerData.players[j].totalscore + playerData.players[j].score;
                playerData.players[j].score = 0;                         
            }
            Entities.editEntity(display[j],{text:
                "tricks: " + playerData.players[j].tricks +
                " score: " + playerData.players[j].score +
                " tot: " + playerData.players[j].totalscore
            });
        }
        if (totalTricks >= 13) {
            setupNewRound();
        }
    }

    function updateIndicators(theWinner) {
        for (var i = 0; i <= indicator.length; i++) {
            if (i === theWinner) {
                Entities.editEntity(indicator[i],{color: ON_COLOR}); 
            } else {
                Entities.editEntity(indicator[i],{color: OFF_COLOR}); 
            }
        }
    }
     
    // begin program
    Script.setTimeout(function () {         
        setupEntities();       
    }, STARTUP_TIME_MS); 
});