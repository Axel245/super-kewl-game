var Enemy = function()
{
	this.image = document.createElement("img");
	this.position = new Vector2(canvas.width/2, canvas.height/2);
	this.width = 0;
	this.height = 0;
	this.velocity = new Vector2();
	var speed = 32;
	while(this.velocity.magnitude() == 0)
	{
		this.velocity.set(rand(-10, 10), rand(-10, 10));
	}
	this.image.src = "enemy.png";
}
Enemy.prototype.update = function(deltaTime)
{
	var posChange = this.velocity.copy();
	posChange.multiplyScalar(deltaTime);
	this.position.add(posChange);
};
Enemy.prototype.draw = function()
{
	DrawImage(context, this.image, this.position.x,
	this.position.y, 0);
};
this.copy = function()
{
	return new Vector2(this.x, this.y);
};