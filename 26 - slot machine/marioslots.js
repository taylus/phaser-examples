//(function() {
    'use strict';
    var game = new Phaser.Game(375, 112, Phaser.CANVAS, 'phaser-game',
        { preload: preload, create: create, update: update, /*render: render*/ });
    
    var Row = function(x, y, width, height, key, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.image = game.add.tileSprite(x, y, width, height, key);
        this.tween = game.add.tween(this);
        //this.positionTween = game.add.tween(this.image.tilePosition);
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
        var speed = 4;
        topRow = new Row(0, 0, 375, 39, 'top', -speed);
        middleRow = new Row(0, 39, 375, 53, 'middle', speed);
        bottomRow = new Row(0, 92, 375, 20, 'bottom', -speed);
        
        var nextRowToStop = 0;
        game.input.onDown.add(function() {
            if (nextRowToStop < 1) {
                //topRow.active = false;
                //topRow.positionTween.to({x: breakpoint}, 3000, Phaser.Easing.Back.Out).start();
                topRow.tween.to({speed: 0}, 3000, Phaser.Easing.Linear.InOut).start();
            }
            else if (nextRowToStop < 2) {
                middleRow.tween.to({speed: 0}, 3000, Phaser.Easing.Linear.InOut).start();
            }
            else if (nextRowToStop < 3) {
                bottomRow.tween.to({speed: 0}, 3000, Phaser.Easing.Linear.InOut).start();
            }
            else {
                nextRowToStop = 0;
            }
            nextRowToStop++;
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
    */
//}());