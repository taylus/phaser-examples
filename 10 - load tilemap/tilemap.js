(function() {
    'use strict';
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, Phaser.CANVAS, 'phaser-game', 
        { preload: preload, create: create, render: render });
    var map;

    //game preload callback: preloads all assets
    function preload() {
        //preload the map file
        game.load.tilemap('testmap', 'assets/testmap.json', null, Phaser.Tilemap.TILED_JSON);
        
        //preload the map's tileset image
        game.load.image('tileset', 'assets/lttp_castlebasement.png');
    }
    
    //game create callback: initializes all objects
    function create() {
        //now that the map data and tileset are loaded, create a map object (tiles, objects, properties, etc)
        map = game.add.tilemap('testmap');
        
        //the map needs to be informed which asset of ours is the tileset it's expecting
        //the first parameter is the name of the tileset in the map data, the second is an asset key
        map.addTilesetImage('lttp_castlebasement', 'tileset');
        
        //maps aren't drawn upon being added to the game, like Phaser.Sprite, etc
        //instead, individual layers are rendered to TilemapLayers, which behave like sprites
        //the name of the layer passed in here should be the name of a tile layer in the map data
        //once created, the layer is added to the game's display list (like a sprite)
        var layer = map.createLayer('base layer');

        //layers are fixed to the camera by default, center this one instead
        layer.fixedToCamera = false;
        layer.x = game.world.centerX - (map.widthInPixels / 2);
        layer.y = game.world.centerY - (map.heightInPixels / 2);
    }
    
    //game render callback: draw debug or post-render effects
    function render() {
        debugMap(map, 10, 20);
    }
    
    //draw basic debug information about the given map
    function debugMap(map, x, y, color, font) {
        game.debug.text('map: ' + map.properties.map_name, x, y, color, font);
        game.debug.text('layers: ' + map.layers.length, x, y + game.debug.lineHeight, color, font);
        game.debug.text('tilesize: ' + map.tileWidth + 'x' + map.tileHeight, x, y + (game.debug.lineHeight * 2), color, font);
        game.debug.text('size (tiles): ' + map.width + 'x' + map.height, x, y + (game.debug.lineHeight * 3), color, font);
        game.debug.text('size (pixels): ' + map.widthInPixels + 'x' + map.heightInPixels, x, y + (game.debug.lineHeight * 4), color, font);
    }
}());