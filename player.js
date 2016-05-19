var LEFT = 0;
var RIGHT = 1;

var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_IDLE_RIGHT = 3;
var ANIM_JUMP_RIGHT = 4;
var ANIM_WALK_RIGHT = 5;
var ANIM_SHOOT_IDLE_RIGHT = 6;
var ANIM_SHOOT_IDLE_LEFT = 7;
var ANIM_SHOOT_RIGHT = 8;
var ANIM_SHOOT_LEFT = 9;
var ANIM_MAX = 10;
var Player = function() {	
	this.sprite = new Sprite("herospritesheet2.png");
	this.sprite.buildAnimation(10, 13, 64, 64, 0.15, // 0
			[20, 21, 22, 23, 24, 25, 26, 27]); 
	this.sprite.buildAnimation(10, 13, 64, 64, 0.1, // 1
			[60, 61, 62, 63, 64, 65, 66, 67, 68, 69]);
	this.sprite.buildAnimation(10, 13, 64, 64, 0.05, // 2
			[40, 41, 42, 43, 44, 45, 46]);
	this.sprite.buildAnimation(10, 13, 64, 64, 0.15, // 3
			[10, 11, 12, 13, 14, 15, 16, 17]);
	this.sprite.buildAnimation(10, 13, 64, 64, 0.05, // 4
			[50, 51, 52, 53, 54, 55, 56, 57, 58, 59]); 	
	this.sprite.buildAnimation(10, 13, 64, 64, 0.05, // 5
			[30, 31, 32, 33, 34, 35, 36, 37]);
	this.sprite.buildAnimation(10, 13, 64, 64, 0.05, // 6
			[70, 71, 72, 73, 74, 75, 76, 77]);
    this.sprite.buildAnimation(10, 13, 64, 64, 0.05, // 7
			[80, 81, 82, 83, 84, 85, 86, 87]);
	this.sprite.buildAnimation(10, 13, 64, 64, 0.05, // 8
			[100, 101, 102, 103, 104, 105, 106, 107]);
	this.sprite.buildAnimation(10, 13, 64, 64, 0.05,
			[90, 91, 92, 93, 94, 95, 96, 97]);    //9
	
	for(var i=0; i<ANIM_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, -25, -18);
	}
	this.position = new Vector2();
	this.position.set(2*TILE, 10*TILE );
	
	this.width = 64;
	this.height = 64;
	
	this.velocity = new Vector2();
	
	this.falling = true;
	this.jumping = false;
	this.shoot = false;
	
	this.direction = LEFT; 
	this.isDead = false;
	this.shootTimer = 0; 
	
};

Player.prototype.update = function(deltaTime)
{	
	this.sprite.update(deltaTime);
	var left = false;
	var right = false;
	var jump = false;
	
	//check keypress events
	if(keyboard.isKeyDown(keyboard.KEY_LEFT) == true) {
		left = true;
		this.direction = LEFT;
		if(this.sprite.currentAnimation != ANIM_WALK_LEFT &&
			this.jumping == false && this.shoot == false)
			this.sprite.setAnimation(ANIM_WALK_LEFT);
	}
	else if(keyboard.isKeyDown(keyboard.KEY_RIGHT) == true) {
		right = true;
		this.direction = RIGHT;
		if(this.sprite.currentAnimation != ANIM_WALK_RIGHT &&
			this.jumping == false && this.shoot == false)
			this.sprite.setAnimation(ANIM_WALK_RIGHT);
	}
	else {
		if(this.jumping == false && this.falling == false)
		{
			if(this.direction == LEFT)
			{
				if(this.sprite.currentAnimation != ANIM_IDLE_LEFT && this.shoot == false)
				this.sprite.setAnimation(ANIM_IDLE_LEFT);
			}
			else
			{
				if(this.sprite.currentAnimation != ANIM_IDLE_RIGHT && this.shoot == false)
				this.sprite.setAnimation(ANIM_IDLE_RIGHT);
			}
	}
}
	if(keyboard.isKeyDown(keyboard.KEY_UP) == true)
	{
		jump = true;
		if(left == true) {
			this.sprite.setAnimation(ANIM_JUMP_LEFT);
		}
	if(right == true) {
		this.sprite.setAnimation(ANIM_JUMP_RIGHT);
	}
	}
	
	
 if(this.cooldownTimer > 0)
{
this.cooldownTimer -= deltaTime;
}
if(keyboard.isKeyDown(keyboard.KEY_Z) == true && this.cooldownTimer <= 0) {
sfxFire.play();
this.cooldownTimer = 0.2;
// Shoot a bullet
}

 if(keyboard.isKeyDown(keyboard.KEY_Z) == true){
	 this.shoot = true;
	 sfxFire.play();
 }
 else if(keyboard.isKeyDown(keyboard.KEY_Z) == false){
	 this.shoot = false;
 }
	
	var wasleft = this.velocity.x < 0;
	var wasright = this.velocity.x > 0;
	var falling = this.falling;
	var ddx = 0;		//acceleration
	var ddy = GRAVITY;
	
	if(left)
		ddx = ddx - ACCEL; // player wants to go left
	else if (wasleft)
		ddx = ddx + FRICTION; //player was going left but not anymore
	
	if(right)
		ddx = ddx + ACCEL; // player wants to go right
	else if (wasright)
		ddx = ddx - FRICTION; //player was going right but not anymore
	
	if(jump && !this.jumping && !falling)
	{
		ddy = ddy - JUMP;                     // apple an instantaneous (large vertical impulse)
		this.jumping = true;
		if(this.direction == LEFT)
			this.sprite.setAnimation(ANIM_JUMP_LEFT)
		else
			this.sprite.setAnimation(ANIM_JUMP_RIGHT)
	}
		// calculate the new position and velocity:
	this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
	this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX, MAXDX);
	this.velocity.y = bound(this.velocity.y + (deltaTime * ddy), -MAXDY, MAXDY);
	
	if((wasleft && (this.velocity.x > 0)) ||
	   (wasright && (this.velocity.x < 0)))
	   {
		   // clamp at zero to prevent friction from making us jiggle side to side
		   this.velocity.x = 0;
	   }
	
	
	if(this.direction == LEFT && wasleft && this.shoot && this.sprite.currentAnimation != ANIM_SHOOT_LEFT){
		 this.sprite.setAnimation(ANIM_SHOOT_LEFT);
	 }
	 if(this.direction == RIGHT && wasright && this.shoot && this.sprite.currentAnimation != ANIM_SHOOT_RIGHT){
		 this.sprite.setAnimation(ANIM_SHOOT_RIGHT);
	 }
	 
	if(this.direction == LEFT && !wasleft && this.shoot && this.sprite.currentAnimation != ANIM_SHOOT_IDLE_LEFT){
		 this.sprite.setAnimation(ANIM_SHOOT_IDLE_LEFT);
	 }
	 if(this.direction == RIGHT && !wasright && this.shoot && this.sprite.currentAnimation != ANIM_SHOOT_IDLE_RIGHT){
		 this.sprite.setAnimation(ANIM_SHOOT_IDLE_RIGHT);
	 }
	
	// collision detection
	// Our collision detection logic is greatly simplified by the fact that the player is a rectangle
	// and is exactly the same size as a single tile. So we know that the player can only ever occupy 1,2 or 4 cells.
	
	//this means we can short-circuity and avoid building a general purpose collision detection
	// engine by simply looking at the 1 to 4 cells that the player occupies:
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	var nx = (this.position.x)%TILE; // true if player overlaps right
	var ny = (this.position.y)%TILE; // true if player overlaps below
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var celldiag = cellAtTileCoord(LAYER_PLATFORMS,tx + 1, ty + 1);
	

	if (barrier(LAYER_RAVA, tx, ty -1))
	{
		this.isDead = true;
	}
	
	// If the player has vetical velocity, then check to see if they have hit a platform
	// below or above, in which case, stop their vertical velocity, and clamp their y position.
	if(this.velocity.y > 0) {
		if((celldown && !cell) || (celldiag && !cellright && nx)) {
			//clamp the y position to avoid falling into platform below
		this.position.y = tileToPixel(ty);
		this.velocity.y = 0; // stop downward velocity
		this.falling = false; // no longer falling
		this.jumping = false; // (or jumping)
		ny = 0; // no longer overlaps the cells below
		}
	}
	else if(this.velocity.y < 0) {
		if((cell && !celldown) || (cellright && !celldiag && nx)) {
			// clamp the y position to avoid jumping into platform above
			this.position.y = tileToPixel(ty + 1);
			this.velocity.y = 0; // stop upward velocity
			// player is no longer really in that cell, we clamped them to the cell below
			cell = celldown;
			cellright= celldiag; // (ditto)
			ny = 0;         // player no longer overlaps the cells below
		}
	}
	if(this.velocity.x > 0) {
		if((cellright && !cell) || (celldiag && !celldown && ny)) {
			// clamp the x position to avoid moving into the platform we just hit
			this.position.x = tileToPixel(tx);
			this.velocity.x = 0; // stop horizontal velocity
		}
	}
	else if(this.velocity.x < 0) {
		if((cell && !cellright) || (celldown && !celldiag && ny)) {
			// clamp the x position to avoid moving into the platform we just hit
			this.position.x = tileToPixel(tx + 1);
			this.velocity.x = 0; // stop horizontal velocity
		}
	}
}

Player.prototype.draw = function()
{
	this.sprite.draw(context,
		this.position.x - worldOffsetX, 
	this.position.y);
};