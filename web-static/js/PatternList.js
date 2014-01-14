var PatternList = function(assetManager){
	self = this;
	
	this.assetManager = assetManager;
	
	p1 = [1, 1, 2, 1, 3, 1];


}

PatternList.prototype.AddPattern = function(enemyList, patternIndex){
	switch(patternIndex)
	{
		case 1 : 
			this.AddEnnemies(enemyList, p1);
			break;
	}
}

PatternList.prototype.AddEnnemies = function(enemyList, pattern){
	for (var i = 0; i < pattern.length; i++)
	{
		enemy1 = new Enemy(this.assetManager);
		enemy2 = new Enemy(this.assetManager);
		
		switch(pattern[i])
		{
			case 1 : 
				enemy1.init(800 + 600 * i, "black", 1);
			break;
			
			case 2 :
				enemy1.init(800 + 500 * i, "black", 2);
			
			case 3 :
				enemy1.init(800 + 500 * i, "blue", 3);
				enemy2.init(800 + 500 * i, "black", 4);
			break;
		}
			
		enemyList.push(enemy1);
		
		if(enemy2.active) { enemyList.push(enemy2);}
	}
		
}