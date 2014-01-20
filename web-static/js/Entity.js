var Entity = function (assetManager){

	Character.call(this);
	
	this.assetManager = assetManager;
	this.x = 400;
	this.y = 100;
	this.width = 25;
	this.height = 40;
	this.active = false;
	this.dmg = 1;
	this.type = 0;
	this.scoreValue = 10;
	this.speed = 100;
	this.scoreGiven = false;
	this.collisionDone = false;
};

Entity.speed = 100;

Entity.prototype = new Character();

Entity.prototype.init = function(x, color, type, speed){
	this.x = x;
	this.color = color;
	this.active = true;
	this.speed = speed;
	
	//////// Selon le type d'entity, on charge les sprites et on règle la position en Y
	//////// Les bonus font partie du type "entity"
		
	switch(type){
		case 1 :
			this.createSprite("impossibear-idle", this.assetManager.getImage("Impossibear"), 120, 144, 1, 1, true);
			this.createSprite("explosion", this.assetManager.getImage("Explosion"), 500, 500, 5, 5, false);
	
			this.setSprite("impossibear-idle");
			
			this.currentSprite.setCenter(20, 100);
			
			this.y = 500;
			this.width = 40;
			this.height = 70;
			this.type = 1;
		break;
		
		case 2 :
			this.createSprite("Catbug", this.assetManager.getImage("catbug"), 200, 100, 2, 1, true);
			this.createSprite("explosion", this.assetManager.getImage("Explosion"), 500, 500, 5, 5, false);
	
			this.setSprite("Catbug");
			
			this.currentSprite.setCenter(50, 50);
			
			this.y = 430;
			this.width = 70;
			this.height = 80;
			this.type = 2;
		break;
			
		case 3 :
		
			if (this.color == "blue")
			{
				this.createSprite("blueBonus", this.assetManager.getImage("Bonus"), 80, 93, 1, 1, true);
				this.createSprite("eclat", this.assetManager.getImage("eaten"), 80, 93, 1, 1, false);
				this.createSprite("wrong", this.assetManager.getImage("blueWrong"), 100, 100, 1, 1, false);
				this.setSprite("blueBonus");
				this.currentSprite.setCenter(40, 46);
			}
			else
			{
				this.createSprite("redBonuscookie", this.assetManager.getImage("Bonus-red"), 80, 93, 1, 1, true);
				this.createSprite("eclat", this.assetManager.getImage("eaten-red"), 80, 93, 1, 1, false);
				this.createSprite("wrong", this.assetManager.getImage("redWrong"), 100, 100, 1, 1, false);
				this.setSprite("redBonuscookie");
				this.currentSprite.setCenter(40, 46);
			}
		
			this.y = 330;
			this.width = 80;
			this.height = 80;
			this.type = 3;
			this.scoreValue = 10;
		break;

		case 4 :
		
			if (this.color == "blue")
			{
				this.createSprite("blueBonus", this.assetManager.getImage("Bonus"), 80, 93, 1, 1, true);
				this.createSprite("eclat", this.assetManager.getImage("eaten"), 80, 93, 1, 1, false);
				this.createSprite("wrong", this.assetManager.getImage("blueWrong"), 100, 100, 1, 1, false);
				this.setSprite("blueBonus");
				this.currentSprite.setCenter(40, 46);
			}
			else
			{
				this.createSprite("redBonuscookie", this.assetManager.getImage("Bonus-red"), 80, 93, 1, 1, true);
				this.createSprite("eclat", this.assetManager.getImage("eaten-red"), 80, 93, 1, 1, false);
				this.createSprite("wrong", this.assetManager.getImage("redWrong"), 100, 100, 1, 1, false);
				this.setSprite("redBonuscookie");
				this.currentSprite.setCenter(40, 46);
			}
		
			this.y = 500;
			this.width = 80;
			this.height = 80;
			this.type = 3;
			this.scoreValue = 10;
		break;
	}
}

Entity.prototype.Update = function(deltaTime, gameTime)
{
	this.move(deltaTime);
	
	this.x -= this.speed * deltaTime;
	
	if(this.x + this.width < 0)
		this.active = false;
};

Entity.prototype.move = function(deltaTime)
{
	this.x -= this.speed * deltaTime;
};