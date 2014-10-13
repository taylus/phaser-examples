(function() {
    'use strict';
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, Phaser.CANVAS, 'phaser-game', 
        { preload: preload, create: create, render: render });
        
    //keep track of the background music and sound effects
    var music;
    var soundEffects = [];

    //game preload callback: preloads all assets
    function preload() {
        //load background music
        game.load.audio('music', 'assets/Skydive_Safari.mp3');
        
        //load button images and font
        game.load.spritesheet('buttons', 'assets/buttons.png', 80, 20);
        game.load.bitmapFont('nokia', 'assets/nokia16black.png', 'assets/nokia16black.xml');
        
        //load sound effects
        game.load.audio('jump', 'assets/jump.mp3');
        game.load.audio('coin', 'assets/coin.mp3');
        game.load.audio('pipe', 'assets/pipe.mp3');
        game.load.audio('powerup', 'assets/powerup.mp3');
        
        //prevent the game from pausing when it loses focus
        game.stage.disableVisibilityChange = true;
    }
    
    //game create callback: initializes all objects
    function create() {
        //initialize background music
        music = game.add.audio('music');
        music.volume = 0.7;
        music.loop = true;
        
        //make music controls
        makeButton('Play', musicButtonPress, 10, 170, 100, 30);
        makeButton('Stop', musicButtonPress, 120, 170, 100, 30);
        makeButton('Pause', musicButtonPress, 230, 170, 100, 30);
        makeButton('Resume', musicButtonPress, 340, 170, 100, 30);
        makeButton('Volume+', musicButtonPress, 450, 170, 100, 30);
        makeButton('Volume-', musicButtonPress, 560, 170, 100, 30);
        
        //initialize sound effects
        soundEffects.push(game.add.audio('jump'));
        soundEffects.push(game.add.audio('coin'));
        soundEffects.push(game.add.audio('pipe'));
        soundEffects.push(game.add.audio('powerup'));
        
        //make sound effect buttons
        makeButton('Jump', soundEffectButtonPress, 10, 250, 100, 30);
        makeButton('Coin', soundEffectButtonPress, 120, 250, 100, 30);
        makeButton('Pipe', soundEffectButtonPress, 230, 250, 100, 30);
        makeButton('Powerup', soundEffectButtonPress, 340, 250, 100, 30);
    }
    
    //make a button with the given name, click handler, position and dimensions
    function makeButton(name, callback, x, y, w, h) {
        var button = game.add.button(x, y, 'buttons', callback, null, 0, 1, 2, 0);
        button.name = name;
        button.smoothed = false;
        button.width = w;
        button.height = h;
        
        var text = game.add.bitmapText(x, y, 'nokia', name, 16);
        text.x += Math.round((button.width / 2) - (text.width / 2));
        text.y += Math.round(text.height / 2);
    }
    
    //music control button press handler
    function musicButtonPress(button) {
        switch (button.name) {
            case "Play":
                music.play();
                break;
            case "Stop":
                music.stop();
                break;
            case "Pause":
                music.pause();
                break;
            case "Resume":
                music.resume();
                break;
            case "Volume+":
                music.volume += 0.1;
                break;
            case "Volume-":
                music.volume -= 0.1;
                if (music.volume < 0) {
                    music.volume = 0;
                }
                break;
         }
    }
    
    //sound effect button press handler
    function soundEffectButtonPress(button) {
        var sfx = findSoundEffectByName(button.name.toLowerCase());
        if (sfx) {
            sfx.play();
        }
    }
    
    //find and return the sound effect with the given name
    //in the global array of loaded sound effects
    function findSoundEffectByName(name) {
        for (var i = 0; i < soundEffects.length; i++) {
            if (soundEffects[i].name == name) {
                return soundEffects[i];
            }
        }
        return null;
    }
    
    //game render callback: draw debug info for background music
    function render() {
        game.debug.soundInfo(music, 10, 20);
    }
}());