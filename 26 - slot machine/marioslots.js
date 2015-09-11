//(function() {
    'use strict';
    var game = new Phaser.Game(375, 112, Phaser.CANVAS, 'phaser-game',
        { preload: preload, create: create, update: update, /*render: render*/ });
        
    //tilePosition.x for each row such that the images line up
    var breakpoints = [
        [0, -124, -249],
        [0, 250, 125],
        [0, -125, -250]
    ];
    
    var Row = function(x, y, width, height, key, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.image = game.add.tileSprite(x, y, width, height, key);
        this.tween = game.add.tween(this.image.tilePosition);
        this.active = true;
    };
    
    Row.prototype.update = function() {
        if (!this.image) return;
        if (!this.speed) return;
        if (!this.active) return;
        this.image.tilePosition.x += this.speed;
        if(this.image.tilePosition.x > this.width)
            this.image.tilePosition.x = 0;
        else if(this.image.tilePosition.x < -this.width)
            this.image.tilePosition.x = 0;
    };
    
    var topRow, middleRow, bottomRow;
    
    function preload() {
        game.load.image('top', 'top.png');
        game.load.image('middle', 'middle.png');
        game.load.image('bottom', 'bottom.png');
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }
    
    function create() {
        var speed = 6;
        topRow = new Row(0, 0, 375, 39, 'top', -speed);
        middleRow = new Row(0, 39, 375, 53, 'middle', speed);
        bottomRow = new Row(0, 92, 375, 20, 'bottom', -speed);
        
        //topRow.image.tilePosition.x = breakpoints[0][0];
        //middleRow.image.tilePosition.x = breakpoints[1][0];
        //bottomRow.image.tilePosition.x = breakpoints[2][0];
        
        var breakpoint;
        game.input.onDown.add(function() {
            if (topRow.active) {
                topRow.active = false;
                breakpoint = closest(topRow.image.tilePosition.x, breakpoints[0]) + (Math.sign(topRow.speed) * topRow.width * 3);
                topRow.tween.to({x: breakpoint}, 4000, Phaser.Easing.Linear.In).start();
            }
            else if (middleRow.active) {
                middleRow.active = false;
                breakpoint = closest(middleRow.image.tilePosition.x, breakpoints[1]) + (Math.sign(middleRow.speed) * middleRow.width * 2);
                middleRow.tween.to({x: breakpoint}, 3000, Phaser.Easing.Linear.In).start();
            }
            else if (bottomRow.active) {
                bottomRow.active = false;
                breakpoint = closest(bottomRow.image.tilePosition.x, breakpoints[2]) + (Math.sign(bottomRow.speed) * bottomRow.width * 4);
                bottomRow.tween.to({x: breakpoint}, 5000, Phaser.Easing.Linear.In).start();
            }
        });
    }
    
    function update() {
        topRow.update();
        middleRow.update();
        bottomRow.update();
    }
    
    /*
    function render() {
        game.debug.text(topRow.image.tilePosition.x + "," + middleRow.image.tilePosition.x + "," + bottomRow.image.tilePosition.x, 0, 12);
    }
    */
    
    //returns the array element closest to the given number
    //assumes all arguments are numbers
    function closest(number, array) {
        var closestIndex = 0;
        var minDiff = Number.MAX_VALUE;
        for (var i = 0; i < array.length; i++) {
            var diff = Math.abs(array[i] - number);
            if (diff < minDiff) {
                closestIndex = i;
                minDiff = diff;
            }
        }
        return array[closestIndex];
    }
    
    Math.sign = Math.sign || function(x) {
        x = +x; // convert to a number
        if (x === 0 || isNaN(x)) return x;
        return x > 0 ? 1 : -1;
    };
//}());