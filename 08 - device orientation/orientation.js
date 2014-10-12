(function() {
    'use strict';
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, Phaser.CANVAS, 'phaser-game', 
        { preload: preload, create: create, render: render });
    var rotationAlpha;
    var rotationBeta;
    var rotationGamma;
    var orientationText;
    var sprite;

    function preload() {
        game.load.image('protractor', 'protractor.png');
    }
        
    function create() {
        sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'protractor');
        sprite.anchor.set(0.5);
        sprite.width = Math.min(game.width, game.height);
        sprite.height = sprite.width;
    
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
        
        //beta seems to be the "roll" axis on iOS, but MDN warns that devices differ...
        sprite.angle = rotationBeta;
    }
    
    function render() {
        orientationText.text = "Device Orientation:\n\nAlpha: " + Math.round(rotationAlpha) + 
            "\nBeta: " + Math.round(rotationBeta) + "\nGamma: " + Math.round(rotationGamma);
    }
}());