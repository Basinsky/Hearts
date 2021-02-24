//
//  hearts-Spawner.js
//  
//  Created by Basinsky on 24 Feb 2021
//  
//  Spawner script for hearts game 
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

var localRot;
var LOCATION_ROOT_URL = Script.resolvePath(".");
var TIME_OUT_MS = 1000;
var START_COLOR = { r: 0, g: 100, b: 0 };
var HALF_CIRCLE_DEGREE = 180; 

function generateQuatFromDegreesViaRadians(rotxdeg,rotydeg,rotzdeg) {
    var rotxrad = (rotxdeg/HALF_CIRCLE_DEGREE)*Math.PI;
    var rotyrad = (rotydeg/HALF_CIRCLE_DEGREE)*Math.PI;
    var rotzrad = (rotzdeg/HALF_CIRCLE_DEGREE)*Math.PI;          
    var newRotation = Quat.fromPitchYawRollRadians(rotxrad,rotyrad,rotzrad); 
    return newRotation;
}

var mainID = Entities.addEntity({
    type: "Model",        
    name: "HeartsMain",   
    modelURL: LOCATION_ROOT_URL + "cardTable.fbx?" + Date.now(),
    script: LOCATION_ROOT_URL + "hearts-Client.js?" + Date.now(),
    serverScripts: LOCATION_ROOT_URL + "hearts-Server.js?" + Date.now(),       
    position: Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, { x: 0, y: -0.5, z: -2 })),
    color: { r: 0, g: 200, b: 255 },     
    rotation: MyAvatar.orientation,     
    lifetime: -1,            
    userData: JSON.stringify({
        grabbableKey: { grabbable: false, triggerable: false }
    })                          
});


Entities.addEntity({
    type: "Box",        
    name: "HeartsRegister0",
    description: 0,    
    dimensions: { x: 0.1, y: 0.02, z: 0.1}, 
    parentID: mainID,    
    script: LOCATION_ROOT_URL + "hearts-RegisterButton.js?" + Date.now(),       
    localPosition: { x: 0, y: 0.5, z: -0.94 },
    color: START_COLOR,     
    rotation: MyAvatar.orientation,     
    lifetime: -1,            
    userData: JSON.stringify({
        grabbableKey: { grabbable: false, triggerable: true }
    })                          
});

Entities.addEntity({
    type: "Box",        
    name: "HeartsRegister1",
    description: 1,    
    dimensions: { x: 0.1, y: 0.02, z: 0.1},
    parentID: mainID,    
    script: LOCATION_ROOT_URL + "hearts-RegisterButton.js?" + Date.now(),       
    localPosition: { x: 0.94, y: 0.5, z: 0 },
    color: START_COLOR,     
    rotation: MyAvatar.orientation,     
    lifetime: -1,            
    userData: JSON.stringify({
        grabbableKey: { grabbable: false, triggerable: true }
    })                          
});

Entities.addEntity({
    type: "Box",        
    name: "HeartsRegister2",
    description: 2,    
    dimensions: { x: 0.1, y: 0.02, z: 0.1},
    parentID: mainID,    
    script: LOCATION_ROOT_URL + "hearts-RegisterButton.js?" + Date.now(),          
    localPosition: { x: 0, y: 0.5, z: 0.94 },
    color: START_COLOR,     
    rotation: MyAvatar.orientation,     
    lifetime: -1,            
    userData: JSON.stringify({
        grabbableKey: { grabbable: false, triggerable: true }
    })                          
});

Entities.addEntity({
    type: "Box",        
    name: "HeartsRegister3",
    description: 3,    
    dimensions: { x: 0.1, y: 0.02, z: 0.1},
    parentID: mainID,    
    script: LOCATION_ROOT_URL + "hearts-RegisterButton.js?" + Date.now(),          
    localPosition: { x: -0.94, y: 0.5, z: 0 },
    color: START_COLOR,     
    rotation: MyAvatar.orientation,     
    lifetime: -1,            
    userData: JSON.stringify({
        grabbableKey: { grabbable: false, triggerable: true }
    })                          
});

var myRotation = generateQuatFromDegreesViaRadians (-90 , -180, 0);
Entities.addEntity({
    type: "Text",        
    name: "HeartsDisplay0",
    description: 0,    
    dimensions: { x: 0.5, y: 0.08, z: 0.01},
    text: "P0-Click button to play", 
    parentID: mainID,
    lineHeight: 0.04,
    leftMargin: 0.02,
    topMargin: 0.01,
    alignment: "center",
    localPosition: { x: 0, y: 0.51, z: -0.8 },     
    localRotation: myRotation,          
    lifetime: -1,            
    userData: JSON.stringify({
        grabbableKey: { grabbable: false, triggerable: false }
    })                          
});

myRotation = generateQuatFromDegreesViaRadians (-90 , 90, 0);
Entities.addEntity({
    type: "Text",        
    name: "HeartsDisplay1",
    description: 1,    
    dimensions: { x: 0.5, y: 0.08, z: 0.01}, 
    text: "P1-Click button to play", 
    parentID: mainID,
    lineHeight: 0.04,
    leftMargin: 0.02,
    topMargin: 0.01,
    alignment: "center",
    localPosition: { x: 0.8, y: 0.51, z: 0 },     
    localRotation: myRotation,          
    lifetime: -1,            
    userData: JSON.stringify({
        grabbableKey: { grabbable: false, triggerable: false }
    })                          
});

myRotation = generateQuatFromDegreesViaRadians (-90 , 0, 0);
Entities.addEntity({
    type: "Text",        
    name: "HeartsDisplay2",
    description: 2,    
    dimensions: { x: 0.5, y: 0.08, z: 0.01},
    text: "P2-Click button to play",  
    parentID: mainID,
    lineHeight: 0.04,
    leftMargin: 0.02,
    topMargin: 0.01,
    alignment: "center",
    localPosition: { x: 0, y: 0.51, z: 0.8 },     
    localRotation: myRotation,     
    lifetime: -1,            
    userData: JSON.stringify({
        grabbableKey: { grabbable: false, triggerable: false }
    })                          
});

myRotation = generateQuatFromDegreesViaRadians (-180 , -90, 90);
Entities.addEntity({
    type: "Text",        
    name: "HeartsDisplay3",
    description: 3,   
    dimensions: { x: 0.5, y: 0.08, z: 0.01},
    text: "P3-Click button to play",  
    parentID: mainID,
    lineHeight: 0.04,
    leftMargin: 0.02,
    topMargin: 0.01,
    alignment: "center",
    localPosition: { x: -0.8, y: 0.51, z: 0 },     
    localRotation: myRotation,       
    lifetime: -1,            
    userData: JSON.stringify({
        grabbableKey: { grabbable: false, triggerable: false }
    })                          
});

myRotation = generateQuatFromDegreesViaRadians (-90 , -180, 0);
Entities.addEntity({
    type: "Image",        
    name: "HeartsLockCamera0",
    imageURL: LOCATION_ROOT_URL + "lockCamera.svg",
    script: LOCATION_ROOT_URL + "hearts-CameraLock.js?" + Date.now(),
    description: 0,   
    dimensions: { x: 0.1, y: 0.1, z: 0.01},    
    parentID: mainID,    
    localPosition: { x: 0.5, y: 0.51, z: -0.8 }, 
    localRotation: myRotation,       
    lifetime: -1,            
    userData: JSON.stringify({
        grabbableKey: { grabbable: false, triggerable: false }
    })                          
});

myRotation = generateQuatFromDegreesViaRadians (-40, 180, 0);
Entities.addEntity({
    type: "Box",        
    name: "heartsCamera0",
    description: 0,
    visible: false,   
    dimensions: { x: 0.1, y: 0.1, z: 0.1}, 
    collisionless: true,   
    parentID: mainID,    
    localPosition: { x: 0, y: 1.4, z: -1.4}, 
    localRotation: myRotation,       
    lifetime: -1,            
    userData: JSON.stringify({
        grabbableKey: { grabbable: false, triggerable: false }
    })                          
});

myRotation = generateQuatFromDegreesViaRadians (-90 , 90, 0);
Entities.addEntity({
    type: "Image",        
    name: "HeartsLockCamera1",
    imageURL: LOCATION_ROOT_URL + "lockCamera.svg",
    script: LOCATION_ROOT_URL + "hearts-CameraLock.js?" + Date.now(),
    description: 1,   
    dimensions: { x: 0.1, y: 0.1, z: 0.01},    
    parentID: mainID,
    localPosition: { x: 0.8, y: 0.51, z: 0.5 }, 
    localRotation: myRotation,       
    lifetime: -1,            
    userData: JSON.stringify({
        grabbableKey: { grabbable: false, triggerable: false }
    })                          
});

myRotation = generateQuatFromDegreesViaRadians (0, 90, 40);
Entities.addEntity({
    type: "Box",        
    name: "heartsCamera1",
    description: 1,
    visible: false,    
    dimensions: { x: 0.1, y: 0.1, z: 0.1}, 
    collisionless: true,   
    parentID: mainID,    
    localPosition: { x: 1.4, y: 1.4, z: 0}, 
    localRotation: myRotation,       
    lifetime: -1,            
    userData: JSON.stringify({
        grabbableKey: { grabbable: false, triggerable: false }
    })                          
});

myRotation = generateQuatFromDegreesViaRadians (-90 , 0, 0);
Entities.addEntity({
    type: "Image",        
    name: "HeartsLockCamera2",
    imageURL: LOCATION_ROOT_URL + "lockCamera.svg",
    script: LOCATION_ROOT_URL + "hearts-CameraLock.js?" + Date.now(),
    description: 2,   
    dimensions: { x: 0.1, y: 0.1, z: 0.01},    
    parentID: mainID,    
    localPosition: { x: -0.5, y: 0.51, z: 0.8 }, 
    localRotation: myRotation,       
    lifetime: -1,            
    userData: JSON.stringify({
        grabbableKey: { grabbable: false, triggerable: false }
    })                          
});

myRotation = generateQuatFromDegreesViaRadians (-40, 0, 0);
Entities.addEntity({
    type: "Box",        
    name: "heartsCamera2",
    description: 2,
    visible: false,    
    dimensions: { x: 0.1, y: 0.1, z: 0.1}, 
    collisionless: true,   
    parentID: mainID,    
    localPosition: { x: 0, y: 1.4, z: 1.4},
    localRotation: myRotation,       
    lifetime: -1,            
    userData: JSON.stringify({
        grabbableKey: { grabbable: false, triggerable: false }
    })                          
});

myRotation = generateQuatFromDegreesViaRadians (-90 , -90, 0);
Entities.addEntity({
    type: "Image",        
    name: "HeartsLockCamera3",
    imageURL: LOCATION_ROOT_URL + "lockCamera.svg",
    script: LOCATION_ROOT_URL + "hearts-CameraLock.js?" + Date.now(),
    description: 3,   
    dimensions: { x: 0.1, y: 0.1, z: 0.01},    
    parentID: mainID,
    localPosition: { x: -0.8, y: 0.51, z: -0.5 },     
    localRotation: myRotation,       
    lifetime: -1,            
    userData: JSON.stringify({
        grabbableKey: { grabbable: false, triggerable: false }
    })                          
});

myRotation = generateQuatFromDegreesViaRadians (0, -90, -40);
Entities.addEntity({
    type: "Box",        
    name: "heartsCamera3",
    description: 3,
    visible: false,    
    dimensions: { x: 0.1, y: 0.1, z: 0.1}, 
    collisionless: true,   
    parentID: mainID,    
    localPosition: { x: -1.4, y: 1.4, z: 0},  
    localRotation: myRotation,       
    lifetime: -1,            
    userData: JSON.stringify({
        grabbableKey: { grabbable: false, triggerable: false }
    })                          
});

var suits = ['H', 'C', 'D', 'S'];
var cards = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
var suitsLen = suits.length;
var j = suits.length;
var cardsLen = cards.length;

while (j--) {
    for (var i = 0; i < cardsLen; i++) {
        var cardName = (suits[j] + cards[i]);
        Entities.addEntity({
            type: "Image",        
            name: cardName,
            imageURL: LOCATION_ROOT_URL + "Cards/" + cardName + ".svg",           
            dimensions: { x: 0.036, y: 0.054, z: 0.01},    
            parentID: mainID,    
            localPosition: { x: 0, y: 0, z: 0 },                 
            lifetime: -1,            
            userData: JSON.stringify({
                grabbableKey: { grabbable: false, triggerable: false }
            })                          
        });
    }
}

Script.stop();

