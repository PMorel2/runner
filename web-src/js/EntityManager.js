//////// Les "entités" regroupe les différents type d'ennemis et les bonus

var EntityManager = function(assetManager){

	self = this;
	
	this.speed = 65;
	
	this.assetManager = assetManager;
	
	this.patternCount = 0;
	
	p1 = [1, 2, 3, 4, 5, 6, 7, 8];
	p2 = [1, 7, 8, 7, 8, 5, 6, 1];
	p3 = [7, 5, 6, 8, 1, 3, 1, 4]; 
	p4 = [1, 4, 3, 5, 6, 1, 2, 8]; 
	p5 = [8, 3, 7, 4, 5, 6, 1, 3]; 
};

EntityManager.prototype.AddPattern = function(entityList, patternIndex){
	switch(patternIndex)
	{
		case 1 : 
			this.AddEntities(entityList, p1);
		break;
		case 2 : 
			this.AddEntities(entityList, p2);
		break;
		case 3 : 
			this.AddEntities(entityList, p3);
		break;
		case 4 : 
			this.AddEntities(entityList, p4);
		break;
		case 5 : 
			this.AddEntities(entityList, p5);
		break;
	}
};

EntityManager.prototype.Update = function(deltaTime){

	if (this.speed < 105)
		this.speed += 0.2 * deltaTime;
	else
		this.speed = 105;
};

EntityManager.prototype.AddEntities = function(entityList, pattern){
	for (var i = 0; i < pattern.length; i++)
	{
		entity1 = new Entity(this.assetManager);
		entity2 = new Entity(this.assetManager);
		
		switch(pattern[i])
		{
			case 1 : 
				entity1.init(800 + 600 * i, "black", 1, this.speed);
			break;
			
			case 2 :
				entity1.init(800 + 600 * i, "black", 2, this.speed);
			break;
			
			case 3 :
				entity1.init(800 + 600 * i, "blue", 3, this.speed);
			break;
			
			case 4 :
				entity1.init(800 + 600 * i, "red", 3, this.speed);
			break;
			
			case 5 :
				entity1.init(800 + 600 * i, "black", 1, this.speed);
				entity2.init(800 + 600 * i, "red", 3, this.speed);
			break;
			
			case 6 :
				entity1.init(800 + 600 * i, "black", 1, this.speed);
				entity2.init(800 + 600 * i, "blue", 3, this.speed);
			break;
			
			case 7 :
				entity1.init(800 + 600 * i, "black", 2, this.speed);
				entity2.init(800 + 600 * i, "red", 4, this.speed);
			break;
			
			case 8 :
				entity1.init(800 + 600 * i, "black", 2, this.speed);
				entity2.init(800 + 600 * i, "blue", 4, this.speed);
			break;
				
			
		}
			
		entityList.push(entity1);
		
		if(entity2.active) { entityList.push(entity2);}
	}
}