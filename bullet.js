//bullet.js

var Bullet = function()
{
	this.image = document.createElement("img");
	this.position = new Vector2();
	this.position.add(player.position);
	this.velocity = new Vector2(1, 0);
	this.width = 0;
	this.height = 0;
	var speed = 256;
	this.rotation = player.rotation;
	
	this.velocity.rotateDirection(this.rotation);
	this.velocity.multiplyScalar(speed);
	
	this.image.src = "hero.png";
};