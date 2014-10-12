(function() {
    'use strict';
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, Phaser.CANVAS, 'phaser-game', 
        { preload: preload, create: create, render: render });
    var rotationAlpha;
    var rotationBeta;
    var rotationGamma;
    var orientationText;

    function preload() {
    
    }
        
    function create() {
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
    }
    
    function render() {
        orientationText.text = "Device Orientation:\n\nAlpha: " + rotationAlpha + 
            "\nBeta: " + rotationBeta + "\nGamma: " + rotationGamma;
    }
}());