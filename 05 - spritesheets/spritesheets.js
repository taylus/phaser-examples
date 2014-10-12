(function() {
    'use strict';
    var FRAMES_WIDE = 4;      //width of sprite sheet in frames
    var FRAMES_TALL = 3;      //height of sprite sheet in frames
    var FRAME_WIDTH = 64;     //width of each frame in pixels
    var FRAME_HEIGHT = 96;    //height of each frame in pixels
    var ANIM_FPS = 3;         //how many frames per second animations should be
    var SHEET_X = 20;         //x coordinate where the full sprite sheet is drawn
    var SHEET_Y = 20;         //y coordinate where the full sprite sheet is drawn
    var BUTTON_SIZE = 64;     //size of arrow buttons (alternative to keyboard input)
    
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, Phaser.CANVAS, 'phaser-game', 
        { preload: preload, create: create, render: render});
    var player;
    
    //game preload callback: preload all assets
    function preload() {
        //load one copy of the spritesheet as a regular image for display
        game.load.image('spritesheet', 'locke_ff6.png');
        
        //and another copy as a spritesheet proper, with frames of 16x24 pixels
        game.load.spritesheet('player', 'locke_ff6.png', FRAME_WIDTH, FRAME_HEIGHT);
        
        //load a button sprite sheet, so mobile users can press buttons to change the animation
        game.load.spritesheet('buttons', 'buttons.png', BUTTON_SIZE, BUTTON_SIZE);
    }
    
    //game create callback: initialize all objects
    function create() {
        //make the background dark gray to make it easier to see black in the sprites
        game.stage.backgroundColor = 0x252525; 
        
        //add a player sprite from the sprite sheet
        player = game.add.sprite(465, 160, 'player');
        player.anchor.set(0.5);
        
        //define animations from frame numbers in the sprite sheet
        player.animations.add('walk_down', [0, 4, 0, 8]);
        player.animations.add('walk_up', [1, 5, 1, 9]);
        player.animations.add('walk_left', [2, 6, 2, 10]);
        player.animations.add('walk_right', [3, 7, 3, 11]);
        
        //play animation at 3 fps (delay between frames = 1000 / fps)
        player.animations.play('walk_down', ANIM_FPS, true);
        
        drawSpriteSheet();
        setUpKeyboardInput();
        setUpButtons();
    }
    
    //center up/down/left/right buttons around the player as an alternative to keyboard input
    function setUpButtons() {
        var x = player.x - (BUTTON_SIZE / 2), y = player.y - (BUTTON_SIZE / 2), PADDING = 8;
        
        var upButton = game.add.button(x, y - ((FRAME_HEIGHT + BUTTON_SIZE) / 2 + PADDING), 'buttons', null, null, 0, 0, 1, 0);
        upButton.name = "up";
        upButton.onInputDown.add(buttonDown);
        
        var downButton = game.add.button(x, y + ((FRAME_HEIGHT + BUTTON_SIZE) / 2 + PADDING), 'buttons', null, null, 6, 6, 7, 6);
        downButton.name = "down";
        downButton.onInputDown.add(buttonDown);
        
        var leftButton = game.add.button(x - (BUTTON_SIZE + PADDING), y, 'buttons', null, null, 2, 2, 3, 2);
        leftButton.name = "left";
        leftButton.onInputDown.add(buttonDown);
        
        var rightButton = game.add.button(x + (BUTTON_SIZE + PADDING), y, 'buttons', null, null, 4, 4, 5, 4);
        rightButton.name = "right";
        rightButton.onInputDown.add(buttonDown);
    }
    
    //button press callback: makes button presses simulate respective keyboard keypresses
    function buttonDown(button) {
        switch (button.name) {
            case "up":
                updateAnimation(new Phaser.Key(game, Phaser.Keyboard.UP));
                break;
           case "down":
                updateAnimation(new Phaser.Key(game, Phaser.Keyboard.DOWN));
                break;
           case "left":
                updateAnimation(new Phaser.Key(game, Phaser.Keyboard.LEFT));
                break;
           case "right":
                updateAnimation(new Phaser.Key(game, Phaser.Keyboard.RIGHT));
                break;
        }
    }
    
    //game render callback: draw any post-render or debug effects
    function render() {
        debugAnimationInfo(player, 340, 304);
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
            x: (x * FRAME_WIDTH) + SHEET_X, 
            y: (y * FRAME_HEIGHT) + SHEET_Y, 
            width: FRAME_WIDTH, 
            height: FRAME_HEIGHT
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
        game.add.sprite(SHEET_X, SHEET_Y, 'spritesheet');
        
        //draw index numbers over each frame
        var i = 0;
        for (var y = 0; y < FRAMES_TALL; y++) {
            for (var x = 0; x < FRAMES_WIDE; x++) {
                //ugly math to center the numbers
                var centeredX = (x * FRAME_WIDTH) + SHEET_X + (FRAME_WIDTH / 2);
                var centeredY = (y * FRAME_HEIGHT) + SHEET_Y + (FRAME_HEIGHT / 2);
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