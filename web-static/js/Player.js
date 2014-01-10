var Player = function(assetManager){
	var self = this;
	Character.call(this);
	
	$(document).keyup(function(e){
		console.log("up" + e.which);
		self.onKeyUp(e);
	});
	
	$(document).keydown(function(e){
		console.log("keydown" + e.which);
		self.onKeyDown(e);
	});
	
	this.gameTime = 0;
	
		////Paramètres
	this.x = 50;
	this.y = 500;
	this.baseY = 500;
	this.width = 70;
	this.height = 90;
	this.health = 5;
	this.centerX = 50; ////A regler > modifier le draw()
	this.centerY = 50;
	
		////Images du joueur
	this.createSprite("Run", assetManager.getImage("JellykidRuns"), 200, 100, 2, 1, true);
	
	this.setSprite("Run");
	
	this.currentSprite.setFrameRate(3);
	
	for(var i in this.spriteList){
		this.spriteList[i].setCenter(this.centerX, this.centerY);
	}
	
		////Actions du Joueur
	this.color = "black";
	this.isJumping = false;
	this.JumpUpTime = 1200;
	this.JumpStartTime = 0;
	
	this.keylist = {};

}

Player.prototype = new Character();
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
		this.y -= 140 * deltaTime;
	else if (moveDirection == "down")
		this.y += 140 * deltaTime;
};





