(function() {
    'use strict';
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, Phaser.CANVAS, 'phaser-game');
    game.state.add('main', { preload: preload }, true);
    //game.state.start('main');

    //game preload callback: async preloads assets so they're available before use
    function preload() {
        console.log(game.state.current);
    }
    
    //game create callback: initializes objects
    function create() {

    }
    
    //game update callback: update objects each frame
    function update() {
    
    }
    
    //game render callback: draw debug info for background music
    function render() {
        
    }
}());