var Player = function() {	
	this.image = document.createElement("img");
	this.position = new Vector2(canvas.width/2, 
								canvas.height/2);
	this.width = 159;
	this.height = 163;	
	this.rotation = 0;
	this.image.src = "hero.png";   
};

Player.prototype.update = function(deltaTime)
{		
			// hang on, where did this variable come from!
	
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true)
	{
		this.rotation -= deltaTime;
	}
	else
	{
		this.rotation += deltaTime;
	}
}

Player.prototype.draw = function()
{
	DrawImage(context, this.image, this.position.x,
	this.position.y, this.rotation);
};