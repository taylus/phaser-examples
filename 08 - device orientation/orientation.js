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

    //game preload callback: preloads all assets
    //I'm maintaining a separate array of loaded texture keys
    //pulling them out of the game's cache seems possible but not very supported
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
        
        game.load.image('awesome', 'awesome.png');
        textureKeys.push('awesome');
        
        game.load.image('doge', 'doge.png');
        textureKeys.push('doge');
        
        game.load.image('minion', 'minion.png');
        textureKeys.push('minion');
    }
    
    //game create callback: initializes all objects
    function create() {
        //set up a sprite in the middle of the screen that reacts to touch/click input
        sprite = game.add.sprite(game.world.centerX, game.world.centerY);
        initializeSprite(game.rnd.pick(textureKeys));
        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(spritePressed);
    
        //debug text
        orientationText = game.add.text(10, 20);
        orientationText.fill = 'white';
        
        //set up a device orientation handler if the browser supports it
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', orientationEvent, false);
        }
    }
    
    //device orientation event callback: displays all axes and rotate the sprite
    //according to alpha, which should be the device's "compass" heading 
    function orientationEvent(eventData) {
        rotationAlpha = eventData.alpha;
        rotationBeta = eventData.beta;
        rotationGamma = eventData.gamma;
        
        sprite.angle = rotationAlpha;
    }
    
    //sprite clicked/touched handler: change its texture
    function spritePressed() {
        //advance the sprite to the "next" texture, wrapping around if necessary
        var index = textureKeys.indexOf(sprite.key);
        index = (index < 0)? 0 : (index + 1) % textureKeys.length;
        initializeSprite(textureKeys[index]);
    }
    
    //initialize the sprite to the given texture key
    function initializeSprite(key) {
        sprite.loadTexture(key);
        sprite.anchor.set(0.5);
        sprite.width = Math.min(game.width, game.height);
        sprite.height = sprite.width;
    }
    
    //game render callback: draw debug text displaying device's orientation
    function render() {
        var orientation = isDevicePortrait()? "Portrait" : "Landscape";
        orientationText.text = "Device Orientation: " + orientation + "\n\nAlpha: " + Math.round(rotationAlpha) + 
            "\nBeta: " + Math.round(rotationBeta) + "\nGamma: " + Math.round(rotationGamma);
    }
    
    //is the device in portrait mode, according to Phaser?
    function isDevicePortrait() {
        return (game.scale.orientation === 0);
    }
}());