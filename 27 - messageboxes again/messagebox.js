(function() {
    'use strict';
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, Phaser.CANVAS, 'phaser-game', {preload: preload, create: create});
    var textObject;  //Phaser.Text
    var beepSound;  //Phaser.Sound
    var nextCharacterEvent;  //Phaser.TimerEvent
    var nextLineEvent;  //Phaser.SignalBinding
    var dialogue;  //string array
    var lineNumber = 0;  //index into dialogue
    var limericks;
    
    function preload() {
        game.load.audio('beep', ['beep.ogg', 'beep.wav']);
        game.load.text('limericks', 'limericks.json');
    }
    
    function create() {
        beepSound = game.add.audio('beep');
        textObject = game.add.text(100, 100, '', {font: '24pt Arial', fill: 'white'});
        nextCharacterEvent = game.time.events.loop(60, nextCharacter);
        nextLineEvent = game.input.onDown.add(nextLine);
        limericks = JSON.parse(game.cache.getText('limericks'));
        dialogue = randomElement(limericks);
    }
    
    function nextCharacter() {
        if (textObject.text.length < dialogue[lineNumber].length) {
            var nextChar = dialogue[lineNumber].charAt(textObject.text.length);
            if (nextChar !== ' ') beepSound.play();
            textObject.text += nextChar;
        }
        else {
            game.time.events.remove(nextCharacterEvent);
        }
    }
    
    function nextLine() {
        //TODO: advance to the end of the line if not there yet
        //requires tracking the character index in nextCharacter()
        if (textObject.text.length < dialogue[lineNumber].length) return;
        
        if (lineNumber < dialogue.length - 1) {
            //TODO: make a separate timer that just pauses/resumes?
            game.time.events.remove(nextCharacterEvent);
            nextCharacterEvent = game.time.events.loop(60, nextCharacter);
            textObject.text = '';
            lineNumber++;
        }
        else {
            //TODO: make a separate timer that just pauses/resumes?
            game.time.events.remove(nextCharacterEvent);
            nextCharacterEvent = game.time.events.loop(60, nextCharacter);
            dialogue = randomElement(limericks);
            textObject.text = '';
            lineNumber = 0;
        }
    }
    
    function randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}());