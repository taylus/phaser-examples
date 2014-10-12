(function() {
    'use strict';
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, Phaser.CANVAS, 'phaser-game', 
        { preload: preload, create: create, render: render});
    var BUTTON_SIZE = 64;
    var buttonLastPressed;
    
    //game preload callback: preload all assets
    function preload() {
        game.load.spritesheet('buttons', 'buttons.png', BUTTON_SIZE, BUTTON_SIZE);
    }
    
    //game create callback: initialize all objects
    function create() {
        //center the buttons about this point
        var x = 74, y = 104;
        
        //set up some buttons with the given over/out/down/up frames in the sprite sheet
        game.add.button(x, y - BUTTON_SIZE, 'buttons', buttonPress, null, 0, 0, 1, 0).name = "Up";
        game.add.button(x, y + BUTTON_SIZE, 'buttons', buttonPress, null, 6, 6, 7, 6).name = "Down"; 
        game.add.button(x - BUTTON_SIZE, y, 'buttons', buttonPress, null, 2, 2, 3, 2).name = "Left";
        game.add.button(x + BUTTON_SIZE, y, 'buttons', buttonPress, null, 4, 4, 5, 4).name = "Right";
    }
    
    function buttonPress(button) {
        //keep track of the button for debug display
        buttonLastPressed = button;
    }
    
    function render() {
        if (!buttonLastPressed || !buttonLastPressed.name) return;
        game.debug.text("Pressed: " + buttonLastPressed.name, 10, 20, "white");
    }
}());