(function() {
    'use strict';
    var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-game', 
        { preload: preload, create: create, render: render, update: update});
    var player;
    var collisionLayer;
    var PLAYER_SPEED = 175;     //pixels per second
    var DEBUG = true;
    var BUTTON_SIZE = 64;
    var upButton, downButton, leftButton, rightButton;
        
    //game preload callback: preloads all assets
    function preload() {
        game.load.tilemap('testmap', 'assets/test_scroll.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tileset', 'assets/lttp_castlebasement.png');
        game.load.image('player', 'assets/link.png');
        game.load.spritesheet('buttons', 'assets/buttons.png', BUTTON_SIZE, BUTTON_SIZE);
    }
    
    //game create callback: initializes all objects
    function create() {
        //load the map's base layer, and resize the game world to fit it
        var map = game.add.tilemap('testmap');
        map.addTilesetImage('lttp_castlebasement', 'tileset');
        var baseLayer = map.createLayer('base layer');
        baseLayer.resizeWorld();
        
        //load the map's collision layer, and set all tiles on it to solid
        collisionLayer = map.createLayer('wall layer');
        map.setCollisionByExclusion([0], true, collisionLayer);
        if(DEBUG) {
            collisionLayer.debug = true;
            collisionLayer.alpha = 0.5;
        }
        else {
            collisionLayer.visible = false;
        }
                
        //make a sprite for the player and give it a physics body
        player = game.add.sprite(624, 48, 'player');
        player.smoothed = false;
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;
        player.body.setSize(32, 32, 0, 16);
        
        //have the camera follow the player, without snapping to single-pixel
        //coordinates, since this causes a slight jitter of the player sprite
        game.camera.follow(player);
        game.camera.roundPx = false;
        
        //virtual d-pads for mobile movement
        setUpButtons(BUTTON_SIZE, game.height - (BUTTON_SIZE * 2));
        setUpButtons(game.width - (BUTTON_SIZE * 2), game.height - (BUTTON_SIZE * 2));
    }
    
    //center a virtual direction pad of onscreen buttons as a mobile-friendly alternative to keyboard input
    function setUpButtons(x, y) {
        var upButton = game.add.button(x, y - BUTTON_SIZE, 'buttons', null, null, 0, 0, 1, 0);
        upButton.name = "up";
        upButton.fixedToCamera = true;
        upButton.onInputUp.add(buttonUp);
        upButton.onInputDown.add(buttonDown);
        
        var downButton = game.add.button(x, y + BUTTON_SIZE, 'buttons', null, null, 6, 6, 7, 6);
        downButton.name = "down";
        downButton.fixedToCamera = true;
        downButton.onInputUp.add(buttonUp);
        downButton.onInputDown.add(buttonDown);
        
        var leftButton = game.add.button(x - BUTTON_SIZE, y, 'buttons', null, null, 2, 2, 3, 2);
        leftButton.name = "left";
        leftButton.fixedToCamera = true;
        leftButton.onInputUp.add(buttonUp);
        leftButton.onInputDown.add(buttonDown);
        
        var rightButton = game.add.button(x + BUTTON_SIZE, y, 'buttons', null, null, 4, 4, 5, 4);
        rightButton.name = "right";
        rightButton.fixedToCamera = true;
        rightButton.onInputUp.add(buttonUp);
        rightButton.onInputDown.add(buttonDown);
    }
    
    //game update callback: move the player based on keyboard input
    function update() {
        game.physics.arcade.collide(player, collisionLayer);
        player.body.velocity.set(0);
        if (game.input.keyboard.isDown(Phaser.Keyboard.W) || game.input.keyboard.isDown(Phaser.Keyboard.UP) || upButton) {
            player.body.velocity.y = -PLAYER_SPEED;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.S) || game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || downButton) {
            player.body.velocity.y = PLAYER_SPEED;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.A) || game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || leftButton) {
            player.body.velocity.x = -PLAYER_SPEED;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.D) || game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || rightButton) {
            player.body.velocity.x = PLAYER_SPEED;
        }
    }
    
    //game render callback: draw camera and player sprite debug info
    function render() {
        if(DEBUG) {
            game.debug.cameraInfo(game.camera, 10, 20);
            game.debug.spriteInfo(player, 530, 20);
            game.debug.body(player);
        }
    }
    
    //keep track of which onscreen buttons are being held down
    //this is gross, but it's just for an example
    function buttonDown(button) {
        if (button.name == "up") {
            upButton = true;
        }
        else if (button.name == "down") {
            downButton = true;
        }
        if (button.name == "left") {
            leftButton = true;
        }
        else if (button.name == "right") {
            rightButton = true;
        }
    }
    
    //forget onscreen buttons that have been released
    function buttonUp(button) {
        if (button.name == "up") {
            upButton = false;
        }
        else if (button.name == "down") {
            downButton = false;
        }
        if (button.name == "left") {
            leftButton = false;
        }
        else if (button.name == "right") {
            rightButton = false;
        }
    }
}());