var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here
 
var cells = [];
function initialize() {
	for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++) {
		cells[layerIdx] = [];
		var idx = 0;
		for(var y = 0; y < level1.layers[layerIdx].height; y++) {
			cells[layerIdx][y] = [];
			for(var x = 0; x < level1.layers[layerIdx].width; x++) {
				if(level1.layers[layerIdx].data[idx] != 0) {
					cells[layerIdx][y][x] = 1;
				}
				else if(cells[layerIdx][y][x] != 1) {
					cells[layerIdx][y][x] = 0;
				}
				idx++;
			}
		}
	}
}

var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;
var gameState = STATE_SPLASH
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;


var LAYER_COUNT = level1.layers.length;
var MAP = {tw: level1.width, th: level1.height};
var TILE = level1.tilewidth;
var TILESET_TILE = level1.tilesets[0].tilewidth;
var TILESET_PADDING = level1.tilesets[0].margin;
var TILESET_SPACING = level1.tilesets[0].spacing;
var TILESET_COUNT_X = level1.tilesets[0].columns;
var TILESET_COUNT_Y = level1.tilesets[0].tilecount
						/ TILESET_COUNT_X;
						
var tileset = document.createElement("img");
tileset.src = level1.tilesets[0].image;

var METER = TILE;
var GRAVITY = METER * 9 * 6;
var MAXDX = METER * 10;
var MAXDY = METER * 15;
var ACCEL = MAXDX * 2;
var FRICTION = MAXDX * 5;
var JUMP = METER * 1500000000000;
var LAYER_BACKGROUND = 0;
var LAYER_PLATFORMS = 2;
var LAYER_LADDERS = 1;
function cellAtPixelCoord(layer, x,y)
{
	if(x<0 || x>SCREEN_WIDTH)
		return 1;
	if(y>SCREEN_HEIGHT)
		return 0;
	return cellAtTileCoord(layer, p2t(x), p2t(y));
};

function cellAtTileCoord(layer, tx, ty)
{
	if(tx<0 || tx>=MAP.tw)
		return 1;
	if(ty<0 || ty>=MAP.th)
		return 0;
	return cells[layer][ty][tx];
};

function tileToPixel(tile)
{
	return tile * TILE;
};

function pixelToTile(pixel)
{
	return Math.floor(pixel/TILE);
};
function bound(value, min, max)
{
	if(value < min)
		return min;
	if(value > max)
		return max;
	return value;
}
var tileset = document.createElement("img");
tileset.src = "tileset.png";
function drawMap()
{
	for(var layeridx=0;layeridx<LAYER_COUNT;layeridx++)
	{
		var idx=0;
		for( var y = 0;y < level1.layers[layeridx].height; y++)
		{
			for( var x = 0;x < level1.layers[layeridx].width; x++)
			{
				if(level1.layers[layeridx].data[idx] != 0)
				{
					var tileindex = level1.layers[layeridx].data[idx] - 1;
					var sx = TILESET_PADDING + (tileindex % TILESET_COUNT_X)*(TILESET_TILE + TILESET_SPACING);
					var sy = TILESET_PADDING + (Math.floor(tileindex/TILESET_COUNT_Y))*(TILESET_TILE + TILESET_SPACING);
					context.drawImage(tileset,sx,sy, TILESET_TILE,TILESET_TILE,x*TILE,y*TILE, TILESET_TILE +1,TILESET_TILE+1);
				}
				idx++;
			}
		} 
	}
}
var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;
var player = new Player();
var keyboard = new Keyboard();
var enemy = new Enemy();
var bullets = [];
function playerShoot()
{
	var bullet = new Bullet()
	bullets.push(bullet);
}
var shootgunbullets = [];
function playerShootshootgun()
{
	var shootgunbullet = new Shootgunbullets()
	shootgunbullets.push(shootgunbullet);
}
var background = document.createElement("img");
background.src = "ChuckNorris.png";
function runSplash(deltaTime)
{
	if(keyboard.isKeyDown(keyboard.KEY_SPACE))
	{
		gameState = STATE_GAME;
		return;
	}
	context.drawImage(background,0,0 );

}
var viewoffset = new Vector2();
function runGame(deltaTime)
{
	if (keyboard.isKeyDown(keyboard.KEY_Z))
	{
		playerShoot();
	}
	
	context.save();
	if(player.position.x >= viewoffset.x + canvas.width/2)
	{
		viewoffset.x = player.position.x - canvas.width/2;
	}
	context.scale(0.5,0.5);
	context.translate(-viewoffset.x, 0);
	
	drawMap();
	player.update(deltaTime);
	player.draw();
	
	for(var i=0; i<bullets.length; i++)
	{
		bullets[i].update(deltaTime);
		bullets[i].draw();
	}

	for(var j=0; j<bullets.length; j++)
	{
		if(intersects(
		bullets[j].x, bullets[j].y,
		bullets[j].width, bullets[j].height,
		enemy.x, enemy.y,
		enemy.width, enemy.height) == true)
		{enemy.isdead = true}
	}
	
	enemy.draw();
	context.restore();
// update the frame counter
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}
// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
}

function runGameOver(deltaTime)
{
	
}


function run()
{
	context.fillStyle = "gray";
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

initialize();
//-------------------- Don't modify anything below here
// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
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