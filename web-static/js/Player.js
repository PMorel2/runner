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
	this.width = 80;
	this.height = 80;
	this.health = 5;
	this.centerX = 50;
	this.centerY = 50;
	this.frameRate = 5;
	this.score = 0;
	this.combo = 0;
	this.enterPressed = false;
	
		////Images du joueur
	this.createSprite("Run", assetManager.getImage("JellykidRuns"), 200, 100, 2, 1, true);
	this.createSprite("Jump1", assetManager.getImage("JellykidJump1"), 100, 100, 1, 1, true);
	this.createSprite("Jump2", assetManager.getImage("JellykidJump2"), 100, 100, 1, 1, true);
	this.createSprite("Run-red", assetManager.getImage("JellykidRuns-red"), 200, 100, 2, 1, true);
	this.createSprite("Jump1-red", assetManager.getImage("JellykidJump1-red"), 100, 100, 1, 1, true);
	this.createSprite("Jump2-red", assetManager.getImage("JellykidJump2-red"), 100, 100, 1, 1, true);
	this.createSprite("JellyKid-Crouch", assetManager.getImage("JellyKid-Crouching"), 100, 100, 1, 1, true);
	this.createSprite("JellyKid-Crouch-red", assetManager.getImage("JellyKid-Crouching-red"), 100, 100, 1, 1, true);
	
	this.setSprite("Run");
	
	this.currentSprite.setFrameRate(this.frameRate);
	
	for(var i in this.spriteList){
		if(this.spriteList[i].id == "JellyKid-Crouch")
			this.spriteList[i].setCenter(25, 50);
		else if (this.spriteList[i].id == "JellyKid-Crouch-red")
			this.spriteList[i].setCenter(25, 50);
		else
			this.spriteList[i].setCenter(this.centerX, this.centerY);
	}
	
	this.spriteList["JellyKid-Crouch"].setCenter(25, 50);
	
		////Actions du Joueur
	this.color = "blue";
	this.isJumping = false;
	this.JumpUpTime = 1300;
	this.JumpStartTime = 0;
	
	this.isCrouching = false;
	this.CrouchTime = 1700;
	this.crouchStartTime = 0;
	
	this.keylist = {};

}

Player.prototype = new Character();
Player.prototype.init = function(){
};

Player.prototype.Update = function(deltaTime, gameTime, speed){
	this.gameTime = gameTime;
	this.frameRate = speed / 10;
	this.currentSprite.setFrameRate(this.frameRate);
	
	if(this.isJumping)
	{
		if(gameTime - this.JumpStartTime < this.JumpUpTime)
		{
			this.Jump("up", deltaTime);
			if(this.currentSprite != "Jump1" && this.color == "blue")
				this.setSprite("Jump1");
			else
				this.setSprite("Jump1-red");
		}
		else if (gameTime - this.JumpStartTime < this.JumpUpTime * 2)
		{
			this.Jump("down", deltaTime);
			if(this.currentSprite != "Jump2" && this.color == "blue")
				this.setSprite("Jump2");
			else
				this.setSprite("Jump2-red");
		}
		else
		{
			this.isJumping = false;
			if(this.y != this.baseY)
				this.y = this.baseY;
				
			if (this.color == "blue")
				this.setSprite("Run");
			else
				this.setSprite("Run-red");
		}
	}
	
	if(this.isCrouching)
	{
		if(gameTime - this.crouchStartTime < this.CrouchTime)
		{
			if(this.color == "blue"){
				this.setSprite("JellyKid-Crouch");
				}
			else
				this.setSprite("JellyKid-Crouch-red");
		}
		else
		{
			this.isCrouching = false;
			this.setCrouchY(false);
			
			if (this.color == "blue")
				this.setSprite("Run");
			else
				this.setSprite("Run-red");
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
	
	if((k.which == 122 || k.which == 90) && !this.isJumping && !this.isCrouching)
	{
		this.isJumping = true;
		this.JumpStartTime = this.gameTime;
	}
	
	if((k.which == 115 || k.which == 83) && !this.isCrouching && !this.isJumping)
	{
		this.setCrouchY(true);
		this.isCrouching = true;
		this.crouchStartTime = this.gameTime;
	}
	
	if(k.which == 13)
	{
		this.enterPressed = true;
	}
	
};


Player.prototype.onKeyUp = function(k){
	//this.keyList[k] = false;
};

Player.prototype.changeColor = function(){
	
	if(this.color == "blue")
	{
		this.color = "red";
		this.setSprite("Run-red");
	}
	else
	{
		this.color = "blue";
		this.setSprite("Run");
	}
}

Player.prototype.Jump = function(moveDirection, deltaTime){
	if(moveDirection == "up" && this.y > 310)
		this.y -= 160 * deltaTime;
	else if (moveDirection == "down" && this.y < this.baseY)
		this.y += 160 * deltaTime;
};

Player.prototype.setCrouchY = function(crouched){
	if(crouched)
		this.y += 50;
	else
		this.y -= 50;
}



