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
        this.color = COLORS.WHITE;
    };
    Cell.prototype.constructor = Cell;
    
    var game = new Phaser.Game(window.innerWidth || 800, window.innerHeight || 600, 
        Phaser.CANVAS, 'phaser-game', { create: create });
    var graphics;
    var cellStack = [];
    var GRID_WIDTH = 24;    //grid width (in cells)
    var GRID_HEIGHT = 14;   //grid height (in cells)
    var CELL_SIZE = 40;     //grid cell total width and height (in pixels)
    var WALL_WIDTH = 3;     //grid wall/border width (in pixels)

    var COLORS = {
        RED: 0xff0000,
        GREEN: 0x00ff00,
        BLUE: 0x0000ff,
        YELLOW: 0xffff00,
        BLACK: 0x000000,
        WHITE: 0xffffff
    };
    
    //Phaser game setup
    function create() {
        graphics = game.add.graphics(0, 0);
        var grid = createGrid(GRID_WIDTH, GRID_HEIGHT);        
        generateMaze(grid);
        
        //color a pair of starting and ending cells
        //these can be any cells, since all the cells in the maze are connected
        grid[0][0].color = COLORS.RED;
        grid[GRID_WIDTH - 1][GRID_HEIGHT - 1].color = COLORS.RED;
        drawGrid(grid);
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
    
    //draw a grid of cells at the given coordinates
    function drawGrid(grid) {
        if(!Array.isArray(grid) || !Array.isArray(grid[0])) throw 'Grid must be a 2D array.';
        if(grid.length <= 0) throw 'Grid must contain at least one row.';
        if(grid[0].length <= 0) throw 'Grid must contain at least one column.';
        
        //draw squares at grid cells
        for(var x = 0; x < GRID_WIDTH; x++) {
            for(var y = 0; y < GRID_HEIGHT; y++) {
                var cellX = x * CELL_SIZE;
                var cellY = y * CELL_SIZE;
                drawCell(grid[x][y], cellX, cellY);
            }
        }
    }
    
    //draw a cell at the given coordinates
    function drawCell(cell, x, y) {
        graphics.beginFill(cell.color, 1.0);
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
    
    //generate a maze using the recursive backtracking algorithm:
    //see https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_backtracker
    function generateMaze(grid) {
        var currentCell = getRandomUnvisitedCell(grid);
        currentCell.visited = true;
        
        while(hasUnvisitedCells(grid)) {
            var unvisitedNeighbors = getUnvisitedNeighbors(currentCell, grid);
            if(unvisitedNeighbors.length > 0) {
                var randomUnvisitedNeighbor = getRandomArrayElement(unvisitedNeighbors);
                cellStack.push(randomUnvisitedNeighbor);
                removeWallsBetween(currentCell, randomUnvisitedNeighbor);
                currentCell = randomUnvisitedNeighbor;
                currentCell.visited = true;
            }
            else if(cellStack.length > 0) {
                currentCell = cellStack.pop();
            }
            else {
                currentCell = getRandomUnvisitedCell(grid);
                currentCell.visited = true;
            }
        }
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