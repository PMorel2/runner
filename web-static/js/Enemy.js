var Enemy = function (assetManager){

	Character.call(this);
	
	this.assetManager = assetManager;
	this.x = 400;
	this.y = 100;
	this.width = 25;
	this.height = 40;
	this.active = true;
	this.dmg = 1;
	this.speed = 80;
	this.color = "black";
}

Enemy.prototype = new Character();

Enemy.prototype.init = function(x, color, type){
	this.x = x;
	this.color = color;
	this.active = true;
	
	switch(type){
		case 1 :
			this.createSprite("impossibear-idle", this.assetManager.getImage("Impossibear"), 120, 144, 1, 1, true);
	
			this.setSprite("impossibear-idle");
			
			this.currentSprite.setCenter(20, 100);
			
			this.y = 500;
			this.width = 40;
			this.height = 70;
		break;
		
		case 2 :
			this.createSprite("Catbug", this.assetManager.getImage("catbug"), 200, 100, 2, 1, true);
	
			this.setSprite("Catbug");
			
			this.currentSprite.setCenter(50, 50);
			
			this.y = 400;
			this.width = 80;
			this.height = 80;
			
	}
}

Enemy.prototype.Update = function(deltaTime)
{
	this.move(deltaTime);
	
	if(this.x + this.width/2 < 0)
		this.active = false;
};

Enemy.prototype.move = function(deltaTime)
{
	this.x -= this.speed * deltaTime;
};