(function() {
    'use strict';
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, Phaser.CANVAS, 'phaser-game', 
        { preload: preload, create: create, render: render });

    function preload() {
        game.load.image('car', 'car.png');
        
        //prevent the game from pausing when it loses focus
        game.stage.disableVisibilityChange = true;
    }
    
    function create() {
        createWidthTween();
        createRotationTween();
        createFlipTween();
        createFadeTween();
    }
    
    //create and return a tween that stretches a sprite's width
    function createWidthTween() {
        //load and position a sprite
        var sprite = game.add.sprite(480, 120, 'car');
        sprite.anchor.set(0.5, 0.5);
        
        //then add a tween to it, that...
        var tween = game.add.tween(sprite).to(
            {width: sprite.width * 3},          //triples the width of the sprite
            2000,                               //over 2 seconds
            Phaser.Easing.Exponential.InOut,    //using exponential easing
            true,                               //starting automatically
            0,                                  //with no delay before starting
            Number.MAX_VALUE,                   //repeating infinite times
            true);                              //and with "yoyo" reverse + repeat behavior
        return tween;
    }
    
    //create and return a tween that rotates a sprite
    function createRotationTween() {
        var sprite = game.add.sprite(200, 320, 'car');
        sprite.anchor.set(0.5, 0.5);
        
        var tween = game.add.tween(sprite);
        tween.to({angle: 360}, 3000, Phaser.Easing.Exponential.InOut, true, 0, Number.MAX_VALUE);
        return tween;
    }
    
    //create and return a tween that flips a sprite horizontally
    function createFlipTween() {
        var sprite = game.add.sprite(600, 240, 'car');
        sprite.anchor.set(0.5, 0.5);
        
        var tween = game.add.tween(sprite.scale);
        tween.to({x: -1}, 3000, Phaser.Easing.Elastic.InOut, true, 0, Number.MAX_VALUE, true);
        return tween;
    }
    
    //create and return a tween that fades some text in and out
    function createFadeTween() {
        var text = game.add.text(680, 380, 'Fading text!', 
            {font: 'bold 48pt Arial', fill: 'lightgray', stroke: 'gray', strokeThickness: 8});
        text.anchor.set(0.5, 0.5);
        
        var tween = game.add.tween(text);
        tween.to({alpha: 0}, 2000, Phaser.Easing.Quadratic.InOut, true, 0, Number.MAX_VALUE, true);
        return tween;
    }
    
    function render() {
        game.debug.text('Tweens can be on any property, not just position!', 10, 20, 'white');
        game.debug.text('And they can be on any object, not just sprites!', 10, 40, 'white');
    }
}());