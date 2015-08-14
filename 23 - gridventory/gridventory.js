(function() {
    'use strict';
    var game = new Phaser.Game('100%', '100%', Phaser.CANVAS, 'phaser-game', { 
        preload: preload,
        create: create,
    });
    var cellSize;
    var currentItem;
    var graphics;

    function preload() {
        game.load.image('potion', 'assets/potion.png');
    }
    
    function create() {
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        game.stage.backgroundColor = 0x222222;
        
        graphics = game.add.graphics(0, 0);
        currentItem = game.add.sprite(game.world.centerX, game.world.centerY, 'potion');
        
        game.scale.onSizeChange.add(resize);
        resize();
    }
    
    function createGrid(graphics, cellSize) {
        graphics.clear();
        graphics.lineStyle(2, 0x777777, 1.0);
        
        //draw vertical lines
        for(var x = 0; x <= game.width; x += cellSize) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, game.height);
        }
        
        //draw horizontal lines
        for(var y = 0; y <= game.height; y += cellSize) {
            graphics.moveTo(0, y);
            graphics.lineTo(game.width, y);
        }
    }
    
    function configureItem(item) {
        item.x = game.world.centerX;
        item.y = game.world.centerY;
        sizeToGrid(item, cellSize);
        snapToGrid(item, cellSize);
        item.inputEnabled = true;
        item.input.enableDrag(true);
        item.input.enableSnap(cellSize, cellSize, false, true, (cellSize - item.width) / 2, (cellSize - item.height) / 2);
    }
    
    function snapToGrid(sprite, cellSize) {
        sprite.x = sprite.x - (sprite.x % cellSize) + ((cellSize - sprite.width) / 2);
        sprite.y = sprite.y - (sprite.y % cellSize) + ((cellSize - sprite.height) / 2);
    }
    
    function sizeToGrid(sprite, cellSize) {
        var oldScale, scaleDiff;
        if(sprite.width > sprite.height) {
            oldScale = sprite.scale.x;
            sprite.width = cellSize;
            scaleDiff = sprite.scale.x - oldScale;
            sprite.scale.y += scaleDiff;
        }
        else {
            oldScale = sprite.scale.y;
            sprite.height = cellSize;
            scaleDiff = sprite.scale.y - oldScale;
            sprite.scale.x += scaleDiff;
        }
    }
    
    function resize() {
        cellSize = window.innerHeight / 9;
        createGrid(graphics, cellSize);
        configureItem(currentItem);
    }
    window.addEventListener('resize', resize);
}());