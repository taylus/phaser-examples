(function() {
    'use strict';
    var game = new Phaser.Game(1540, 490, Phaser.CANVAS, 'phaser-game',
        { preload: preload, create: create, update: update, render: render });
    var RUN_ACCELERATION = 200;   //pixels per second
    var JUMP_ACCELERATION = 450;
    var GRAVITY = JUMP_ACCELERATION * 2;
    var ANIM_FPS = 4;
    var IDLE_FRAME = 4;
    var JUMP_FRAME = 2;
    var arrowKeys;
    var wasdKeys;
    var player;
    var map;
    
    function preload() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tileset', 'assets/tiles_spritesheet.png');
        game.load.spritesheet('player', 'assets/player_spritesheet.png', 72, 97, -1, 0, 1);
    }
    
    function create() {
        arrowKeys = game.input.keyboard.createCursorKeys();
        wasdKeys = createWASDKeys();
        
        game.stage.backgroundColor = 0x0099CC;
        
        map = loadMap('map');
        initializePhysics();
        player = createPlayer();
    }
    
    function loadMap() {
        var map = game.add.tilemap('map');
        map.addTilesetImage('tiles_spritesheet', 'tileset');
        map.setCollisionByExclusion([44, 88, 75]);
        map.collisionLayer = map.createLayer(0);
        //map.collisionLayer.debug = true;
        map.collisionLayer.resizeWorld();
        return map;
    }
    
    function initializePhysics() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = GRAVITY;
    }
    
    function createPlayer() {
        var player = game.add.sprite(map.tileWidth, map.heightInPixels - 240, 'player');
        player.anchor.setTo(0.5);
        player.animations.add('walk', [1, 2, 3, 4, 5]);
        player.frame = IDLE_FRAME;
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.getRunAcceleration = function() {
            return this.body.onFloor()? RUN_ACCELERATION : RUN_ACCELERATION * 0.75;
        };
        game.camera.follow(player);
        return player;
    }
    
    function update() {
        game.physics.arcade.collide(player, map.collisionLayer);
        var onFloor = player.body.onFloor();
        
        //horizontal movement
        if (arrowKeys.left.isDown || wasdKeys.left.isDown) {
            player.scale.x = -1;
            if (onFloor) {
                player.animations.play('walk', ANIM_FPS, true);
            }
            else {
                player.frame = JUMP_FRAME;
            }
            player.body.velocity.x = -player.getRunAcceleration();
        }
        else if (arrowKeys.right.isDown || wasdKeys.right.isDown) {
            player.scale.x = 1;
            if (onFloor) {
                player.animations.play('walk', ANIM_FPS, true);
            }
            else {
                player.frame = JUMP_FRAME;
            }
            player.body.velocity.x = player.getRunAcceleration();
        }
        else {
            player.animations.stop();
            if(onFloor) player.frame = IDLE_FRAME;
            player.body.velocity.x = 0;
        }
        
        //jump
        if ((arrowKeys.up.isDown || wasdKeys.up.isDown) && onFloor) {
            player.frame = JUMP_FRAME;
            player.body.velocity.y = -JUMP_ACCELERATION;
        }
    }
    
    function render() {
        //game.debug.body(player);
    }
    
    function createWASDKeys() {
        return {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        };
    }
}());