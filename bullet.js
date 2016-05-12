//bullet.js

var Bullet = function(x, y, moveRight)
{
	this.sprite = new Sprite("bullet.png");
	this.sprite.buildAnimation(1, 1, 32, 32, -1, [0]);
	this.sprite.setAnimationOffset(0, 0, 0);
	this.sprite.setLoop(0, false);
};

Bullet.prototype.update = function(deltaTime)
{
	var posChange = this.velocity.copy();
	posChange.multiplyScalar(deltaTime);
	this.position.add(posChange);
};

Bullet.prototype.draw = function()
{
	DrawImage(context, this.image, this.position.x,
				this.position.y, this.rotation);
};