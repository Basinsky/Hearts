//
//  hearts-Cameralock.js
//  
//  Created by Basinsky on 24 Feb 2021
//  
//  camera lock script for hearts game  
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

(function() {
    var myID; 
    var myPosition;
    var myParentID;
    var mySeatNumber;    
    var myParentPosition;
    var reset = false;
    var RESET_TIME = 500;
    var LOCATION_ROOT_URL = Script.resolvePath(".");
    var clickSound = SoundCache.getSound(LOCATION_ROOT_URL + "448086__breviceps__normal-click.wav");  
    var toggle = false;  
    
    this.preload = function (entityID) {
        myID = entityID;        
        mySeatNumber = Entities.getEntityProperties(myID,["description"]).description;
        myParentID = Entities.getEntityProperties(myID,["parentID"]).parentID;
        myPosition = Entities.getEntityProperties(myID,["position"]).position; 
      
         
    };
    
    function click() {
        var user = Account.username;       
        if (reset) {            
            var injectorOptions = {
                position: MyAvatar.position,
                volume: 1,
                localOnly: true            
            };
            Audio.playSound(clickSound, injectorOptions);
            if (!HMD.active) {
                
                if (!toggle) {
                    print("Entity");                    
                    var ents = Entities.findEntities(myPosition,100);
                    for (var i in ents ) {
                        var checkProps = Entities.getEntityProperties(ents[i]);
                        if (checkProps.name === "heartsCamera" + mySeatNumber) {
                            Camera.mode = "entity";
                            Camera.cameraEntity = checkProps.id;
                            print("found Camera");  
                        }                    
                    }
                } 
                if (toggle) {
                    print("first person");
                    Camera.mode = "first person";                   
                }
                toggle = !toggle;               
            }
            reset = false;
        }         
    }

    Script.setInterval(function () {
        reset = true;    
    }, RESET_TIME);

    this.startNearTrigger = click;
    this.clickDownOnEntity = click;
    this.startFarTrigger = click;
});
