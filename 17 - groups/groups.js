(function() {
    'use strict';
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, Phaser.CANVAS, 'phaser-game', 
        { preload: preload, create: create, render: render });

    function preload() {
        game.load.image('awesome', 'assets/awesome.png');
        game.load.spritesheet('buttons', 'assets/buttons.png', 80, 20);
        game.load.bitmapFont('nokia', 'assets/nokia16black.png', 'assets/nokia16black.xml');
    }
    
    function create() {
        var group = game.add.group();
        for(var i = 0; i < 6; i++) {
            var sprite = group.create((i * 150), 100, 'awesome');
            sprite.scale.set(0.5);
            sprite.inputEnabled = true;
            sprite.events.onInputDown.add(spriteClick);
        }
        makeButton('getFirstExists(false)', function() { bringSpriteBack(group.getFirstExists(false)); }, 280, 330, 220, 40);
        makeButton('forEach(callback)', function() { bringSpritesBack(group); }, 500, 330, 220, 40);
    }
    
    function spriteClick(sprite) {
        sprite.exists = false;
    }
    
    function bringSpriteBack(sprite) {
        if (sprite && !sprite.exists) {
            sprite.exists = true;
        }
    }
    
    function bringSpritesBack(group) {
        group.forEach(function(child) { bringSpriteBack(child); });
    }
    
    //make a button with the given name, click handler, position and dimensions
    function makeButton(name, callback, x, y, w, h) {
        var button = game.add.button(x, y, 'buttons', callback, null, 0, 1, 2, 0);
        button.name = name;
        button.smoothed = false;
        button.width = w;
        button.height = h;
        
        var text = game.add.bitmapText(x, y, 'nokia', name, 16);
        text.x += Math.floor((button.width / 2) - (text.width / 2));
        text.y += Math.floor((button.height / 2) - (text.fontSize / 2));
    }
    
    function render() {
        game.debug.text('Groups provide a convenient way to pool and recycle display objects.', 10, 20, 'white');
        game.debug.text('Tap or click on any of these sprites to make it "not exist" anymore.', 10, 40, 'white');
        game.debug.text('Bring sprite(s) back using:', 10, 354, 'white');
    }
}());