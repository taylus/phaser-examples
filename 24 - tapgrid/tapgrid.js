(function() {
    'use strict';
    var Cell = function(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.toggle = function() {
            if(this.color === COLORS.WHITE) {
                this.color = COLORS.BLACK;
            }
            else {
                this.color = COLORS.WHITE;
            }
        };
    };
    Cell.prototype.constructor = Cell;
    var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'phaser-game', {preload: preload, create: create});
    var graphics;
    var grid;
    var CELL_SIZE = 62;     //grid cell width and height (in pixels)
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
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        graphics = game.add.graphics(0, 0);
    }
    
    function create() {
        game.input.onDown.add(clickCell, null);
        //grid = createGrid(8, 4);
        grid = createScreenSizedGrid(game.width, game.height, CELL_SIZE + CELL_MARGIN);
        randomizeGrid(grid);
        drawGrid(grid);
    }
    
    function drawGrid(grid) {
        //sanity checks, defaults
        if(!Array.isArray(grid) || !Array.isArray(grid[0])) throw 'Grid must be a 2D array.';
        if(grid.length <= 0) throw 'Grid must contain at least one row.';
        if(grid[0].length <= 0) throw 'Grid must contain at least one column.';
     
        //determine grid dimensions (in cells)
        var width = grid.length;
        var height = grid[0].length;
        
        //draw squares at grid cells
        for(var x = 0; x < width; x++) {
            for(var y = 0; y < height; y++) {
                var cell = grid[x][y];
                if(cell) drawCell(cell);
            }
        }
    }
    
    function drawCell(cell) {
        drawSquare(cell.x, cell.y, CELL_SIZE, cell.color);
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
    
    //set each cell in the given 2D grid to a 50/50 random color
    function randomizeGrid(grid) {
        for(var i = 0; i < grid.length; i++) {
            for(var j = 0; j < grid[i].length; j++) {
                grid[i][j] = new Cell(i * (CELL_SIZE + CELL_MARGIN), j * (CELL_SIZE + CELL_MARGIN), Math.random() < 0.5? COLORS.WHITE: COLORS.BLACK);
            }
        }
    }
    
    function clickCell() {
        var cellCoords = screenCoordsToCellCoords(game.input.x, game.input.y);
        //toggleCell(cellCoords.x, cellCoords.y);
        toggleCell(cellCoords.x, cellCoords.y - 1);
        toggleCell(cellCoords.x, cellCoords.y + 1);
        toggleCell(cellCoords.x - 1, cellCoords.y);
        toggleCell(cellCoords.x + 1, cellCoords.y);
    }
    
    function screenCoordsToCellCoords(x, y) {
        return {
            x: Math.floor(x / (CELL_SIZE + CELL_MARGIN)),
            y: Math.floor(y / (CELL_SIZE + CELL_MARGIN))
        };
    }
    
    function toggleCell(x, y) {
        var cell = grid[x][y];
        if (cell) {
            cell.toggle();
            drawCell(cell);
        }
    }
}());