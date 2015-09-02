//(function() {
    'use strict';
    var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'phaser-game',
        {create: create, update: update});
        
    var orbit = {
        graphics: null, 
        circle: null
    };
    
    var paddle = {
        graphics: null,
        width: null,
        centerAngle: null,
        get startAngle() {
            return this.centerAngle - this.width / 2;
        },
        get endAngle() {
            return this.centerAngle + this.width / 2;
        },
        get centerPoint() {
            return {
                x: orbit.circle.x + (Math.cos(this.centerAngle) * orbit.circle.radius),
                y: orbit.circle.y + (Math.sin(this.centerAngle) * orbit.circle.radius)
            };
        }
    };
    
    var ball = {
        graphics: null,
        circle: null,
        velocity: null,
        speed: 8,
        get angle() {
            return getAngle(this.circle.x, this.circle.y, orbit.circle);
        },
        get pointOnOrbit() {
            return {
                x: orbit.circle.x + (Math.cos(this.angle) * orbit.circle.radius),
                y: orbit.circle.y + (Math.sin(this.angle) * orbit.circle.radius)
            };
        },
        reset: function() {
            this.circle.x = orbit.circle.x - this.circle.radius;
            this.circle.y = orbit.circle.y - this.circle.radius;
            this.velocity = randomVelocity(this.speed);
        }
    };
    
    function create() {
        var orbitRadius = (Math.min(game.width, game.height) - 20) / 2;
        orbit.circle = new Phaser.Circle(game.world.centerX, game.world.centerY, orbitRadius * 2);
        
        //draw the circle that the paddle is constrained to
        orbit.graphics = game.add.graphics(0, 0);
        orbit.graphics.lineStyle(2, 0x777777, 0.5);
        orbit.graphics.drawCircle(orbit.circle.x, orbit.circle.y, orbit.circle.diameter);
        
        paddle.graphics = game.add.graphics(0, 0);
        paddle.width = Math.PI / 4;  //angle in radians
        
        var ballRadius = orbitRadius / 14;
        ball.circle = new Phaser.Circle(ballRadius, ballRadius, ballRadius * 2);
        ball.graphics = game.add.graphics(0, 0);
        ball.graphics.beginFill(0x777777, 1.0);
        ball.graphics.drawCircle(ball.circle.x, ball.circle.y, ball.circle.diameter);
        ball.reset();
    }
    
    function update() {
        paddle.graphics.clear();
        paddle.graphics.lineStyle(10, 0x777777, 1.0);
        paddle.centerAngle = getAngle(game.input.x, game.input.y, orbit.circle);
        paddle.graphics.arc(orbit.circle.x, orbit.circle.y, orbit.circle.radius, paddle.startAngle, paddle.endAngle);
        
        ball.circle.x += ball.velocity.x;
        ball.circle.y += ball.velocity.y;
        
        if (ball.circle.x - ball.circle.radius < 0 || ball.circle.x + ball.circle.radius > game.width) ball.reset();
        if (ball.circle.y - ball.circle.radius < 0 || ball.circle.y + ball.circle.radius > game.height) ball.reset();
        
        ball.graphics.x = ball.circle.x - ball.circle.radius;
        ball.graphics.y = ball.circle.y - ball.circle.radius;
        
        var ballDistance = distance(ball.circle.x, ball.circle.y, orbit.circle.x, orbit.circle.y);
        if (ballDistance + ball.circle.radius >= orbit.circle.radius) {
            if (ballPaddleAngleIntersect()) {
                var bounceVector = getBallBounceVector();
                var dot = dotProduct(ball.velocity, bounceVector);
                ball.velocity.x -= 2 * dot * bounceVector.x;
                ball.velocity.y -= 2 * dot * bounceVector.y;
            }
            else {
                ball.reset();
            }
        }
    }
    
    //is the ball's point on the orbit circle within the paddle?
    function ballPaddleAngleIntersect() {
        var fudgeFactor = Math.PI / 64;  //allow some leeway since the ball is a circle and not a point
        var ballAngle = getAngle(ball.circle.x, ball.circle.y, orbit.circle);
        if (ballAngle < 0 && (Math.PI - paddle.centerAngle) < (paddle.width / 2)) {
            //if the paddle is near an angle discontinuity, adjust the ball angle
            //Math.atan2 goes from pi to negative pi at 9 o'clock...!
            ballAngle += (2 * Math.PI);
        }
        return ballAngle >= paddle.startAngle - fudgeFactor && ballAngle <= paddle.endAngle + fudgeFactor;
    }
    
    //gets the unit vector between the point the ball bounce off the paddle and the ball's center
    function getBallBounceVector() {
        return unitVector(vectorBetween(ball.pointOnOrbit.x, ball.pointOnOrbit.y, ball.circle.x, ball.circle.y));
    }
    
    //returns the angle of the point (x, y) along the given circle
    function getAngle(x, y, circle) {
        return Math.atan2(y - circle.y, x - circle.x);
    }
    
    //returns the distance between two points
    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
    
    //returns a random velocity (x, y) where abs(x) + abs(y) = magnitude
    function randomVelocity(magnitude) {
        var x = randomIntInRange(0, magnitude);
        var y = magnitude - x;
        if (Math.random() >= 0.5) x = -x;
        if (Math.random() >= 0.5) y = -y;
        return {x: x, y: y};
    }
    
    //returns a random integer within the given range inclusive
    function randomIntInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    //returns the vector between the two given points
    function vectorBetween(x1, y1, x2, y2) {
        return {
            x: x2 - x1,
            y: y2 - y1,
        };
    }
    
    //returns the vector with length 1 and same direction as the given vector
    function unitVector(vector) {
        return {
            x: vector.x / magnitude(vector),
            y: vector.y / magnitude(vector)
        };
    }
    
    //returns the length of the given vector
    function magnitude(vector) {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }
    
    //returns the dot product between the two given vectors
    //v2 * dot(v1, v2) is v1 projected onto v2
    function dotProduct(vector1, vector2) {
        return vector1.x * vector2.x + vector1.y * vector2.y;
    }
    
    //converts radians to degrees (just used for debug printing)
    function radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }
//}());