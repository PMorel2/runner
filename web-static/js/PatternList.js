var PatternList = function(){
	self = this;
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
		enemy1 = new Enemy;
		enemy2 = new Enemy;
		
		switch(pattern[i])
		{
			case 1 : 
				enemy1.init(800 + 200 * i, 400, "black");
			break;
			
			case 2 :
				enemy1.init(800 + 200 * i, 200, "black");
			
			case 3 :
				enemy1.init(800 + 200 * i, 400, "black");
				enemy2.init(800 + 200 * i, 100, "blue");
			break;
		}
			
		enemyList.push(enemy1);
		
		if(enemy2.active) { enemyList.push(enemy2);}
	}
		
}