var width = ( 320 < window.innerWidth ) ?320 :window.innerWidth,
height = ( 480 < window.innerHeight ) ?480 :window.innerHeight,

gLoop,
points = 0,
state = true,
c = document.getElementById('c'),
ctx = c.getContext('2d');

c.width = width;
c.height = height;
//var delay = 10;
//setting canvas size 

var player = new (function(){
//create new object based on function and assign 
//what it returns to the 'player' variable

    var that = this;
//'that' will be the context now

//attributes
    that.image = new Image();
    that.image.src = "angel.png";
//create new Image and set it's source to the 
//'angel.png' image I upload above

    that.width = 65;
//width of the single frame
    that.height = 95;
//height of the single frame

    that.X = 0;
    that.Y = 0;
//X&Y position

//methods 
    that.setPosition = function(x, y){
    that.X = x;
    that.Y = y;
};

    that.draw = function(){
        try {
            ctx.drawImage(that.image, 0, 0, that.width, that.height, that.X, that.Y, that.width, that.height);
//cutting source image and pasting it into destination one, drawImage(Image Object, source X, source Y, source Width, source Height, destination X (X position), destination Y (Y position), Destination width, Destination height)
        } catch (e) {
//sometimes, if character's image is too big and will not load until the drawing of the first frame, Javascript will throws error and stop executing everything. To avoid this we have to catch an error and retry painting in another frame. It is invisible for the user with 50 frames per second.
        }
    };
}
)();

var clear = function(){
  ctx.fillStyle = '#d0e7f9';
//set active color to #d0e... (nice blue)
//UPDATE - as 'Ped7g' noticed - using clearRect() in here is useless, we cover whole surface of the canvas with blue rectangle two lines below. I just forget to remove that line
//ctx.clearRect(0, 0, width, height);
//clear whole surface
  ctx.beginPath();
//start drawing
  ctx.rect(0, 0, width, height);
//draw rectangle from point (0, 0) to
//(width, height) covering whole canvas
  ctx.closePath();
//end drawing
  ctx.fill();
//fill rectangle with active
//color selected before
};

var howManyCircles = 10, circles = [];

for (var i = 0; i < howManyCircles; i++) 
  circles.push([Math.random() * width, Math.random() * height, Math.random() * 100, Math.random() / 2]);
//add information about circles into
//the 'circles' Array. It is x & y positions, 
//radius from 0-100 and transparency 
//from 0-0.5 (0 is invisible, 1 no transparency)

var DrawCircles = function(){
  for (var i = 0; i < howManyCircles; i++) {
    ctx.fillStyle = 'rgba(255, 255, 255, ' + circles[i][3] + ')';
//white color with transparency in rgba
    ctx.beginPath();
    ctx.arc(circles[i][0], circles[i][1], circles[i][2], 0, Math.PI * 2, true);
//arc(x, y, radius, startAngle, endAngle, anticlockwise)
//circle has always PI*2 end angle
    ctx.closePath();
    ctx.fill();
  }
};

var MoveCircles = function(deltaY){
  for (var i = 0; i < howManyCircles; i++) {
    if (circles[i][1] - circles[i][2] > height) {
//the circle is under the screen so we change
//informations about it 
      circles[i][0] = Math.random() * width;
      circles[i][2] = Math.random() * 100;
      circles[i][1] = 0 - circles[i][2];
      circles[i][3] = Math.random() / 2;
    } else {
//move circle deltaY pixels down
      circles[i][1] += deltaY;
    }
  }
};

var player = new (function(){
var that = this;
that.image = new Image();

that.image.src = "angel.png";
that.width = 65;
that.height = 95;
that.frames = 1;
that.actualFrame = 0;
that.X = 0;
that.Y = 0;	

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

if (that.Y > height*0.4) {
that.setPosition(that.X, that.Y - that.jumpSpeed);	
}
else {
if (that.jumpSpeed > 10)
points++;
// if player is in mid of the gamescreen
// dont move player up, move obstacles down instead
MoveCircles(that.jumpSpeed * 0.5);

platforms.forEach(function(platform, ind){
platform.y += that.jumpSpeed;

if (platform.y > height) {
var type = ~~(Math.random() * 5);
if (type === 0)
type = 1;
else
type = 0;

platforms[ind] = new Platform(Math.random() * (width - platformWidth), platform.y - height, type);
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

that.fallStop = function(){
    that.isFalling = false;
    that.fallSpeed = 0;
    that.jump();	
};

that.checkFall = function(){
if (that.Y < height - that.height) {
    that.setPosition(that.X, that.Y + that.fallSpeed);
    that.fallSpeed++;
} else {
if (points === 0)
    that.fallStop();
else
    GameOver();
}
};

that.moveLeft = function(){
if (that.X > 0) {
that.setPosition(that.X - 5, that.Y);
}
};

that.moveRight = function(){
if (that.X + that.width < width) {
that.setPosition(that.X + 5, that.Y);
}
};

that.moveAccMove = function( a ){
if ( (that.X + that.width < width) || (that.X > 0) ) {
    that.setPosition(that.X + (5*a), that.Y);
    
    if ( that.X < 0 )
        that.X = 0;
    
    if ( that.X + that.width > width )
        that.X = width-that.width;
}
};

that.setPosition = function(x, y){
that.X = x;
that.Y = y;
};

that.interval = 0;
that.draw = function(){
try {
    ctx.drawImage(that.image, 0, that.height * that.actualFrame, that.width, that.height, that.X, that.Y, that.width, that.height);
}
catch (e) {
};

if (that.interval === 4 ) {
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

player.setPosition(~~((width-player.width)/2), ~~((height - player.height)/2));
player.jump();

 var x = 0;
  var y = 0;
//height of the canvas   
//window.onload = function() {
    if (window.DeviceMotionEvent==undefined)
 {
//    	document.getElementById("no").style.display="block";
//    	document.getElementById("yes").style.display="none";
        
        document.onmousemove = function(e){
            if (player.X + c.offsetLeft > e.pageX) {
            player.moveLeft();
            } else if (player.X + c.offsetLeft < e.pageX) {
            player.moveRight();
            }

            x = e.pageX;
            y = e.pageX;
        };
     
    } 
    else 
    {
    	window.ondevicemotion = function(event)
         {
             ax = event.accelerationIncludingGravity.x;  // -10 ~ +10
    	     //ay = event.accelerationIncludingGravity.y;
                         
            player.moveAccMove( ax );
           
            x = ax;
            y = ay;
        };
  }
//  setInterval(function() {
//    		
//    		document.getElementById("pos").innerHTML = "x=" + x + "<br />y=" + y;
//    	}, delay);
//};
 
 
//document.onmousemove = function(e){
//if (player.X + c.offsetLeft > e.pageX) {
//player.moveLeft();
//} else if (player.X + c.offsetLeft < e.pageX) {
//player.moveRight();
//}
//
//};
var nrOfPlatforms = 7,
platforms = [],
platformWidth = 70,
platformHeight = 20;

var Platform = function(x, y, type){
var that=this;

that.firstColor = '#FF8C00';
that.secondColor = '#EEEE00';
that.onCollide = function(){
player.fallStop();
};

if (type === 1) {
that.firstColor = '#AADD00';
that.secondColor = '#698B22';
that.onCollide = function(){
player.fallStop();
player.jumpSpeed = 50;
};
}

that.x = ~~ x;
that.y = y;
that.type = type;

//NEW IN PART 5
that.isMoving = ~~(Math.random() * 2);
that.direction= ~~(Math.random() * 2) ? -1 : 1;

that.draw = function(){
ctx.fillStyle = 'rgba(255, 255, 255, 1)';
var gradient = ctx.createRadialGradient(that.x + (platformWidth/2), that.y + (platformHeight/2), 5, that.x + (platformWidth/2), that.y + (platformHeight/2), 45);
gradient.addColorStop(0, that.firstColor);
gradient.addColorStop(1, that.secondColor);
ctx.fillStyle = gradient;
ctx.fillRect(that.x, that.y, platformWidth, platformHeight);
};

return that;
};

var generatePlatforms = function(){
var position = 0, type;
for (var i = 0; i < nrOfPlatforms; i++) {
type = ~~(Math.random()*5);
if (type === 0)
type = 1;
else
type = 0;
platforms[i] = new Platform(Math.random() * (width - platformWidth), position, type);
if (position < height - platformHeight)
position += ~~(height / nrOfPlatforms);
}
}();

var checkCollision = function(){
platforms.forEach(function(e, ind){
if (
(player.isFalling) &&
(player.X < e.x + platformWidth) &&
(player.X + player.width > e.x) &&
(player.Y + player.height > e.y) &&
(player.Y + player.height < e.y + platformHeight)
) {
e.onCollide();
}
});
};


var GameLoop = function(){

//if (/mobile/i.test(navigator.userAgent) )
//{
//    window.scrollTo(0, 1);
//}

clear();
//MoveCircles(5);
DrawCircles();

if (player.isJumping) player.checkJump();
if (player.isFalling) player.checkFall();

player.draw();

platforms.forEach(function(platform, index){
if (platform.isMoving) {
if (platform.x < 0) {
platform.direction = 1;
} else if (platform.x > width - platformWidth) {
platform.direction = -1;
}
platform.x += platform.direction * (index / 2) * ~~(points / 100);
}
platform.draw();
});

checkCollision();

ctx.fillStyle = "Black";
ctx.fillText("POINTS:" + points, 10, height-10);
ctx.fillText("Pos:" + x, 10, height-30);

if (state)
gLoop = setTimeout(GameLoop, 1000 / 50);
};
 
var GameOver = function(){
state = false;
clearTimeout(gLoop);
setTimeout(function(){
clear();

ctx.fillStyle = "Black";
ctx.font = "10pt Arial";
ctx.fillText("GAME OVER", width / 2 - 60, height / 2 - 50);
ctx.fillText("YOUR RESULT:" + points, width / 2 - 60, height / 2 - 30);
}, 100);
 //Replay();

};

var Replay = function()
{
    var that = this;
    that.image = new Image();
    that.image.src = "angel.png";

    that.width = 10;
//width of the single frame
    that.height = 10;
//height of the single frame

    that.X = 0;
    that.Y = 0;
   
    ctx.drawImage(that.image, 0, 0, that.width, that.height, that.X, that.Y, that.width, height / 2 - 100);
};

GameLoop();