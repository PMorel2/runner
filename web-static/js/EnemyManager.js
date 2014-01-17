var EnemyManager = function(assetManager){
	self = this;
	
	this.speed = 60;
	
	this.assetManager = assetManager;
	
	this.patternCount = 0;
	
	p1 = [1, 2, 3, 4, 5, 6, 7, 8];
	p2 = [1, 7, 8, 7, 8, 5, 6, 1];
	p3 = [7, 5, 6, 8, 1, 3, 1, 4]; 
	p4 = [1, 4, 3, 5, 6, 1, 2, 8]; 
	p5 = [8, 3, 7, 4, 5, 6, 1, 3]; 
};

EnemyManager.prototype.AddPattern = function(enemyList, patternIndex){
	switch(patternIndex)
	{
		case 1 : 
			this.AddEnnemies(enemyList, p1);
		break;
		case 2 : 
			this.AddEnnemies(enemyList, p2);
		break;
		case 3 : 
			this.AddEnnemies(enemyList, p3);
		break;
		case 4 : 
			this.AddEnnemies(enemyList, p4);
		break;
		case 5 : 
			this.AddEnnemies(enemyList, p5);
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
				enemy1.init(800 + 600 * i, "black", 1, this.speed);
			break;
			
			case 2 :
				enemy1.init(800 + 600 * i, "black", 2, this.speed);
			break;
			
			case 3 :
				enemy1.init(800 + 600 * i, "blue", 3, this.speed);
			break;
			
			case 4 :
				enemy1.init(800 + 600 * i, "red", 3, this.speed);
			break;
			
			case 5 :
				enemy1.init(800 + 600 * i, "black", 1, this.speed);
				enemy2.init(800 + 600 * i, "red", 3, this.speed);
			break;
			
			case 6 :
				enemy1.init(800 + 600 * i, "black", 1, this.speed);
				enemy2.init(800 + 600 * i, "blue", 3, this.speed);
			break;
			
			case 7 :
				enemy1.init(800 + 600 * i, "black", 2, this.speed);
				enemy2.init(800 + 600 * i, "red", 4, this.speed);
			break;
			
			case 8 :
				enemy1.init(800 + 600 * i, "black", 2, this.speed);
				enemy2.init(800 + 600 * i, "blue", 4, this.speed);
			break;
				
			
		}
			
		enemyList.push(enemy1);
		
		if(enemy2.active) { enemyList.push(enemy2);}
	}
		
	this.patternCount++;
}