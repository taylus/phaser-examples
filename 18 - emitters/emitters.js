(function() {
    'use strict';
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, 
        Phaser.CANVAS, 'phaser-game', { preload: preload, create: create, render: render });
        
    function preload() {
        game.load.image('particle', 'assets/particle.png');
    }
    
    function create() {
        //make an emitter with 500 particles
        var emitter = game.add.emitter(0, 0, 500);
        emitter.makeParticles('particle');
        
        //keep it positioned on the active pointer
        game.input.addMoveCallback(function(event) {
            emitter.x = event.x;
            emitter.y = event.y;
        });
        
        //spawn particles while the active pointer is down
        game.input.onDown.add(function() {
            emitter.start(false, 5000, 10);
        });
        
        //and stop spawning particles when it's released
        game.input.onUp.add(function() {
            emitter.on = false; 
        });
    }
    
    function render() {
        game.debug.text('Click or tap the screen! :D', 10, 20, 'white');
    }
}());