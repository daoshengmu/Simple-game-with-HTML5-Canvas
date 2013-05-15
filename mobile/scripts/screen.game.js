jewel.screens["game-screen"] = (function() {
    var board = jewel.board,
            display = jewel.display,          
            circles = [],
            nrOfPlatforms = 7,
            platforms = [],
            platformWidth = jewel.settings.platformWidth,
            platformHeight = jewel.settings.platformHeight,
            points = 0,
            howManyCircles = 10,
            mouseX, mouseY,
            marioWidth = jewel.settings.marioWidth,
            marioHeight = jewel.settings.marioHeight,
            gLoop,
            state = true,
            //canvas = document.createElement("canvas");
            dom = jewel.dom,
            $ = dom.$,
            background = $("#game .background")[0],
            rect = background.getBoundingClientRect();

    function generatePlatforms() {
        var position = 0, type;
        for (var i = 0; i < nrOfPlatforms; i++) {
            type = ~~(Math.random() * 5);
            if (type === 0)
                type = 1;
            else
                type = 0;
            platforms[i] = new Platform(Math.random() * (rect.width - platformWidth), position, type);
            if (position < rect.height - platformHeight)
                position += ~~(rect.height / nrOfPlatforms);
        }
    }

    window.onmousemove = function(e) {
            mouseX = e.pageX;
            mouseY = e.pageY;
            if (player.X > mouseX) {
                player.moveLeft();
            } else if (player.X < mouseX) {
                player.moveRight();
            }
        };
        
    if (window.DeviceOrientationEvent) { 
        window.addEventListener("deviceorientation", function () {
         //   tilt([event.beta, event.gamma]);
         player.moveAccMove(event.gamma);
        }, true);
    } else if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', function () {
         //   tilt([event.acceleration.x * 2, event.acceleration.y * 2]);
         player.moveAccMove(event.acceleration.x);
        }, true);
    } else {
        window.addEventListener("MozOrientation", function () {
        //    tilt([orientation.x * 50, orientation.y * 50]);
            player.moveAccMove(orientation.x);
        }, true);
    }

//    if (window.DeviceMotionEvent == undefined)
//    {
//        document.onmousemove = function(e) {
//            mouseX = e.pageX;
//            mouseY = e.pageY;
//            if (player.X > mouseX) {
//                player.moveLeft();
//            } else if (player.X < mouseX) {
//                player.moveRight();
//            }
//        };
//
//
//    }
//    else
//    {
//        window.ondevicemotion = function(event)
//        {
//            var ax = event.accelerationIncludingGravity.x;  // -10 ~ +10
//            //ay = event.accelerationIncludingGravity.y;
//
//            player.moveAccMove(ax);
//
//        };
//    }

    var Platform = function(x, y, type) {
        var that = this;

        that.firstColor = '#FF8C00';
        that.secondColor = '#EEEE00';
        that.platformWidth = platformWidth;
        that.platformHeight = platformHeight;
        that.onCollide = function() {
            player.fallStop();
        };

        if (type === 1) {
            that.firstColor = '#AADD00';
            that.secondColor = '#698B22';
            that.onCollide = function() {
                player.fallStop();
                player.jumpSpeed = 50;
            };
        }

        that.x = ~~x;
        that.y = y;
        that.type = type;

        //NEW IN PART 5
        that.isMoving = ~~(Math.random() * 2);
        that.direction = ~~(Math.random() * 2) ? -1 : 1;

//        var ctx = canvas.getContext("2d");

//        that.draw = function(){
//        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
//        var gradient = ctx.createRadialGradient(that.x + (platformWidth/2), that.y + (platformHeight/2), 5, that.x + (platformWidth/2), that.y + (platformHeight/2), 45);
//        gradient.addColorStop(0, that.firstColor);
//        gradient.addColorStop(1, that.secondColor);
//        ctx.fillStyle = gradient;
//        ctx.fillRect(that.x, that.y, platformWidth, platformHeight);
//        };

        return that;
    };

    var checkCollision = function() {
        platforms.forEach(function(e, ind) {
            if (
                    (player.isFalling) &&
                    (player.X < e.x + platformWidth) &&
                    (player.X + player.width > e.x) &&
                    (player.Y + player.height > e.y) &&
                    (player.Y + player.height < e.y + platformHeight)
                    ) {
                e.onCollide();
            }
        }
        );
    };

    var player = new (function() {
        var that = this;
        //    that.image = new Image();     
        //  that.image.src = "angel.png";
        that.width = marioWidth;  // 65
        that.height = marioHeight;  // 95
        that.frames = 1;
        that.actualFrame = 0;
        that.X = 0;
        that.Y = 0;

        //   that.image = jewel.images["images/angel.png"];

        that.isJumping = false;
        that.isFalling = false;
        that.jumpSpeed = 0;
        that.fallSpeed = 0;

        that.jump = function() {
            if (!that.isJumping && !that.isFalling) {
                that.fallSpeed = 0;
                that.isJumping = true;
                that.jumpSpeed = 17;
            }
        };

        that.checkJump = function() {
            //a lot of changes here

            if (that.Y > rect.height * 0.4) {
                that.setPosition(that.X, that.Y - that.jumpSpeed);
            }
            else {
                if (that.jumpSpeed > 10)
                    points++;
                // if player is in mid of the gamescreen
                // dont move player up, move obstacles down instead
                MoveCircles(that.jumpSpeed * 0.5);

                platforms.forEach(function(platform, ind) {
                    platform.y += that.jumpSpeed;

                    if (platform.y > rect.height) {
                        var type = ~~(Math.random() * 5);
                        if (type === 0)
                            type = 1;
                        else
                            type = 0;

                        platforms[ind] = new Platform(Math.random() * (rect.width - platformWidth), platform.y - rect.height, type);
                    }
                });
            }

            that.jumpSpeed--;
            if (that.jumpSpeed === 0) {
                that.isJumping = false;
                that.isFalling = true;
                that.fallSpeed = 1;
            }

        };

        that.fallStop = function() {
            that.isFalling = false;
            that.fallSpeed = 0;
            that.jump();
        };

        that.checkFall = function() {
            if (that.Y < rect.height - that.height) {
                that.setPosition(that.X, that.Y + that.fallSpeed);
                that.fallSpeed++;
            } else {
                if (points === 0)
                    that.fallStop();
                else
                    gameOver();
            }
        };

        that.moveLeft = function() {
            if (that.X > 0) {
                that.setPosition(that.X - 5, that.Y);
            }
        };

        that.moveRight = function() {
            if (that.X + that.width < rect.width) {
                that.setPosition(that.X + 5, that.Y);
            }
        };

        that.moveAccMove = function(a) {
            if ((that.X + that.width < rect.width) || (that.X > 0)) {
                that.setPosition(that.X + (5 * a), that.Y);

                if (that.X < 0)
                    that.X = 0;

                if (that.X + that.width > rect.width)
                    that.X = rect.width - that.width;
            }
        };

        that.setPosition = function(x, y) {
            that.X = x;
            that.Y = y;
        };

        that.interval = 0;
        that.draw = function() {
            try {
                ctx.drawImage(that.image, 0, that.height * that.actualFrame, that.width, that.height, that.X, that.Y, that.width, that.height);
            }
            catch (e) {
            }
            ;

            if (that.interval === 4) {
                if (that.actualFrame === that.frames) {
                    that.actualFrame = 0;
                }
                else {
                    that.actualFrame++;
                }
                that.interval = 0;
            }
            that.interval++;
        };
    })();

    function MoveCircles(deltaY) {
        for (var i = 0; i < howManyCircles; i++) {
            if (circles[i][1] - circles[i][2] > rect.height) {
                //the circle is under the screen so we change
                //informations about it 
                circles[i][0] = Math.random() * rect.width;
                circles[i][2] = Math.random() * 100;
                circles[i][1] = 0 - circles[i][2];
                circles[i][3] = Math.random() / 2;
            } else {
                //move circle deltaY pixels down
                circles[i][1] += deltaY;
            }
        }
    };

    function setupCircles()
    {
        //  var canvas = document.createElement("canvas");

        for (var i = 0; i < howManyCircles; i++)
            circles.push([Math.random() * rect.width, Math.random() * rect.height, Math.random() * 100, Math.random() / 2]);
    }
    ;

    function moveCircles(deltaY) {

        //    var canvas = document.createElement("canvas");
        for (var i = 0; i < howManyCircles; i++) {
            if (circles[i][1] - circles[i][2] > rect.height) {
                //the circle is under the screen so we change
                //informations about it 
                circles[i][0] = Math.random() * rect.width;
                circles[i][2] = Math.random() * 100;
                circles[i][1] = 0 - circles[i][2];
                circles[i][3] = Math.random() / 2;
            } else {
                //move circle deltaY pixels down
                circles[i][1] += deltaY;
            }
        }
    };

    function detectPlayAgin()
    {       
        jewel.game.showScreen("game-over", points );           
    };

    function gameOver() {
        state = false;
        //  cancelRequestAnimationFrame(gameUpdate);
        clearTimeout(gLoop);
        setTimeout(function() {
            detectPlayAgin();         
        }, 100);

    }

    var gameUpdate = function() {
        //  function gameUpdate() {
        //  drawCircles();

        if (player.isJumping)
            player.checkJump();
        if (player.isFalling)
            player.checkFall();

        // player.draw();

        platforms.forEach(function(platform, index) {
            if (platform.isMoving) {
                if (platform.x < 0) {
                    platform.direction = 1;
                } else if (platform.x > rect.width - platformWidth) {
                    platform.direction = -1;
                }
                platform.x += platform.direction * (index / 2) * ~~(points / 100);
            }

            //        platform.draw();
        }
        );

        checkCollision();

        //  moveCircles( 0.8);

        display.redraw(circles, platforms, player, function() {
            // do nothing for now
        });

        if (state)
        {
            gLoop = setTimeout(gameUpdate, 1000 / 50);
        }
        // requestAnimationFrame(gameUpdate);
    };


    function run() {
        state = true;
        circles = [];
        points = 0;
        
        board.initialize(function() {
            display.initialize(function() {
                player.image = jewel.images["images/angel.png"];
               
                display.redraw(circles, platforms, player, function() {
                    // do nothing for now
                });
            });

            player.setPosition(~~((rect.width - player.width) / 2), ~~((rect.height - player.height) / 2));
            player.jump();
            //  requestAnimationFrame(gameUpdate);
            gameUpdate();

        });
        setupCircles();
        generatePlatforms();

        // requestAnimationFrame(gameUpdate);
    }

    return {
        run: run
    };
})();
