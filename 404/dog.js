(function() {
    'use strict';
    var game = new Phaser.Game(320, 240, Phaser.CANVAS, '', {preload: preload, create: create});
    
    function preload() {
        game.load.audio('dog_room_song', ['dog_room.ogg', 'dog_room.mp3']);
        game.load.spritesheet('annoying_dog', 'annoying_dog.gif', 44, 38);
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }
    
    function create() {
        var music = game.add.audio('dog_room_song');
        music.play('', 0, 1, true);
        
        var dog = game.add.sprite(game.world.centerX, game.world.centerY, 'annoying_dog');
        dog.anchor.set(0.5, 0.5);
        dog.animations.add('dog');
        dog.animations.play('dog', 4, true);
        
        //since Mobile Safari doesn't autoplay...
        game.input.onDown.add(function() {
            if (!music.isPlaying) {
                music.play();
            }
        });
    }
}());