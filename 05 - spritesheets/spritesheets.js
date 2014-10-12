(function() {
    'use strict';
    var FRAMES_WIDE = 4;      //width of sprite sheet in frames
    var FRAMES_TALL = 3;      //height of sprite sheet in frames
    var FRAME_WIDTH = 16;     //width of each frame in pixels
    var FRAME_HEIGHT = 24;    //height of each frame in pixels
    var SPRITE_SCALE = 4;     //scale multiplier for the sprite sheet
    var ANIM_FPS = 3;         //how many frames per second animations should be
    var SHEET_X = 20;         //x coordinate where the full sprite sheet is drawn
    var SHEET_Y = 20;         //y coordinate where the full sprite sheet is drawn
    
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, Phaser.CANVAS, 'phaser-game', 
        { preload: preload, create: create, render: render});
    var player;
    
    //game preload callback: preload all assets
    function preload() {
        //load one copy of the spritesheet as a regular image for display
        game.load.image('spritesheet', 'locke_ff6.png');
        
        //and another copy as a spritesheet proper, with frames of 16x24 pixels
        game.load.spritesheet('player', 'locke_ff6.png', FRAME_WIDTH, FRAME_HEIGHT);
    }
    
    //game create callback: initialize all objects
    function create() {
        //add a player sprite from the sprite sheet
        player = game.add.sprite(465, 160, 'player');
        player.anchor.set(0.5);
        
        //scale the sprite up, but disable antialiasing so it doesn't get all fuzzy
        player.smoothed = false;
        player.scale.set(SPRITE_SCALE);
        
        //define animations from frame numbers in the sprite sheet
        player.animations.add('walk_down', [0, 4, 0, 8]);
        player.animations.add('walk_up', [1, 5, 1, 9]);
        player.animations.add('walk_left', [2, 6, 2, 10]);
        player.animations.add('walk_right', [3, 7, 3, 11]);
        
        //play animation at 3 fps (delay between frames = 1000 / fps)
        player.animations.play('walk_down', ANIM_FPS, true);
        
        drawSpriteSheet();
        setUpKeyboardInput();
    }
    
    //game render callback: draw any post-render or debug effects
    function render() {
        debugAnimationInfo(player, 340, 300);
        game.debug.text("Press the arrow keys or WASD to change animation.", 10, 360);
        game.debug.text("If you're on mobile, calm down, I'll add buttons once I learn how.", 10, 380);
        
        //draw a bounding box over the current frame in the sprite sheet
        var rect = getFrameBounds(player.animations.currentFrame.index);
        game.debug.rectangle(rect, 'white', false);
    }
    
    //returns a rectangle of the spritesheet's frame bounds given a frame index
    function getFrameBounds(index) {
        //convert 1D index to 2D frame coordinates using modulo and int division
        var x = index % FRAMES_WIDE;
        var y = Math.floor(index / FRAMES_WIDE);
        return {
            x: (x * FRAME_WIDTH * SPRITE_SCALE) + SHEET_X, 
            y: (y * FRAME_HEIGHT * SPRITE_SCALE) + SHEET_Y, 
            width: FRAME_WIDTH * SPRITE_SCALE, 
            height: FRAME_HEIGHT * SPRITE_SCALE
        };
    }
    
    //set up the keyboard arrow and WASD keys to change the player sprite's current animation
    //using the onDown event on the key instead of using keyboard.isDown to avoid rapidfire
    function setUpKeyboardInput() {
        //stop the following keys from propagating up to the browser
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, 
                                           Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT,
                                           Phaser.Keyboard.W, Phaser.Keyboard.A, 
                                           Phaser.Keyboard.S, Phaser.Keyboard.D]);
        game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(updateAnimation);
        game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(updateAnimation);
        game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(updateAnimation);
        game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(updateAnimation);
        game.input.keyboard.addKey(Phaser.Keyboard.W).onDown.add(updateAnimation);
        game.input.keyboard.addKey(Phaser.Keyboard.A).onDown.add(updateAnimation);
        game.input.keyboard.addKey(Phaser.Keyboard.S).onDown.add(updateAnimation);
        game.input.keyboard.addKey(Phaser.Keyboard.D).onDown.add(updateAnimation);
    }
    
    //keyboard key callback: called just once per keypress, the relevant key is passed in
    function updateAnimation(key) {
        if (key.keyCode == Phaser.Keyboard.UP || key.keyCode == Phaser.Keyboard.W) {
            player.animations.play('walk_up', ANIM_FPS, true);
        }
        if (key.keyCode == Phaser.Keyboard.DOWN || key.keyCode == Phaser.Keyboard.S) {
            player.animations.play('walk_down', ANIM_FPS, true);
        }
        if (key.keyCode == Phaser.Keyboard.LEFT || key.keyCode == Phaser.Keyboard.A) {
            player.animations.play('walk_left', ANIM_FPS, true);
        }
        if (key.keyCode == Phaser.Keyboard.RIGHT || key.keyCode == Phaser.Keyboard.D) {
            player.animations.play('walk_right', ANIM_FPS, true);
        }
    }
    
    //draw the game's full sprite sheet with frame index numbers on top
    function drawSpriteSheet() {
        //show the whole spritesheet
        var sheet = game.add.sprite(SHEET_X, SHEET_Y, 'spritesheet');
        sheet.smoothed = false;
        sheet.scale.set(SPRITE_SCALE);
        
        //draw index numbers over each frame
        var i = 0;
        for (var y = 0; y < FRAMES_TALL; y++) {
            for (var x = 0; x < FRAMES_WIDE; x++) {
                //ugly math to center the numbers
                var centeredX = (x * FRAME_WIDTH * SPRITE_SCALE) + SHEET_X + (FRAME_WIDTH * SPRITE_SCALE / 2);
                var centeredY = (y * FRAME_HEIGHT * SPRITE_SCALE) + SHEET_Y + (FRAME_HEIGHT * SPRITE_SCALE / 2);
                game.add.text(centeredX, centeredY, i.toString(), 
                    { font: 'bold 30pt Arial', fill: 'rgba(255, 255, 255, 0.5)', 
                      stroke: 'black', strokeThickness: 3 }).anchor.set(0.5);
                i++;
            }
        }
    }
    
    //write debug info about a sprite's current animation
    //this is assuming numbered frames instead of named ones
    function debugAnimationInfo(sprite, x, y, color, font) {
        var name = sprite.animations.currentAnim && sprite.animations.currentAnim.name || 'n/a';
        if (name != 'n/a') name = '"' + name + '"';
        //var delay = sprite.animations.currentAnim && Math.round(sprite.animations.currentAnim.delay) || 'n/a';
        var frame = sprite.animations.currentFrame && sprite.animations.currentFrame.index.toString() || 'n/a';
        //game.debug.text('anim: ' + name + ' delay: ' + delay + ' frame: ' + frame, x, y, color, font);
        game.debug.text('anim: ' + name + ' frame: ' + frame, x, y, color, font);
    }
}());