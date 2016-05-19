var enemywalkright = 0;
var enemywalkleft = 1;
var Enemy = function(x, y) 
{	
	this.sprite = new Sprite("enemyspritesheet.png");
	this.sprite.buildAnimation(10, 13, 64, 64, 0.15,
				[10, 11, 12, 13, 14, 15, 16, 17]);
		this.sprite.setAnimationOffset(0, 0, -18);
	this.sprite.buildAnimation(10, 13, 64, 64, 0.15,
				[20, 21, 22, 23, 24, 25, 26, 27]);

	this.sprite.setAnimationOffset(1, 0, -18);
	
	this.offset = new Vector2();
	this.offset.set(0, 0);
	
	this.position = new Vector2();
	this.position.set(x, y);
	
	this.velocity = new Vector2();
	
	this.moveRight = true;
	this.pause = 0;
	
};

Enemy.prototype.update = function(deltaTime)
{	
	this.sprite.update(deltaTime);
	
	if(this.pause > 0)
	{
		this.pause -= deltaTime;
	}
	else
	{
		var ddx = 0;     	//acceleration
	
		var tx = pixelToTile(this.position.x);
		var ty = pixelToTile(this.position.y);
		var nx = (this.position.x)%TILE; 	// true if enemy overlaps right
		var ny = (this.position.y)%TILE;	// true if enemy overlaps below
		var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
		var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
		var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
		var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx +1, ty + 1);
	
		if(this.moveRight)
		{
			if(celldiag && !cellright) {
			ddx = ddx + ENEMY_ACCEL; // enemy wants to go right
			}
			
		else {
			this.velocity.x = 0;
			this.moveRight = false;
			this.pause = 0.5;
			this.sprite.setAnimation(enemywalkleft);
		}
	}
	
	if(!this.moveRight)
	{ 
		if(celldown && !cell) {
				ddx = ddx - ENEMY_ACCEL; // enemy wants to go left
		}
		else{
			this.velocity.x = 0;
			this.moveRight = true;
			this.pause = 0.5;
			this.sprite.setAnimation(enemywalkright);
		
		}
	}
	
	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
	this.velocity.x = bound(this.velocity.x + (deltaTime * ddx),
								-ENEMY_MAXDX, ENEMY_MAXDX);
	
	}
}

Enemy.prototype.draw = function()
{
	this.sprite.draw(context,
		this.position.x - worldOffsetX, 
	this.position.y);
};