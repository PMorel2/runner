var Player = function(assetManager, lives, bestScore){
	var self = this;
	Character.call(this);
	
	//////// On récupère les entrées du joueur
	
	
	$(document).keydown(function(e){
		self.onKeyDown(e);
	});
	
	
	
	//////// Paramètres
	
	this.gameTime = 0;
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
	this.lives = lives;
	this.bestScore = bestScore;
	
	//////// Sprites du joueur
	
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
	
	//////// Timing des actions du Joueur
	this.color = "blue";
	this.isJumping = false;
	this.JumpUpTime = 1300;
	this.JumpStartTime = 0;
	
	this.isCrouching = false;
	this.CrouchTime = 1700;
	this.crouchStartTime = 0;
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



Player.prototype.onKeyDown = function(k){

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


//////// Gestion de la couleur

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

//////// Gestion du saut

Player.prototype.Jump = function(moveDirection, deltaTime){
	if(moveDirection == "up" && this.y > 310)
		this.y -= 160 * deltaTime;
	else if (moveDirection == "down" && this.y < this.baseY)
		this.y += 160 * deltaTime;
};

//////// Géré la position en Y du joueur selon son état

Player.prototype.setCrouchY = function(crouched){
	if(crouched)
		this.y += 50;
	else
		this.y -= 50;
}

Player.prototype.decreaseLives = function()
{
	this.lives--;

	var dataToSend = {action:'updateLives', data:this.lives};
	$.ajax({
	  url: 'api.php',
	  method: 'POST',
	  data: dataToSend,
	  success: function (data) {
		console.log("SUCCESS");
		console.log(data);
		},
	  error : function(err){
		console.log("ERROR");
	  }
	});
}

Player.prototype.checkBestScore = function()
{
	if(this.score > this.bestScore)
	{
		this.bestScore = this.score;
		var dataToSend = {action:'updateBestScore', data:this.bestScore};
		$.ajax({
		  url: 'api.php',
		  method: 'POST',
		  data: dataToSend,
		  success: function (data) {
			console.log("SUCCESS");
			console.log(data);
		  },
		  error : function(err){
			console.log("ERROR");
		  }
		});
	}
}