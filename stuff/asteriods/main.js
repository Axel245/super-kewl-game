// Get the 2D context from the canvas in
// our HTML page
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var backroundmusic = new Audio("Gamemusic.wav");
backroundmusic.loop = true ;
backroundmusic.play ();
var bullet1powerup = 0;
var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;
var splashTimer = 3;
var endtimer = 5;
var gameState = STATE_SPLASH;
var startFrameMillis = Date.now();
var endFrameMillis = Date.now();
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	if (deltaTime > 1)
	{
		deltaTime = 1;
	}
	return deltaTime;
}

function resetgame ()
{
playerScore = 0;
SCREEN_WIDTH = canvas.width;
SCREEN_HEIGHT = canvas.height;
spawnTimer = 1.005;
shootTimer = .00001
fps = 0;
fpsCount = 0;
fpsTime = 0;
bullets = [];

STATE_SPLASH = 0;
STATE_GAME = 1;
STATE_GAMEOVER = 2;
splashTimer = 3;
endtimer = 5;
gameState = STATE_SPLASH;
startFrameMillis = Date.now();
endFrameMillis = Date.now();
player.x = SCREEN_WIDTH/2;
player.y = SCREEN_HEIGHT/2;
player.directionX = 0;
player.directionY = 0;
player.angularDirection = 0;
player.rotation = 0;
player.isDead = false
asteroids = [];
}
var bulletimg = "bullet.png"
var playerScore = 0;
var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;
var shoot = false ;
var KEY_SPACE = 32;
var KEY_LEFT = 37;
var KEY_UP = 40;
var KEY_RIGHT = 39;
var KEY_DOWN = 38;
var ASTEROID_SPEED = 100.5;
var PLAYER_SPEED = 350
var PLAYER_TURN_SPEED = 6.1;
var BULLET_SPEED = 1000.5
var spawnTimer = 1.005;
var shootTimer = .001
var grass = document.createElement("img");
grass.src = "grass.png";
var background = [];
var snd = new Audio("Laser_Shoot.wav"); 
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;
var bullets = [];
var KEY_ESCAPE = 27;
for(var y=0;y<15;y++)
{
	background[y] = [];
	for(var x=0; x<20; x++)
		background[y][x] = grass;
}

var player = {
	image: document.createElement("img"),
	x: SCREEN_WIDTH/2,
	y: SCREEN_HEIGHT/2,
	width: 93,
	height: 80,
	directionX: 0,
	directionY: 0,
	angularDirection: 0,
	rotation: 0,
	isDead: false
};
player.image.src = "ship.png";

var asteroids = [];

 function intersects(x1, y1, w1, h1, x2, y2, w2, h2)
 {
	 if(y2 + h2 < y1 ||
		x2 + w2 < x1 ||
		x2 > x1 + w1 ||
		y2 > y1 +h1)
	{
		return false;
	}
	return true;
 }
 
 function runSplash(deltaTime)
{
splashTimer -= deltaTime;
if(splashTimer <= 0)
{
gameState = STATE_GAME;
return;
}
context.fillStyle = "white";
context.font="200px Chiller";
context.fillText("Asteroid V 2.0", 500, 510);
}

function runGame(deltaTime) 
{
	for(var y=0; y<15; y++)
	{
		for(var x=0; x<20; x++)
		{
			context.drawImage(background[y][x], x*86, y*64);
		}
	}
	for(var i=0; i<asteroids.length; i++)
{
if(intersects(
player.x - player.width/2, player.y - player.height/3,
player.width , player.height,
asteroids[i].x, asteroids[i].y,
asteroids[i].width, asteroids[i].height) == true)
{
asteroids.splice(i, 1);
player.isDead = true
break;
}
}

fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
	// draw the FPS
	context.fillStyle = "white";
	context.font="44px Chiller";
	context.fillText("FPS: " + fps, 1700, 20, 100);

if(shootTimer > 0)
shootTimer -= deltaTime;

if(shoot == true && shootTimer <= 0 && player.isDead == false)
{
shootTimer += 0.3;
playerShoot();
snd.play("Laser_Shoot.wav");
}

for(var i=0; i<bullets.length; i++)
{
bullets[i].x += bullets[i].velocityX * deltaTime;
bullets[i].y += bullets[i].velocityY * deltaTime;
}
for(var i=0; i<bullets.length; i++)
{

if(bullets[i].x < -bullets[i].width ||
bullets[i].x > SCREEN_WIDTH ||
bullets[i].y < -bullets[i].height ||
bullets[i].y > SCREEN_HEIGHT)
{
	bullets.splice(i, 1);

break;
}
}

for(var i=0; i<bullets.length; i++)
{
DrawImage (context, bullets[i].image, bullets[i].x - bullets[i].width/2, bullets[i].y - bullets[i].height/2, bullets[i].rotation);
}
	for(var i=0; i<asteroids.length; i++)
{
asteroids[i].x = asteroids[i].x + asteroids[i].velocityX * deltaTime;
asteroids[i].y = asteroids[i].y + asteroids[i].velocityY * deltaTime;
}
// draw all the asteroids
for(var i=0; i<asteroids.length; i++)
{
context.drawImage(asteroids[i].image, asteroids[i].x, asteroids[i].y);
}
spawnTimer -= deltaTime;
if(spawnTimer <= 0)
{
spawnTimer = 1;
spawnAsteroid();
}
	var s = Math.sin(player.rotation);
	var c = Math.cos(player.rotation);
	
	var xDir = (player.directionX * c) - (player.directionY * s);
	var yDir = (player.directionX * s) + (player.directionY * c);
	var xVel = xDir * PLAYER_SPEED;
	var yVel = yDir * PLAYER_SPEED;
	
	player.x += xVel * deltaTime;
	player.y += yVel * deltaTime;
	
	player.rotation += player.angularDirection * PLAYER_TURN_SPEED * deltaTime
	if(player.isDead == false)
		DrawImage (context, player.image, player.x, player.y, player.rotation)
		

	
	if(player.x >= SCREEN_WIDTH + 80)
	{
		player.x = 0
	}
	if(player.x <= 0 - 80)
	{
		player.x = SCREEN_WIDTH + 80
	}
	if(player.y >= SCREEN_HEIGHT + 93)
	{
		player.y = 0
	}
	if(player.y <= 0 - 93)
	{
		player.y =SCREEN_HEIGHT + 93
	}
	for(var i=0; i<asteroids.length; i++)
	{
	if(asteroids[i].x >= SCREEN_WIDTH + 69)
	{
		asteroids[i].x = 0
	}
	if(asteroids[i].x <= 0 - 69)
	{
		asteroids[i].x = SCREEN_WIDTH + 69
	}
	if(asteroids[i].y >= SCREEN_HEIGHT + 75)
	{
		asteroids[i].y = 0
	}
	if(asteroids[i].y <= 0 - 75)
	{
		asteroids[i].y =SCREEN_HEIGHT + 75
	}
	}
for(var i=0; i<asteroids.length; i++)
{
for(var j=0; j<bullets.length; j++)
{
if(intersects(
bullets[j].x, bullets[j].y,
bullets[j].width, bullets[j].height,
asteroids[i].x, asteroids[i].y,
asteroids[i].width, asteroids[i].height) == true)
{
if(bullet1powerup == true)
{
asteroids.splice(i, 1);	
playerScore += 1 ;
break;
}
else{
asteroids.splice(i, 1);
bullets.splice(j, 1);
playerScore += 1 ;
break;
}
}
}
}
context.fillStyle = "rgba(55, 55, 55, 0.75)";
context.fillRect (10, 10, 60, 60);
context.fillStyle = "white";
context.font = "48px Chiller";
context.textBaseline = "top";
context.fillText(playerScore, 10 ,10);


if(player.isDead == true)
{
gameState = STATE_GAMEOVER;
return;
}
}
 
 function runGameOver(deltaTime)
 {
 endtimer  -= deltaTime;
if(endtimer  <= 0)
{
	resetgame();
gameState = STATE_GAME;
return;
}
	 context.fillStyle = "white";
context.font="200px Chiller";
context.fillText("Score", 650, 400);
context.fillText(playerScore, 1010 ,400);
 }
 
 var isPaused = false;
function run ()
{
	if(isPaused)
	{
		context.fillStyle = "red";
		context.font="300px Chiller";
		context.fillText("Paused", 650, 400);
		return;
	}
	context.fillStyle = 'black';
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	
	switch(gameState)
	{
		case STATE_SPLASH:
			runSplash(deltaTime);
			break;
		case STATE_GAME:
			runGame(deltaTime);
			break;
		case STATE_GAMEOVER:
			runGameOver(deltaTime);
			break;
	}
		
	
	}
	
	


function rand(floor, ceil)
{
	return Math.floor( (Math.random()* (ceil-floor)) +floor );
}

function spawnAsteroid()
{
	var type = rand(0, 3);
	var asteroid = {};
	asteroid.image = document.createElement("img");
	asteroid.image.src = "rock_large.png";
	asteroid.width = 69;
	asteroid.height = 75;
	var x = SCREEN_WIDTH/2;
	var y = SCREEN_HEIGHT/2;
	var dirX = rand(-10,10);
	var dirY = rand(-10,10);
	var magnitude = (dirX * dirX) + (dirY * dirY);
	if(magnitude != 0)
	{
		var oneOverMag = 1 / Math.sqrt(magnitude);
		dirX *= oneOverMag;
		dirY *= oneOverMag;
	}
	var movX = dirX * SCREEN_WIDTH;
	var movY = dirY * SCREEN_HEIGHT;
	asteroid.x = x + movX;
	asteroid.y = y + movY;
	asteroid.velocityX = -dirX * ASTEROID_SPEED;
	asteroid.velocityY = -dirY * ASTEROID_SPEED;
	asteroids.push(asteroid);
}



 function playerShoot()
{
var bullet = {
image: document.createElement("img"),
x: player.x,
y: player.y,
width: 5,
height: 5,
velocityX: 0,
velocityY: 0,
rotation: player.rotation,
};
bullet.image.src = bulletimg;
// start off with a velocity that shoots the bullet straight up
var velX = 0;
var velY = 1;
// now rotate this vector acording to the ship's current rotation
var s = Math.sin(player.rotation);
var c = Math.cos(player.rotation);
// for an explanation of this formula,
// see http://en.wikipedia.org/wiki/Rotation_matrix
var xVel = (velX * c) - (velY * s);
var yVel = (velX * s) + (velY * c);
bullet.velocityX = xVel * BULLET_SPEED;
bullet.velocityY = yVel * BULLET_SPEED;
// finally, add the bullet to the bullets array
bullets.push(bullet);
}



function onKeyDown(event)
{
if(event.keyCode == KEY_UP)
{
player.directionY = -1;
}
if(event.keyCode == KEY_DOWN)
{
player.directionY = 1;
}
if(event.keyCode == KEY_LEFT)
{
player.angularDirection = -1;
}
if(event.keyCode == KEY_RIGHT)
{
player.angularDirection = 1;
}
if(event.keyCode == 17)
{


if (bullet1powerup == false)
{
bullet1powerup = true;
bulletimg = "1bullet.png"
}
else if(bullet1powerup == true)
{
	bullet1powerup = false
	bulletimg = "bullet.png"
}

}
if(event.keyCode == KEY_SPACE)
{
	shoot = true

}
//how to make a toggle 


if(event.keyCode == KEY_ESCAPE)
{
isPaused = !isPaused;
if(isPaused == false)
{
getDeltaTime();
}
}
}
function onKeyUp(event)
{
if(event.keyCode == KEY_UP)
{
player.directionY = 0;
}
if(event.keyCode == KEY_DOWN)
{
player.directionY = 0;
}
if(event.keyCode == KEY_LEFT)
{
player.angularDirection = 0;
}
if(event.keyCode == KEY_RIGHT)
{
player.angularDirection = 0;
}
if(event.keyCode == KEY_SPACE)
{
	shoot = false
}

}

window.addEventListener('keydown', function(evt) {onKeyDown(evt); }, false);
window.addEventListener('keyup', function(evt) { onKeyUp(evt); }, false);





function DrawImage (ctx, img, posX, posY, ang)

{
ctx.save();
   ctx.translate(posX, posY);
   ctx.rotate(ang);
   ctx.drawImage(img, -img.width/2, -img.height/2);
ctx.restore();
}


(function() {
	var onEachFrame;
	if (window.requestAnimationFrame) {
		onEachFrame = function(cb) {
			var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
			_cb();
		};
	} else if (window.mozRequestAnimationFrame) {
		onEachFrame = function(cb) {
			var _cb = function() {cb();
			window.mozRequestAnimationFrame(_cb);}
			_cb();
			};
	} else {
		onEachFrame = function(cb) {
			setInterval(cb, 1000 / 60);
		}
	}
		window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);