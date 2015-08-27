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
        }
    };
    
    var ball = {
        graphics: null,
        circle: null,
        velocity: null,
        speed: 6,
        MAX_BOUNCE_ANGLE: Math.PI / 8
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
        resetBall();
    }
    
    function update() {
        paddle.graphics.clear();
        paddle.graphics.lineStyle(10, 0x777777, 1.0);
        paddle.centerAngle = getAngle(game.input.x, game.input.y, orbit.circle);
        paddle.graphics.arc(orbit.circle.x, orbit.circle.y, orbit.circle.radius, paddle.startAngle, paddle.endAngle);
        
        ball.circle.x += ball.velocity.x;
        ball.circle.y += ball.velocity.y;
        
        if (ball.circle.x - ball.circle.radius < 0 || ball.circle.x + ball.circle.radius > game.width) resetBall();
        if (ball.circle.y - ball.circle.radius < 0 || ball.circle.y + ball.circle.radius > game.height) resetBall();
        
        ball.graphics.x = ball.circle.x - ball.circle.radius;
        ball.graphics.y = ball.circle.y - ball.circle.radius;
        
        var ballDistance = distance(ball.circle.x, ball.circle.y, orbit.circle.x, orbit.circle.y);
        if (ballDistance + ball.circle.radius >= orbit.circle.radius) {
            if (ballPaddleAngleIntersect()) {
                ball.velocity.x = -ball.velocity.x;
                ball.velocity.y = -ball.velocity.y;
                var bounceAngle = getBallBounceAngle();
                console.log('bounce angle: ' + radiansToDegrees(bounceAngle));
                //https://gamedev.stackexchange.com/questions/4253/in-pong-how-do-you-calculate-the-balls-direction-when-it-bounces-off-the-paddl
                //ball.velocity.x = ball.speed * Math.cos(bounceAngle);
                //ball.velocity.y = ball.speed * -Math.sin(bounceAngle);
            }
            else {
                resetBall();
            }
        }
        
        //console.log('start: ' + paddle.startAngle + ' end:' + paddle.endAngle);
    }
    
    //resets the ball's position and velocity
    function resetBall() {
        ball.circle.x = orbit.circle.x - ball.circle.radius;
        ball.circle.y = orbit.circle.y - ball.circle.radius;
        ball.velocity = randomVelocity(ball.speed);
    }
    
    //is the ball's point on the orbit circle within the paddle?
    function ballPaddleAngleIntersect() {
        var fudgeFactor = Math.PI / 64;  //allow some leeway since the ball is a circle and not a point
        var ballAngle = getAngle(ball.circle.x, ball.circle.y, orbit.circle);
        if (ballAngle < 0 && (Math.PI - paddle.centerAngle) <= (paddle.width / 2)) {
            //if the paddle is near an angle discontinuity, adjust the ball angle
            //Math.atan2 goes from pi to negative pi at 9 o'clock...!
            ballAngle += (2 * Math.PI);
        }
        return ballAngle >= paddle.startAngle - fudgeFactor && ballAngle <= paddle.endAngle + fudgeFactor;
    }
    
    function getBallBounceAngle() {
        var ballAngle = getAngle(ball.circle.x, ball.circle.y, orbit.circle);
        var angleDiff = paddle.centerAngle - ballAngle;
        var normalizedAngleDiff = angleDiff / (paddle.width / 2);
        //console.log(normalizedAngleDiff);
        return normalizedAngleDiff * ball.MAX_BOUNCE_ANGLE;
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
    
    function radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }
//}());