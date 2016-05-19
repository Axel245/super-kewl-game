// Cat sprite taken and edited from opengameart.org/content/cat-fighter-sprite-sheet AUTHOR - dogchicken
// Music - Divine Beast Cave - Dark Cloud


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

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;
var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;
var gameState = STATE_SPLASH;
var splashTimer = 3;
var background = document.createElement("img");
background.src = "menu.png";
function runSplash(deltaTime)
{
	if(keyboard.isKeyDown(keyboard.KEY_SPACE))
	{
		gameState = STATE_GAME;
		return;
	}
	context.drawImage(background, 0, 0);
}

function runGameOver(deltaTime)
{
	context.drawImage(endgame, 0, 0);
	
	if(keyboard.isKeyDown(keyboard.KEY_ENTER))
	{
		gameState = STATE_SPLASH;
			isdied = 4;
		return;
		
	}

}

// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

var score = 0;
var lives = 4;



var keyboard = new Keyboard();
var LAYER_COUNT = TileMaps["lervel1"].layers.length;
// number of layers in map
var MAP = {tw: TileMaps["lervel1"].width, th: TileMaps["lervel1"].height};
// how big level is e,g width x height
var TILE = TileMaps["lervel1"].tilewidth;
/// the width/height of a tile(in pixels) (map grid tiles not tilemap tiles)
var TILESET_TILE = TileMaps["lervel1"].tilesets[0].tilewidth;
// the width/height of a tile in the tileset.
var TILESET_PADDING = TileMaps["lervel1"].tilesets[0].margin;
//how many pixels are between the image border and the tile images in the tilemap
var TILESET_SPACING = TileMaps["lervel1"].tilesets[0].spacing;
// How many pixels are between tile images in the tilemap
var TILESET_COUNT_X = TileMaps["lervel1"].tilesets[0].columns;
//how many columns of tile images are in the tileset
var TILESET_COUNT_Y = TileMaps["lervel1"].tilesets[0].tilecount
							/ TILESET_COUNT_X;
							

var tileset = document.createElement("img");
tileset.src = TileMaps["lervel1"].tilesets[0].image;
// how many rows of tile images are in the tileset

var LAYER_RAVA = 0;
var LAYER_PLATFORMS = 1;
var LAYER_LADDERS = 3;
var LAYER_OBJECT_ENEMIES = 2;
var LAYER_OBJECT_TRIGGERS = 4;

//abitrary choice for 1m
var METER = TILE;

// very exaggerated gravity(6x)
var GRAVITY = METER * 9.8 * 6;

// max horizontal speed(10t/ps)
var MAXDX = METER * 10;

//max vertical speed(15t/s)
var MAXDY = METER * 15;

// horizontal acceleration - take 1/2 second to reach maxdx
var ACCEL = MAXDX * 2;

// horizontal friction - take 1/6 second to stop from maxdx
var FRICTION = MAXDX  * 6;

//(a large)instantaneous jump impulse
var JUMP = METER * 1500;

//load the image to use for the level tiles
var tileset = document.createElement("img");
tileset.src = "tileset.png";
var carve = document.createElement("img");
carve.src = "cavebackground.png";
var endgame = document.createElement("img");
endgame.src = "ENDGAME.png";
var healthImage = document.createElement("img");
healthImage.src = "health100.png";
var healthImage75 = document.createElement("img");
healthImage75.src = "health75.png";
var healthImage50 = document.createElement("img");
healthImage50.src = "health50.png";
var healthImage25 = document.createElement("img");
healthImage25.src = "health25.png";

var scoreBoard = document.createElement("img");
scoreBoard.src = "scoreboard.png"
var cells = [];

var isdied = 4;

var ENEMY_MAXDX = METER * 5;
var ENEMY_ACCEL = ENEMY_MAXDX * 2;

var enemies = [];
var bullets = [];

var LAYER_COUNT

// load an image to draw
var chuckNorris = document.createElement("img");
chuckNorris.src = "hero.png";

function cellAtPixelCoord(layer, x,y)
{
	if(x<0 || x> SCREEN_WIDTH)
		return 1;
	// let the player drop of the bottom of the screen (this means death)
	if(y>SCREEN_HEIGHT)
		return 0;
	return cellAtTileCoord(layer, p2t(x), p2t(y));
};

function cellAtTileCoord(layer, tx, ty)
{
	if(tx <	0 || tx >= MAP.tw)
		return 1;
	// let the playher drop of the bottom of the screen (this means death)
	if(ty>=MAP.th)
		return 0;
	return cells[layer][ty][tx];
};

function tileToPixel(tile)
{
	return tile * TILE;
};

function pixelToTile(pixel)
{
	return Math.floor(pixel/TILE)
}

function bound(value, min, max)
{
	if(value < min)
		return min;
	if(value > max)
		return max;
	return value;
}

function cellAtPixelCoord(layer, x,y)
{
	if(x < 0 || x > SCREEN_WIDTH) // remove '|| y < 0'
				return 1;
	// let the player drop of the bottom of the screen (this means death)
	if(y> SCREEN_HEIGHT)
		return 0;
	return cellAtTileCoord(layer, p2t(x), p2t(y));
};

function barrier(layer, tx, ty){
	if(tx<0 || tx >= MAP.tw)
		return 0;
	// let the player drop of the bottom of the screen (this means death)
	if(ty>=MAP.th)
		return 0;
	return cells[layer][ty][tx];
};

function cellAtTileCoord(layer, tx, ty) // remove '|| y<0'
{
	if(tx<0 || tx >= MAP.tw)
		return 1;
	// let the player drop of the bottom of the screen (this means death)
	if(ty>=MAP.th)
		return 0;
	return cells[layer][ty][tx];
};


var worldOffsetX = 0;
function drawMap()
{
	var startX = -1;
	var maxTiles = Math.floor(SCREEN_WIDTH / TILE) + 2;
	var tileX = pixelToTile(player.position.x);
	var offsetX = TILE + Math.floor(player.position.x%TILE);
	
	startX = tileX - Math.floor(maxTiles / 2);
	
	if(startX < -1)
	{
		startX = 0;
		offsetX = 0;
	}
	if(startX > MAP.tw - maxTiles)
	{
		startX = MAP.tw - maxTiles + 1;
		offsetX = TILE;
	}
	
	worldOffsetX = startX * TILE + offsetX;
	
	for(var layerIdx = 0; layerIdx < LAYER_COUNT;layerIdx++)
	{
		if(TileMaps["lervel1"].layers[layerIdx].visible == false) continue;
		for(var y=0;y < TileMaps["lervel1"].layers[layerIdx].height; y++)
		{
			var idx = y * TileMaps["lervel1"].layers[layerIdx].width + startX;
			for(var x = startX; x < startX + maxTiles; x++)
			{
				if(TileMaps["lervel1"].layers[layerIdx].data[idx]!=0)
				{
					// the tiles in the tiled map are base 1 ( meaning a value of 0 means no tile), so subtract one from the tileset id to get the correct fileCreatedDate
					var tileIndex = TileMaps["lervel1"].layers[layerIdx].data[idx]-1;
					var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * 
							(TILESET_TILE + TILESET_SPACING);
					var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) * 
							(TILESET_TILE + TILESET_SPACING);
					context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE,
							(x-startX)*TILE - offsetX, (y-1)*TILE, TILESET_TILE+1, TILESET_TILE+1);
				}
				idx++;
			}
		}	
	}
}

var musicBackground;
var sfxFire;

function initialize(){
	
	for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++) {
		cells[layerIdx] = [];
		var idx = 0;
		for(var y = 0; y < TileMaps["lervel1"].layers[layerIdx].height; y++) {
			cells[layerIdx][y] = [];
			for(var x = 0; x < TileMaps["lervel1"].layers[layerIdx].width; x++) {
				if(TileMaps["lervel1"].layers[layerIdx].data[idx] != 0) {
					// for each tile we find in the layer data, we need to create 4 collisions
					// (because our collision squares are 35x35 but the tiles in the level are 70x70
				    cells[layerIdx][y][x] = 1;
					cells[layerIdx][y-1][x] = 1;
					cells[layerIdx][y-1][x+1] = 1;
					cells[layerIdx][y][x+1] = 1;
				}
				else if(cells[layerIdx][y][x] != 1) {
					// if we haven't set this cell's value, then set it to 0 now
					cells[layerIdx][y][x] = 0;
				}
				idx++;
			}
		}
	}
	// add enemies
	idx = 0;
	for(var y = 0; y < TileMaps["lervel1"].layers[LAYER_OBJECT_ENEMIES].height; y++) {
		for(var x = 0; x < TileMaps["lervel1"].layers[LAYER_OBJECT_ENEMIES].width; x++) {
			if(TileMaps["lervel1"].layers[LAYER_OBJECT_ENEMIES].data[idx] != 0) {
			var px = tileToPixel(x);
			var py = tileToPixel(y);
			var e = new Enemy(px, py);
			enemies.push(e);
			}
			idx++;
		}
	}
	musicBackground = new Howl(
	{
		urls: ["background.mp3"],
		loop: true,
		buffer: true,
		volume: 0.3
	});
	musicBackground.play();
	
	sfxFire = new Howl(
		{
			urls: ["fireEffect.ogg"],
			buffer: true,
			volume: 0.4,
			onend: function() {
					isSfxPlaying = false;
			}
		});
}

var player = new Player();

var viewoffset = new Vector2();
function runGame(deltaTime)
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(carve, 0, 0);
	context.save();
	context.scale(1, 1);

	drawMap();
		if(player.position.x >= viewoffset.x + canvas.width/2)
	{
		viewoffset.x = player.position.x - canvas.width/2;
	}
	
	player.update(deltaTime);
	player.draw();
	for(var i=0; i<bullets.length; i++)
	{
		bullets[i].draw();
	}
	context.restore();
	if (player.isDead == true)
	{
		isdied -= 1;
		if(isdied == 0)
		{
		gameState = STATE_GAMEOVER	
		}
		player.isDead = false;
		player = new Player
		
	}
	if(isdied == 4)
	{
		context.drawImage(healthImage, 15, 620);
	}
	else if (isdied == 3)
	{
		context.drawImage(healthImage75, 15, 620);
	}
	else if (isdied == 2)
	{
		context.drawImage(healthImage50, 15, 620);
	}
	else if (isdied == 1)
	{
		context.drawImage(healthImage25, 15, 620);
	}
	
	for(var i=0; i < enemies.length; i++)
	{
		enemies[i].update(deltaTime);
	}
	
	context.drawImage(scoreBoard, 800, 620);
	
	for(var i=0; i<enemies.length; i++)
	{
		enemies[i].update(deltaTime);
		enemies[i].draw();
	}
	
	
	/////////////////////

			// bullets
	var hit = false;
	for(var i=0; i<bullets.length; i++)
	{
		bullets[i].update(deltaTime);
		if(bullets[i].position.x - worldOffsetX < 0 ||
			bullets[i].position.x - worldOffsetX > SCREEN_WIDTH)
			{
				hit = true;
			}
			
		for(var j=0; j<enemies.length; j++)
		{
			if(intersects( bullets[i].position.x, bullets[i].position.y, TILE, TILE,
				enemies[j].position.x, enemies[j].position.y, TILE, TILE) == true)
				{
					// kill both the bullet and the enemy
					enemies.splice(j , 1);
					hit = true;
					// increment the player score
					score += 100;
					break;
				}
		}
		if(hit == true)
		{
			bullets.splice(i, 1);
			break;
		}	
	}
	
	
	
	if(player.shootTimer > 0)
    player.shootTimer -= deltaTime;
	
	if(player.shoot == true && player.isDead == false && player.shootTimer <= 0)
	{	
	if(player.direction == RIGHT){
	var e = new Bullet(player.position.x + 100, player.position.y - 14, player.direction == RIGHT);
		player.shootTimer += 0.2;
		bullets.push(e);
	}
	else if(player.direction == LEFT){
	var e = new Bullet(player.position.x - 60, player.position.y - 14, player.direction == RIGHT); 
		player.shootTimer += 0.2;
		bullets.push(e);
}
}
	
	
	//score
	context.fillStyle = "white";
	context.font = "32px Arial";
	var scoreText = "Score: " + score;
	context.fillText(scoreText, SCREEN_WIDTH - 170, 665);
	
	
	//loives
	//if(lives == 4)
	//{
//		context.drawImage(healthImage, 15, 620)
	//}
	
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

function run()
{
	context.fillStyle = "#ccc";
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
