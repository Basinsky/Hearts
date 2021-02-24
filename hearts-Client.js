//
//  hearts-Client.js
//  
//  Created by Basinsky on 24 Feb 2021
//  
//  Client script for hearts game
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

(function() {
    var myID;
    var reset = false;
    var RESET_TIME = 500;     
    var LOCATION_ROOT_URL = Script.resolvePath(".");
    var heartsUser;  
    var sortedHand = []; 
    var cards = [];   
    var clickSound = SoundCache.getSound(LOCATION_ROOT_URL + "448086__breviceps__normal-click.wav");
    var channelName = "Hifi-Object-Manipulation";
    var LOCAL_ENTITY_SEARCH_SPHERE = 200;
    var HALF_CIRCLE_DEGREE = 180; 

    this.remotelyCallable = [
        "transferHand",
        "playCard"                                  
    ];

    this.preload = function (entityID) {
        myID = entityID;
        heartsUser = Account.username; 
    };
    
    this.transferHand = function (id,param) { 
        var seat = parseInt(param[0]);       
        var hand = JSON.parse(param[1]);
        var cardID;
        var startRotation = generateQuatFromDegreesViaRadians (-90 , (seat * 90) + 180, 0);
        sortedHand = hand.sort();

        if (seat === 0) {
            for (var i = 0; i < hand.length; i++) {
                cardID = Entities.addEntity({
                    type: "Image",
                    name: sortedHand[i],        
                    visible: true,
                    localPosition: { x: 0.5 - (i/12), y: 0.52, z: -0.6 },                
                    localRotation: startRotation,                    
                    parentID: myID,       
                    imageURL: LOCATION_ROOT_URL + "Cards/" + sortedHand[i] + ".svg",
                    userData: JSON.stringify({grabbableKey: { grabbable: true, triggerable: false}})        
                },"local");
                cards.push(cardID);
            }            
        }

        if (seat === 1) {           
            for (var l = 0; l < hand.length; l++) {
                cardID = Entities.addEntity({
                    type: "Image",
                    name: sortedHand[l],        
                    visible: true,
                    localPosition: { x: 0.6 , y: 0.52, z: 0.5 - (l/12) },                 
                    localRotation: startRotation,                    
                    parentID: myID,       
                    imageURL: LOCATION_ROOT_URL + "Cards/" + sortedHand[l] + ".svg",
                    userData: JSON.stringify({grabbableKey: { grabbable: true, triggerable: false}})                            
                },"local");
                cards.push(cardID);
            }
        }
        
        if (seat === 2) {           
            for (var k = 0; k < hand.length; k++) {
                cardID = Entities.addEntity({
                    type: "Image",
                    name: sortedHand[k],        
                    visible: true,
                    localPosition: { x: -0.5 + (k/12), y: 0.52, z: 0.6 },               
                    localRotation: startRotation,                   
                    parentID: myID,       
                    imageURL: LOCATION_ROOT_URL + "Cards/" + sortedHand[k] + ".svg",
                    userData: JSON.stringify({grabbableKey: { grabbable: true, triggerable: false}})        
                },"local");
                cards.push(cardID);
            }
           
        }
        if (seat === 3) {           
            for (var j = 0; j < hand.length; j++) {
                cardID = Entities.addEntity({
                    type: "Image",
                    name: sortedHand[j],        
                    visible: true,
                    localPosition: { x: -0.6 , y: 0.52, z: -0.5 + (j/12) },           
                    localRotation: startRotation,                   
                    parentID: myID,       
                    imageURL: LOCATION_ROOT_URL + "Cards/" + sortedHand[j] + ".svg",
                    userData: JSON.stringify({grabbableKey: { grabbable: true, triggerable: false}})        
                },"local");
                cards.push(cardID);
            }
        }            
    };

    this.playCard = function (id,param) {
        var cardToBePlayedID = Uuid.fromString(param[1]); 
        var mySeat = parseInt(param[2]);        
        var myProps;
        var playRotation = generateQuatFromDegreesViaRadians (-90 , (mySeat * 90) + 180, 0);
        if (mySeat === 0) {
            myProps = Entities.getEntityProperties(cardToBePlayedID);
            Entities.addEntity({
                type: "Image",
                name: "played",
                localPosition: { x: 0, y: 0.52, z: -0.2 },           
                localRotation: playRotation,
                dimensions: { x: 0.14, y: 0.18, z: 0.01 },               
                parentID: myID,       
                imageURL: myProps.imageURL,
                userData: JSON.stringify({grabbableKey: { grabbable: false, triggerable: false}})
            },"domain");
            Entities.deleteEntity(cardToBePlayedID);
        }
        if (mySeat === 1) {
            myProps = Entities.getEntityProperties(cardToBePlayedID);
            Entities.addEntity({
                type: "Image",
                localPosition: { x: 0.2, y: 0.52, z: 0 },
                localRotation: playRotation,
                dimensions: { x: 0.14, y: 0.18, z: 0.01 }, 
                name: "played",         
                parentID: myID,       
                imageURL: myProps.imageURL,
                userData: JSON.stringify({grabbableKey: { grabbable: false, triggerable: false}})
            },"domain");
            Entities.deleteEntity(cardToBePlayedID);
        } 
        
        if (mySeat === 2) {
            myProps = Entities.getEntityProperties(cardToBePlayedID);
            Entities.addEntity({
                type: "Image",
                localPosition: { x: 0, y: 0.52, z: 0.2 },
                localRotation: playRotation,
                dimensions: { x: 0.14, y: 0.18, z: 0.01 }, 
                name: "played",             
                parentID: myID,       
                imageURL: myProps.imageURL,
                userData: JSON.stringify({grabbableKey: { grabbable: false, triggerable: false}})
            },"domain");
            Entities.deleteEntity(cardToBePlayedID);
        }
        if (mySeat === 3) {
            myProps = Entities.getEntityProperties(cardToBePlayedID);
            Entities.addEntity({
                type: "Image",
                localPosition: { x: -0.2, y: 0.52, z: 0 },
                localRotation: playRotation,
                dimensions: { x: 0.14, y: 0.18, z: 0.01 }, 
                name: "played",           
                parentID: myID,       
                imageURL: myProps.imageURL,
                userData: JSON.stringify({grabbableKey: { grabbable: false, triggerable: false}})
            },"domain");
            Entities.deleteEntity(cardToBePlayedID); 
        }
    };

    function generateQuatFromDegreesViaRadians(rotxdeg,rotydeg,rotzdeg) {
        var rotxrad = (rotxdeg/HALF_CIRCLE_DEGREE)*Math.PI;
        var rotyrad = (rotydeg/HALF_CIRCLE_DEGREE)*Math.PI;
        var rotzrad = (rotzdeg/HALF_CIRCLE_DEGREE)*Math.PI;          
        var newRotation = Quat.fromPitchYawRollRadians(rotxrad,rotyrad,rotzrad); 
        return newRotation;
    }

    Entities.mousePressOnEntity.connect(function (entityID, event) {
        // print(JSON.stringify(event));
        if (event.isLeftButton) {            
            if (cards.indexOf(entityID) !== -1) {
                var props = Entities.getEntityProperties(entityID);
                var injectorOptions = {
                    position: MyAvatar.position,
                    volume: 1,
                    localOnly: true            
                };
                Audio.playSound(clickSound, injectorOptions);   
                print ("player " + heartsUser + "wants to play card: " + props.name);
                Entities.callEntityServerMethod(              
                    myID, 
                    "playCardRequest",
                    [MyAvatar.sessionUUID,MyAvatar.displayName,heartsUser,props.name,props.id]
                );
            } 
        }
    });
    
    function onMessageReceived(channel, message, senderID) {
        if (reset) {        
            if (channel === channelName && senderID === MyAvatar.sessionUUID) {   
                var action = JSON.parse(message).action;
                var grabbedEnt = JSON.parse(message).grabbedEntity;
                var releasedEnt = Uuid.fromString(grabbedEnt);                
                if (action === "release") {                        
                    if (cards.indexOf(releasedEnt) !== -1) {
                        var props = Entities.getEntityProperties(releasedEnt);
                        print ("player " + heartsUser + "wants to play card: " + props.name);
                        Entities.callEntityServerMethod(              
                            myID, 
                            "playCardRequest",
                            [MyAvatar.sessionUUID,MyAvatar.displayName,heartsUser,props.name,props.id]
                        );
                    }
                }            
            }
            reset = false;
        }
    }
            
    Script.setInterval(function () {
        reset = true;    
    }, RESET_TIME);
    
    function deleteLocalEntities() {
        var allLocalEntities = Overlays.findOverlays(MyAvatar.position,LOCAL_ENTITY_SEARCH_SPHERE);
        for (var n in allLocalEntities) {            
            var localProps = Entities.getEntityProperties(allLocalEntities[n]);            
            if (localProps.name === "played") {
                Overlays.deleteOverlay(localProps.id);
            }
        }    
    }
    
    function onDomainChanged() {
        deleteLocalEntities();       
    }
    Window.domainChanged.connect(onDomainChanged);

    Messages.subscribe(channelName);
    Messages.messageReceived.connect(onMessageReceived);
});
