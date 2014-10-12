(function() {
    'use strict';
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, Phaser.CANVAS, 'phaser-game', 
        { preload: preload, create: create, render: render });
    var rotationAlpha;
    var rotationBeta;
    var rotationGamma;
    var orientationText;
    var sprite;
    var textureKeys = [];

    function preload() {
        game.load.image('earth', 'earth.png');
        textureKeys.push('earth');
        
        game.load.image('pokeball', 'pokeball.png');
        textureKeys.push('pokeball');
        
        game.load.image('protractor', 'protractor.png');
        textureKeys.push('protractor');
        
        game.load.image('tennisball', 'tennisball.png');
        textureKeys.push('tennisball');
        
        game.load.image('startrek', 'startrek.png');
        textureKeys.push('startrek');
    }
        
    function create() {
        sprite = game.add.sprite(game.world.centerX, game.world.centerY);
        initializeSprite('protractor');
        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(spritePressed);
    
        orientationText = game.add.text(10, 20);
        orientationText.fill = 'white';
        
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', orientationEvent, false);
        }
    }
    
    function orientationEvent(eventData) {
        rotationAlpha = eventData.alpha;
        rotationBeta = eventData.beta;
        rotationGamma = eventData.gamma;
        
        sprite.angle = rotationAlpha;
    }
    
    function spritePressed() {
        //advance the sprite to the "next" texture, wrapping around if necessary
        var index = textureKeys.indexOf(sprite.key);
        index = (index < 0)? 0 : (index + 1) % textureKeys.length;
        initializeSprite(textureKeys[index]);
    }
    
    function initializeSprite(key) {
        sprite.loadTexture(key);
        sprite.anchor.set(0.5);
        sprite.width = Math.min(game.width, game.height);
        sprite.height = sprite.width;
    }
    
    function render() {
        var orientation = isDevicePortrait()? "Portrait" : "Landscape";
        orientationText.text = "Device Orientation: " + orientation + "\n\nAlpha: " + Math.round(rotationAlpha) + 
            "\nBeta: " + Math.round(rotationBeta) + "\nGamma: " + Math.round(rotationGamma);
    }
    
    function isDevicePortrait() {
        return (game.scale.orientation === 0);
    }
}());