var EnemyManager = function(assetManager){
	self = this;
	
	this.speed = 80;
	
	this.assetManager = assetManager;
	
	this.patternCount = 0;
	
	p1 = [2, 2, 2, 1, 1, 1];
};

EnemyManager.prototype.AddPattern = function(enemyList, patternIndex){
	switch(patternIndex)
	{
		case 1 : 
			this.AddEnnemies(enemyList, p1);
			break;
	}
};

EnemyManager.prototype.Update = function(deltaTime){

	if (this.speed < 90)
		this.speed += 0.2 * deltaTime;
	else
		this.speed = 90;
};

EnemyManager.prototype.AddEnnemies = function(enemyList, pattern){
	for (var i = 0; i < pattern.length; i++)
	{
		enemy1 = new Enemy(this.assetManager);
		enemy2 = new Enemy(this.assetManager);
		
		switch(pattern[i])
		{
			case 1 : 
				enemy1.init(800 + 550 * i, "black", 1, this.speed);
			break;
			
			case 2 :
				enemy1.init(800 + 500 * i, "black", 2, this.speed);
			break;
			
			case 3 :
				enemy1.init(800 + 500 * i, "blue", 3, this.speed);
				enemy2.init(800 + 500 * i, "black", 4, this.speed);
			break;
		}
			
		enemyList.push(enemy1);
		
		if(enemy2.active) { enemyList.push(enemy2);}
	}
		
	this.patternCount++;
}