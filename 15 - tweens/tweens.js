(function() {
    'use strict';
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, Phaser.CANVAS, 'phaser-game', { preload: preload, create: create });

    function preload() {
        game.load.image('car', 'car.png');
    }
    
    function create() {
        //create a bunch of sample tweens, to be run sequentially
        var bounce = createTween(20, Phaser.Easing.Bounce.InOut, 'Bounce Easing').start();
        var circular = createTween(120, Phaser.Easing.Circular.InOut, 'Circular Easing');
        var exponential = createTween(220, Phaser.Easing.Exponential.InOut, 'Exponential Easing');
        var back = createTween(320, Phaser.Easing.Back.InOut, 'Back Easing');
        var elastic = createTween(420, Phaser.Easing.Elastic.InOut, 'Elastic Easing');
        
        //chain them together, so they run one after the other
        bounce.onComplete.add(function() { circular.start(); });
        circular.onComplete.add(function() { exponential.start(); });
        exponential.onComplete.add(function() { back.start(); });
        back.onComplete.add(function() { elastic.start(); });
    }
    
    //create a tween of a car sprite, moving across the screen from left to right, using
    //the given easing function and labelling itself with the given name once it completes
    function createTween(y, easingFunction, name) {
        var sprite = game.add.sprite(0, y, 'car');
        sprite.x = -sprite.width;
        
        var tween = game.add.tween(sprite);
        tween.to({x: game.width - sprite.width}, 4000, easingFunction);
        tween.onComplete.add(function() { labelTween(name, sprite); });
        return tween;
    }
    
    //add the given text to the game, aligned to the left of the given sprite
    function labelTween(label, sprite) {
        var text = game.add.text(0, 0, label, {fill: 'white'});
        text.x = sprite.x - text.width - (text.fontSize / 2);
        text.y = sprite.y + (sprite.height / 2) - (text.height / 2);
    }
}());