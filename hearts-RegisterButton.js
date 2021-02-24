//
//  hearts-Registerbutton.js
//  
//  Created by Basinsky on 24 Feb 2021
//  
//  Register button script for hearts game  
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//
(function() {
    var myID; 
    var myParentID;
    var mySeatNumber;
    var reset = false;
    var RESET_TIME = 500;
    var LOCATION_ROOT_URL = Script.resolvePath(".");
    var clickSound = SoundCache.getSound(LOCATION_ROOT_URL + "448086__breviceps__normal-click.wav");    
    
    this.preload = function (entityID) {
        myID = entityID;
        myParentID = Entities.getEntityProperties(myID,["parentID"]).parentID;
        mySeatNumber = Entities.getEntityProperties(myID,["description"]).description;     
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
            print(user + "start is Clicked!");           
            Entities.callEntityServerMethod(                             
                myParentID, 
                "registerUser",
                [MyAvatar.sessionUUID,MyAvatar.displayName,user,mySeatNumber]
            );            
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
