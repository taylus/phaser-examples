(function() {
    'use strict';
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, Phaser.CANVAS, 'phaser-game', 
        { create: create, render: render });
    var pointers = [];
    
    //initialize pointers
    //Phaser supports a mouse pointer and up to 10 additional pointers for touch input
    //it stores the mouse as game.input.mousePointer, and the others as pointer1, pointer2, ..., pointer10
    //if the device is a desktop, only use the mouse pointer
    //if the device supports touch, use all 10 touch pointers
    function create() {
        if(game.device.desktop) {
            //the mouse pointer is created by default
            pointers = [game.input.mousePointer];
        }
        else if(game.device.touch) {
            //two pointers are created by default, fill out the rest
            pointers = [game.input.pointer1, game.input.pointer2];
            for (var i = 3; i <= 10; i++) {
                pointers.push(game.input.addPointer());
            }
        }
    }
    
    //draw debug info for all pointers
    function render() {
        for (var i = 0; i < pointers.length; i++) {
            game.debug.pointer(pointers[i]);
        }
    }
}());