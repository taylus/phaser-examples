(function() {
    'use strict';
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, Phaser.CANVAS, 'phaser-game', {create: create});
    var message = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sollicitudin metus non turpis malesuada scelerisque. ' +
                  'Cras ultricies elit nulla, ac tristique sem mollis vel. Vivamus nisl odio, ultricies eu accumsan eu, ultricies eu nunc. ' + 
                  'Nullam in lectus vel purus dignissim facilisis. Interdum et malesuada fames ac ante ipsum primis in faucibus. ' + 
                  'Quisque nec mauris vehicula, venenatis nunc sed, posuere metus.';
    //message = 'Line one\nLine two\nLine three\nLine four\nLine five';

    var MSGBOX_X = 10;
    var MSGBOX_Y = 10;
    var MSGBOX_WIDTH = 400;
    var MSGBOX_HEIGHT = 100;

    //TODO: make configurable
    var BACKGROUND_COLOR = 0x303080;
    var BACKGROUND_ALPHA = 1.0;
    var BORDER_WIDTH = 4;
    var BORDER_COLOR = 0xccccff;
    var BORDER_ALPHA = 1.0;

    //game create callback: make a Phaser.Text, then chop it up into several to simulate RPG-style message boxes
    function create() {    
        var graphics = game.add.graphics(0, 0);
        
        var textObject = new Phaser.Text(game, MSGBOX_X, MSGBOX_Y, message, {fill: 'white', font: '20pt Arial'});
        textObject.wordWrap = true;
        textObject.wordWrapWidth = MSGBOX_WIDTH;
        game.add.existing(textObject);
        
        var textBoxes = chopText(textObject, MSGBOX_WIDTH, MSGBOX_HEIGHT);
        for (var i = 0; i < textBoxes.length; i++) {
            var boxSpacing = 20;
            var x = MSGBOX_X + MSGBOX_WIDTH + boxSpacing;
            var y = MSGBOX_Y + ((MSGBOX_HEIGHT + boxSpacing) * i);
            
            //draw background boxes
            graphics.beginFill(BACKGROUND_COLOR, BACKGROUND_ALPHA);
            graphics.lineStyle(BORDER_WIDTH, BORDER_COLOR, BORDER_ALPHA);
            graphics.drawRect(x - BORDER_WIDTH, y - BORDER_WIDTH, MSGBOX_WIDTH, MSGBOX_HEIGHT);
        
            //add chopped Phaser.Texts
            textBoxes[i].position.set(x, y);
            game.add.existing(textBoxes[i]);
        }
    }

    //chops the given Phaser.Text up into an array of Phaser.Texts, where the given height is the max each one can be
    //this is essentially a vertical wrap equivalent to Phaser.Text's horizontal wrapping (see Phaser.Text.runWordWrap)
    //this function uses the same kind of algorithm and line height calculations that Phaser.Text uses
    function chopText(textObject, width, height) {
        //calculate text height
        var lineHeight = textObject.determineFontHeight('font: ' + textObject.style.font + ';') + 
            textObject.style.strokeThickness + textObject.lineSpacing + textObject.style.shadowOffsetY;

        //run Phaser.Text's word wrapping to inject newlines at the appropriate places in the text string
        textObject.wordWrap = true;
        textObject.wordWrapWidth = width;
        var text = textObject.runWordWrap(textObject.text);
        var lines = text.split(/(?:\r\n|\r|\n)/);
        
        //keep adding lines of text until their height exceeds the given height
        var runningText = '';
        var runningHeight = 0;
        var textBlocks = [];    //each element to be contents of a separate Phaser.Text
        for (var i = 0; i < lines.length; i++) {
            //peek ahead: can we fit the next line?
            if (runningHeight + lineHeight < height) {
                //yes, add it and increase the height used so far
                runningText += lines[i] + '\n';
                runningHeight += lineHeight;
            }
            else {
                //no, save the block and start a new one from this line
                textBlocks.push(runningText);
                runningText = lines[i] + '\n';
                runningHeight = lineHeight;
            }
        }
        //save whatever text remains that didn't quite fill a whole block
        textBlocks.push(runningText);
        
        var textBoxes = [];
        for (var j = 0; j < textBlocks.length; j++) { 
            var textBox = new Phaser.Text(textObject.game, textObject.x, textObject.y, textBlocks[j], cloneStyle(textObject.style));
            textBox.wordWrap = false;   //turn off wrap, as text is pre-wrapped (avoids a bug where second round of wrapping is sometimes different...?)
            textBoxes.push(textBox);
        }
        return textBoxes;
    }

    //clone the given text style, shallow copying all the values it can have according to Phaser.Text documentation
    //this is done when creating new Phaser.Texts in chopText(), so that modifying the new styles do not affect the original
    function cloneStyle(style) {
        return {
            font: style.font,
            fill: style.fill,
            align: style.align,
            stroke: style.stroke,
            strokeThickness: style.strokeThickness,
            wordWrap: style.wordWrap,
            wordWrapWidth: style.wordWrapWidth,
        };
    }
}());