(function() {
    'use strict';
    var Cell = function(northWall, eastWall, southWall, westWall) {
		this.northWall = northWall;
        this.eastWall = eastWall;
        this.southWall = southWall;
        this.westWall = westWall;
        this.visited = false;
	};
    Cell.prototype.constructor = Cell;
    
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, 
        Phaser.CANVAS, 'phaser-game', { preload: preload, create: create });
    var graphics;
    var grid;
    var GRID_WIDTH = 15;    //grid width (in cells)
    var GRID_HEIGHT = 10;   //grid height (in cells)
    var CELL_SIZE = 52;     //grid cell total width and height (in pixels)
    var WALL_WIDTH = 3;     //grid wall/border width (in pixels)

    var COLORS = {
        RED: 0xff0000,
        GREEN: 0x00ff00,
        BLUE: 0x0000ff,
        YELLOW: 0xffff00,
        BLACK: 0x000000,
        WHITE: 0xffffff,
        GRAY: 0x999999
    };
    
    function preload() {
        graphics = game.add.graphics(0, 0);
    }
    
    function create() {
        grid = createGrid(GRID_WIDTH, GRID_HEIGHT);
        drawGrid(grid, 0, 0);
    }
    
    //create a 2D grid of cells with the given dimensions
    function createGrid(width, height) {
        var grid = createArray(width, height);
        for(var x = 0; x < width; x++) {
            for(var y = 0; y < height; y++) {
                grid[x][y] = new Cell(true, true, true, true);
            }
        }
        return grid;
    }
    
    //create an N-dimensional array of the given length(s)
    //call with variable-length arguments for additional dimensions
    //e.g. createArray(2, 2), createArray(2, 2, 3), etc
    function createArray(length) {
        var arr = new Array(length || 0);
        var i = length;

        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while(i--) arr[length-1 - i] = createArray.apply(null, args);
        }

        return arr;
    }
    
    //draw a grid of cells at the given coordinates
    function drawGrid(grid, gridX, gridY) {
        if(!Array.isArray(grid) || !Array.isArray(grid[0])) throw 'Grid must be a 2D array.';
        if(grid.length <= 0) throw 'Grid must contain at least one row.';
        if(grid[0].length <= 0) throw 'Grid must contain at least one column.';
        gridX = gridX || 0;
        gridY = gridY || 0;
        
        for(var x = 0; x < GRID_WIDTH; x++) {
            for(var y = 0; y < GRID_HEIGHT; y++) {
                var cellX = gridX + (x * CELL_SIZE);
                var cellY = gridY + (y * CELL_SIZE);
                drawCell(grid[x][y], cellX, cellY, CELL_SIZE);
            }
        }
    }
    
    //draw a cell at the given coordinates
    function drawCell(cell, x, y) {
        graphics.beginFill(COLORS.WHITE, 1.0);
        graphics.drawRect(x, y, CELL_SIZE, CELL_SIZE);
        graphics.endFill();
        
        graphics.lineStyle(WALL_WIDTH, COLORS.BLACK, 1.0);
        if(cell.northWall) {
            graphics.moveTo(x, y);
            graphics.lineTo(x + CELL_SIZE, y);
        }
        if(cell.southWall) {
            graphics.moveTo(x, y + CELL_SIZE);
            graphics.lineTo(x + CELL_SIZE, y + CELL_SIZE);
        }
        if(cell.westWall) {
            graphics.moveTo(x, y);
            graphics.lineTo(x, y + CELL_SIZE);
        }
        if(cell.eastWall) {
            graphics.moveTo(x + CELL_SIZE, y);
            graphics.lineTo(x + CELL_SIZE, y + CELL_SIZE);
        }
    }
}());