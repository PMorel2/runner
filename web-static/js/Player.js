var Player = function(){
	self = this;
	
	this.gameTime = 0;
	
		////Paramètres
	this.x = 50;
	this.y = 400;
	this.baseY = 400;
	this.width = 20;
	this.height = 30;
	this.health = 5;
	
		////Actions du Joueur
	this.color = "black";
	this.isJumping = false;
	this.JumpUpTime = 1000;
	this.JumpStartTime = 0;

	
	$(document).keyup(function(e){
		console.log(e.which);
		self.onKeyUp(e);
	});
	$(document).keydown(function(e){
		console.log(e.which);
		self.onKeyDown(e);
	});
	
	this.keylist = {};

}

Player.prototype.init = function(){
};

Player.prototype.Update = function(deltaTime, gameTime){

	this.gameTime = gameTime;

	if(this.isJumping)
	{
		if(gameTime - this.JumpStartTime < this.JumpUpTime)
		{
			this.Jump("up", deltaTime);
		}
		else if (gameTime - this.JumpStartTime < this.JumpUpTime * 2)
		{
			this.Jump("down", deltaTime);
		}
		else
		{
			this.isJumping = false;
			if(this.y != this.baseY)
				this.y = this.baseY;
		}
	}
};

Player.prototype.move = function()
{
	this.x += 10;
}

Player.prototype.onKeyDown = function(k){

	console.log("touche : " + k.which);
	
	if(k.which == 113 || k.which == 81)
	{
		this.changeColor();
	}
	
	if((k.which == 122 || k.which == 90) && !this.isJumping)
	{
		this.isJumping = true;
		this.JumpStartTime = this.gameTime;
	}
	
	
};


Player.prototype.onKeyUp = function(k){
	//this.keyList[k] = false;
};

Player.prototype.changeColor = function(){
	
	if(this.color == "blue")
	{
		this.color = "red";
	}
	else
	{
		this.color = "blue";
	}
}

Player.prototype.Jump = function(moveDirection, deltaTime){
	if(moveDirection == "up")
		this.y -= 100 * deltaTime;
	else if (moveDirection == "down")
		this.y += 100 * deltaTime;
};

Player.prototype.Draw = function(g){
	
	g.fillStyle = this.color;
	g.fillRect(this.x, this.y, this.width, this.height)
	
};









