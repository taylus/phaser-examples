(function() {
    'use strict';
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, 
        Phaser.CANVAS, 'phaser-game', { preload: preload, create: create });
    var graphics;
    var grid;
    var CELL_SIZE = 30;     //grid cell width and height (in pixels)
    var CELL_MARGIN = 2;    //margin between cells when drawn (in pixels)

    var COLORS = {
        RED: 0xff0000,
        GREEN: 0x00ff00,
        BLUE: 0x0000ff,
        YELLOW: 0xffff00,
        BLACK: 0x000000,
        WHITE: 0xffffff
    };
    
    function preload() {
        graphics = game.add.graphics(0, 0);
    }
    
    function create() {
        //grid = createGrid(10, 10);
        grid = createScreenSizedGrid(game.width, game.height, CELL_SIZE + CELL_MARGIN);
        randomizeGrid(grid);
        console.log(grid);
        drawGrid(grid, CELL_SIZE, 0, 0, CELL_MARGIN);
    }
    
    function drawGrid(grid, cellSize, gridX, gridY, cellMargin) {
        //sanity checks, defaults
        if(!Array.isArray(grid) || !Array.isArray(grid[0])) throw 'Grid must be a 2D array.';
        if(grid.length <= 0) throw 'Grid must contain at least one row.';
        if(grid[0].length <= 0) throw 'Grid must contain at least one column.';
        cellSize = cellSize || CELL_SIZE;
        gridX = gridX || 0;
        gridY = gridY || 0;
        cellMargin = cellMargin || 0;
     
        //determine grid dimensions (in cells)
        var width = grid.length;
        var height = grid[0].length;
        
        //draw squares at grid cells
        for(var x = 0; x < width; x++) {
            for(var y = 0; y < height; y++) {
                var squareX = gridX + (x * (cellSize + cellMargin));
                var squareY = gridY + (y * (cellSize + cellMargin));
                if(grid[x][y]) drawSquare(squareX, squareY, cellSize, COLORS.WHITE);
            }
        }
    }
    
    function drawSquare(x, y, size, color) {
        graphics.beginFill(color, 1.0);
        graphics.drawRect(x, y, size, size);
    }
    
    //create a 2D grid with enough cells of the given size to fit the screen
    function createScreenSizedGrid(screenWidth, screenHeight, cellSize) {
        var widthInCells = Math.ceil(screenWidth / cellSize);
        var heightInCells = Math.ceil(screenHeight / cellSize);
        return createGrid(widthInCells, heightInCells);
    }
    
    //create a 2D grid with the given dimensions
    function createGrid(width, height) {
        return createArray(width, height);
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
    
    //set each cell in the given 2D grid to a 50/50 random boolean
    function randomizeGrid(grid) {
        for(var i = 0; i < grid.length; i++) {
            for(var j = 0; j < grid[i].length; j++) {
                grid[i][j] = Math.random() < 0.5;
            }
        }
    }
}());