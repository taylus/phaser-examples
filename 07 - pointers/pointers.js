(function() {
    'use strict';
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, Phaser.CANVAS, 'phaser-game', 
        { create: create, render: render });
    var pointers = [];
    
    //initialize pointers
    //Phaser supports a mouse pointer and up to 10 additional pointers for touch input
    //it stores the mouse as game.input.mousePointer, and the others as pointer1, pointer2, ..., pointer10
    //if we're running on a desktop, only use the mouse pointer
    //if we're not, use all 10 additional pointers
    function create() {
        pointers = [game.input.mousePointer];
        if(!game.device.desktop) {
            pointers.push(game.input.pointer1, game.input.pointer2);
            for (var i = 3; i <= 10; i++) {
                pointers.push(game.input.addPointer());
            }
        }
    }
    
    //draw debug info for all pointers
    function render() {
        game.debug.inputInfo(20, 30);
        for (var i = 0; i < pointers.length; i++) {
            game.debug.pointer(pointers[i]);
        }
    }
}());