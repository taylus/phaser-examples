(function() {
    'use strict';
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, Phaser.CANVAS, 'phaser-game');
    game.state.add('intro', { preload: introPreload, create: introCreate, render: introRender, shutdown: shutdown }, true);
    game.state.add('titleScreen', { preload: preload, create: titleCreate, render: titleRender, shutdown: shutdown }, false);
    game.state.add('mainGame', { preload: preload, create: mainCreate, render: mainRender, shutdown: shutdown }, false);
    game.state.add('gameOver', { preload: preload, create: create, render: gameOverRender, shutdown: shutdown }, false);

    //game state preload callback: to be used for async preloading of assets so they're available before use
    function preload() {
        console.log('preload() for game state "' + game.state.current + '"');
    }
    
    //game state create callback: to be used to initialize objects
    function create() {
        console.log('create() for game state "' + game.state.current + '"');
    }
    
    //game state render callback: draw debug and other effects
    function render() {
        game.debug.text('This is the "' + game.state.current + '" game state.', 8, 20);
    }
    
    //game state shutdown callback: wraps up anything this state should do before being switched out
    function shutdown() {
        console.log('shutdown() for game state "' + game.state.current + '"');
        console.log('\n');
    }

    function introPreload() {
        preload();
        game.load.spritesheet('buttons', 'assets/buttons.png', 80, 20);
        game.load.bitmapFont('nokia', 'assets/nokia16black.png', 'assets/nokia16black.xml');
    }
    
    function introCreate() {
        create();
        makeButton('To Title Screen', stateChangeButtonPress, 10, 100, 150, 30);
    }
    
    function introRender() {
        render();
        game.debug.text('A game state is a named collection of callback functions that control a game\'s lifecycle.', 8, 40);
        game.debug.text('Check your JavaScript console to see them being called.', 8, 60);
        game.debug.text('States can be switched at will, optionally clearing the game world and asset cache.', 8, 80);
    }
    
    function titleCreate() {
        create();
        makeButton('To Main Game', stateChangeButtonPress, 10, 100, 150, 30);
    }
    
    function titleRender() {
        render();
        game.debug.text('Imagine a fancy title screen here.', 8, 40);
    }
    
    function mainCreate() {
        create();
        makeButton('To Game Over', stateChangeButtonPress, 10, 100, 150, 30);
    }
    
    function mainRender() {
        render();
        game.debug.text('This is where the majority of your neato game would happen.', 8, 40);
    }
    
    function gameOverRender() {
        render();
        game.debug.text('You lose!', 8, 40);
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
    
    //button press handler to change game states
    function stateChangeButtonPress(button) {
        switch (button.name) {
            case 'To Title Screen':
                game.state.start('titleScreen');
                break;
            case 'To Main Game':
                game.state.start('mainGame');
                break;
            case 'To Game Over':
                game.state.start('gameOver');
                break;
         }
    }
}());