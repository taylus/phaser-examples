(function() {
    'use strict';
    var Cell = function(x, y, northWall, eastWall, southWall, westWall) {
        this.x = x;
        this.y = y;
        this.northWall = northWall;
        this.eastWall = eastWall;
        this.southWall = southWall;
        this.westWall = westWall;
        this.visited = false;
    };
    Cell.prototype = {
        getColor: function() {
            if(this.visited) 
                return COLORS.WHITE;
            else
                return COLORS.BLACK;
        }
    };
    Cell.prototype.constructor = Cell;
    
    var GRID_WIDTH = 32;    //grid width (in cells)
    var GRID_HEIGHT = 15;   //grid height (in cells)
    var CELL_SIZE = 32;     //grid cell total width and height (in pixels)
    var WALL_WIDTH = 1;     //grid wall/border width (in pixels)
    var game = new Phaser.Game(GRID_WIDTH * CELL_SIZE, GRID_HEIGHT * CELL_SIZE, 
        Phaser.CANVAS, 'phaser-game', { preload: preload, create: create });
    var graphics;
    var grid;
    var previousCell;
    var currentCell;
    var cellStack = [];
    var mazeGenTimer;

    var COLORS = {
        RED: 0xff0000,
        GREEN: 0x00ff00,
        BLUE: 0x0000ff,
        YELLOW: 0xffff00,
        BLACK: 0x000000,
        WHITE: 0xffffff
    };
    
    //Phaser game pre-setup
    function preload() {
        //scale the game to fit its parent container
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.setScreenSize();
        
        //enable timers
        game.time.advancedTiming = true;
    }
    
    //Phaser game setup
    function create() {
        graphics = game.add.graphics(0, 0);
        
        grid = createGrid(GRID_WIDTH, GRID_HEIGHT);        
        currentCell = getRandomUnvisitedCell(grid);
        currentCell.visited = true;
        
        //remove border walls from a start and end cell
        var startCell = grid[0][0];
        startCell.northWall = startCell.westWall = false;
        drawCell(startCell);
        var endCell = grid[GRID_WIDTH - 1][GRID_HEIGHT - 1];
        endCell.southWall = endCell.eastWall = false;
        drawCell(endCell);
        
        //step up a timer that runs a single step of the maze generation every 30ms
        mazeGenTimer = game.time.events.loop(30, generateMazeStep);
    }
    
    //create a 2D grid of cells with the given dimensions
    function createGrid(width, height) {
        var grid = createArray(width, height);
        for(var x = 0; x < width; x++) {
            for(var y = 0; y < height; y++) {
                //default each cell to having all four walls up
                grid[x][y] = new Cell(x, y, true, true, true, true);
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
    
    //draw a cell at the given coordinates
    function drawCell(cell) {
        var x = cell.x * CELL_SIZE;
        var y = cell.y * CELL_SIZE;
        if(cell == currentCell && hasUnvisitedCells(grid)) {
            graphics.beginFill(COLORS.RED, 1.0);
        }
        else {
            graphics.beginFill(cell.getColor(), 1.0);
        }
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
        graphics.lineStyle(0);
    }
    
    //runs a single iteration of the maze generation algorithm
    function generateMazeStep() {
        if(hasUnvisitedCells(grid)) {
            var unvisitedNeighbors = getUnvisitedNeighbors(currentCell, grid);
            if(unvisitedNeighbors.length > 0) {
                var randomUnvisitedNeighbor = getRandomArrayElement(unvisitedNeighbors);
                cellStack.push(randomUnvisitedNeighbor);
                removeWallsBetween(currentCell, randomUnvisitedNeighbor);
                previousCell = currentCell;
                currentCell = randomUnvisitedNeighbor;
                currentCell.visited = true;
            }
            else if(cellStack.length > 0) {
                previousCell = currentCell;
                currentCell = cellStack.pop();
            }
            else {
                previousCell = currentCell;
                currentCell = getRandomUnvisitedCell(grid);
                currentCell.visited = true;
            }
        }
        else {            
            //all done, stop looping
            mazeGenTimer.loop = false;
        }
        
        drawCell(previousCell);
        drawCell(currentCell);
    }
    
    //remove the walls between the given cells,
    //based on their positions relative to each other
    function removeWallsBetween(cell1, cell2) {
        if(cell2.x > cell1.x) {
            cell1.eastWall = false;
            cell2.westWall = false;
        }
        else if(cell2.x < cell1.x) {
            cell1.westWall = false;
            cell2.eastWall = false;
        }
        else if(cell2.y > cell1.y) {
            cell1.southWall = false;
            cell2.northWall = false;
        }
        else if(cell2.y < cell1.y) {
            cell1.northWall = false;
            cell2.southWall = false;
        }
    }
    
    //gets an unvisited cell from the given grid at random
    function getRandomUnvisitedCell(grid) {
        var unvisitedCells = getUnvisitedCells(grid);
        return getRandomArrayElement(unvisitedCells);
    }
    
    //get all cells in the given graph that have not yet been
    //visited by the maze generation algorithm
    function getUnvisitedCells(grid) {
        var unvisitedCells = [];
        for(var x = 0; x < GRID_WIDTH; x++) {
            for(var y = 0; y < GRID_HEIGHT; y++) {
                var cell = grid[x][y];
                if(!cell.visited) unvisitedCells.push(cell);
            }
        }
        return unvisitedCells;
    }
    
    //does the grid have any cells not yet visited by the maze generation algorithm?
    function hasUnvisitedCells(grid) {
        for(var x = 0; x < GRID_WIDTH; x++) {
            for(var y = 0; y < GRID_HEIGHT; y++) {
                if(!grid[x][y].visited) return true;
            }
        }
        return false;
    }
    
    //gets any cells neighboring the given cell (in each of the four cardinal directions)
    //that have not yet been visited by the maze generation algorithm
    function getUnvisitedNeighbors(cell, grid) {
        var neighbors = [];
        
        if(cell.x - 1 >= 0) {
            var leftCell = grid[cell.x - 1][cell.y];
            if(!leftCell.visited) neighbors.push(leftCell);
        }
        
        if(cell.x + 1 < GRID_WIDTH) {
            var rightCell = grid[cell.x + 1][cell.y];
            if(!rightCell.visited) neighbors.push(rightCell);
        }
        
        if(cell.y - 1 >= 0) {
            var aboveCell = grid[cell.x][cell.y - 1];
            if(!aboveCell.visited) neighbors.push(aboveCell);
        }
        
        if(cell.y + 1 < GRID_HEIGHT) {
            var belowCell = grid[cell.x][cell.y + 1];
            if(!belowCell.visited) neighbors.push(belowCell);
        }
        
        return neighbors;
    }
    
    //returns an element from the given array at random
    function getRandomArrayElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}());