var AssetManager = function(){
	this.images = {};
	this.sounds = {};
	this.imagesError = {};
	this.imagesToLoad = {};
	this.soundsToLoad = {};
	this.loadingStarted = false;
};
AssetManager.prototype.loadImage = function(url, id){
	var _this = this;
	if(!id){
		id = url;
	}
	var img = this.images[id];
	if(!img){
		this.imagesToLoad[id] = url;
		img = new Image();
		img.onload = function(){
			delete _this.imagesToLoad[id];
			_this.assetLoaded();
		};
		img.onerror = function(){
			delete _this.imagesToLoad[id];
			_this.imagesError[id] = id;
			_this.assetLoaded();
		};
		img.src = url;
		this.images[id] = img;
	}else{
		this.assetLoaded();
	}
	return img;
};
AssetManager.prototype.loadSound = function(url, id, onload){
	var _this = this;
	if(!id){
		id = url;
	}
	if(this.sounds[id]){
		this.assetLoaded();
	}else{
		this.soundsToLoad[id] = url;
		var soundElm = new Audio();
		soundElm.addEventListener("canplay", function(){
			delete _this.soundsToLoad[id];
			_this.assetLoaded();
		});
		soundElm.addEventListener("stalled", function(){
			delete _this.soundsToLoad[id];
			console.log("Error Loading" + url);
			_this.assetLoaded();
		});
		
		var sourceElm = document.createElement("source");
		sourceElm.src = url;
		switch(url.substring(url.length - 3)){
			case 'mp3':
				sourceElm.type = "audio/mpeg";
				break;
			case 'wav' : 
				sourceElm.type = "audio/wav";
				break;
			case 'ogg' : 
				sourceElm.type = "audio/ogg";
				break;
		}
		soundElm.appendChild(sourceElm);
		document.body.appendChild(soundElm);

		this.sounds[id] = soundElm;
	}
	return this.sounds[id];
};

AssetManager.prototype.assetLoaded = function(){
	this.totalAssetLoaded++;
	this.loadingTime = Date.now() - this.loadingStartTime;
	this.loadingEndTime = Date.now();
};
AssetManager.prototype.renderLoadingProgress = function(g){
	/*g.fillStyle = "white";
	g.fillRect(0, 0, g.canvas.width, g.canvas.height);*/
	
	g.strokeStyle = "red";
	g.strokeRect(g.canvas.width/2 - 200, g.canvas.height/2 - 20, 400, 40);
	
	g.fillStyle = "pink";
	g.fillRect(g.canvas.width/2 - 200, g.canvas.height/2 - 20, parseInt(this.getLoadingProgress()*400), 40);
	
	g.font = "16px gunship";
	g.fillStyle = "purple";
	g.fillText("Chargement : " + parseInt(this.getLoadingProgress()*100) + "%", g.canvas.width/2 - 125, g.canvas.height/2 + 5);
};

AssetManager.prototype.isDoneLoading = function(){
	return this.totalAssetCount == this.totalAssetLoaded;
};

AssetManager.prototype.startLoading = function(loadingList, soundLoadingList){
	this.loadingStartTime = Date.now();
	
	this.totalAssetLoaded = 0;
	this.totalAssetCount = 0;
	for(var i in loadingList){
		this.totalAssetCount++;
	}
	for(var i in soundLoadingList){
		this.totalAssetCount++;
	}
	this.loadingStarted = true;
	for(var i in soundLoadingList){
		this.loadSound(soundLoadingList[i], i);
	}
	for(var i in loadingList){
		this.loadImage(loadingList[i], i);
	}
};
AssetManager.prototype.getLoadingProgress = function(){
	if(this.totalAssetCount == 0){
		return 0;
	}else{
		return this.totalAssetLoaded / this.totalAssetCount;
	}
};

AssetManager.prototype.getImage = function(id){
	return this.images[id];
};

AssetManager.prototype.getSound = function(id){
	return this.sounds[id];
};

var Character = function(){

    this.revertDirection = false;
	this.spriteList = {};
	this.currentSprite = false;
	
	this.positionListenerList = [];
};

Character.prototype.addPositionListener = function(listener){
	// TODO
		this.positionListenerList.push(listener);
	
};

Character.prototype.createSprite = function(id, image, width, height, colCount, rowCount, loop){
	this.spriteList[id] = new Sprite(id, image, width, height, colCount, rowCount, loop);
};


Character.prototype.setSprite = function(anim, onComplete){
	this.lastAnimId = anim;
	var spriteId = anim;
	if(this.currentSprite != this.spriteList[spriteId]){
		if(!this.currentSprite || this.currentSprite.loop || this.currentSprite.currentFrame == this.currentSprite.frameCount - 1){
			if(this.currentSprite){
				this.currentSprite.stop();
				this.currentSprite.hide();
			}
			this.currentSprite = this.spriteList[spriteId];
			this.currentSprite.resetAnim();
			this.currentSprite.play(onComplete);
			this.currentSprite.show();
        }else{
            this.nextSprite = anim;
        }
	}
};

Character.prototype.render = function(g){
	if(this.currentSprite)
	{
		g.save();
		g.translate(this.x, this.y);
	
		this.currentSprite.render(g, this.revertDirection);
		g.restore();
	}
}

Character.prototype.setPosition = function(x, y){
	// TODO
	this.x = parseInt(x);
	this.y = parseInt(y);
/*	this.$elm.css("top", "20px");
	this.$elm.css({
		top: this.y + "px",
		left: this.x + "px"
	});*/
	
	for(var i in this.positionListenerList)
	{
		this.positionListenerList[i](this.x, this.y);
	}
	
};
Character.prototype.moveTo = function(x, y){
	var self = this;
	if(this.animHandler){
		this.animHandler.stop(false, false);
	}
	this.animHandler = $.ease({
		x: this.x,
		y: this.y
	}, {
		x: x, 
		y: y
	}, function(o){
		self.setPosition(o.x, o.y);
	},
	{
		easing: "easeOutCirc",
		duration: 300
	});
};
Character.prototype.move = function(x, y){
	this.moveTo(this.x + x, this.y + y);
};
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
var Game = function(){

	//////// Variables
	var self = this;
	this.localTime = 0;
	this.globalTime = 0;
	this.gameState = "Start Menu";
	this.nextPattern = 1;
	this.lastPatter = 0;
	
	this.canvas = $("#main-scene-canvas").get(0);
	graphics = this.canvas.getContext("2d");
	
	//////// Asset Loading
	var imageList = {
		"Layer1": "/web-static/img/layer1.png",
		"Layer2": "/web-static/img/layer2.png",
		"Layer3": "/web-static/img/layer3.png",
		
		"JellykidRuns": "/web-static/img/jellykidRuns.png",
		"JellykidJump1": "/web-static/img/jellykid-jump1.png",
		"JellykidJump2": "/web-static/img/jellykid-jump2.png",
		"JellykidRuns-red": "/web-static/img/jellykidRuns-red.png",
		"JellykidJump1-red": "/web-static/img/jellykid_jump_red1.png",
		"JellykidJump2-red": "/web-static/img/jellykid_jump_red2.png",
		"Impossibear" : "/web-static/img/impossibear120.png",
		"catbug" : "/web-static/img/catbug.png",
		"JellyKid-Crouching" : "/web-static/img/jellyKid-Crouching.png",
		"JellyKid-Crouching-red" : "/web-static/img/jellyKid-Crouching-red.png",
		"Start" : "/web-static/img/start.png",
		"Game Over" : "/web-static/img/gameover.png",
		"Explosion" : "/web-static/img/boum.png",
		"Bonus-red" : "/web-static/img/redBonus.png",
		"Bonus" : "/web-static/img/blueBonus.png",
		"eaten" : "/web-static/img/eclat.png",
		"eaten-red" : "/web-static/img/eclat-red.png",
		"blueWrong" : "/web-static/img/blueFailed.png",
		"redWrong" : "/web-static/img/redFailed.png",
		"pause" : "/web-static/img/pause.png",
		"cadre" : "/web-static/img/cadre.png"
	};
	
	var soundList = {
		"music" : "/web-static/sounds/music.mp3",
		"death" : "/web-static/sounds/JellyKidDiesFade2.wav",
		"GOMusic" : "/web-static/sounds/gameOver.mp3",
		"cookie" : "/web-static/sounds/cookie.mp3",
		"ouch" : "/web-static/sounds/ouch.mp3",
		"wrong" : "/web-static/sounds/wrong.wav",
		"explosion" : "/web-static/sounds/explosion.mp3"
	};
	this.assetManager = new AssetManager();
	this.assetManager.startLoading(imageList, soundList);
	
	$scene = $("#main-scene");
	
	
	this.parallax = new ParallaxBackground();

	player = new Player(this.assetManager, user.lives, user.bestScore);
	entity = new Entity();
	entityManager = new EntityManager(this.assetManager);
	entityList = [];
	
	//console.log("user lives: ".user.lives);
	
	this.parallax.AddLayer(this.assetManager.getImage("Layer1"), 10, 1600);
	this.parallax.AddLayer(this.assetManager.getImage("Layer2"), entityManager.speed, 1600);
	this.parallax.AddLayer(this.assetManager.getImage("Layer3"), 100, 1600);
	
	
	//////// Boucle principale
	requestAnimFrame(
		function loop() {
			self.mainLoop();
			requestAnimFrame(loop);
		}					
	);
};
Game.prototype.mainLoop = function(){

	//////// Temps du jeu
	var now = Date.now();
	var globalTimeDelta = now - this.globalTime;
	var localTimeDelta = Math.min(50, globalTimeDelta);
	this.localTime += localTimeDelta;
	
	
	//////// Chargement des patterns
	
	this.AddPattern();
	
	graphics.canvas = this.canvas;
	graphics.drawTimeMillis = now;
	graphics.font = "30px Comic Sans MS";
	
	
	
	//////// On switch entre les différents états du jeu : Menu/Tutoriel/Jeu/Game Over
	
	
	switch(this.gameState){
	
		case "Start Menu" :
		
			graphics.save();
		
			graphics.drawImage(this.assetManager.getImage("Start"), 0, 0);
				
			if(player.enterPressed)
			{
				player.enterPressed = false;
				this.gameState = "Game Loop";
			}
			
			graphics.restore();
				
		break;
		
	
	//////// GAME LOOP
	
		case "Pause" :
			
			
			graphics.drawImage(this.assetManager.getImage("pause"), 190, 100);
			graphics.drawImage(this.assetManager.getImage("pause"), 490, 100);
			graphics.fillText("PAUSE", 340, 150);
			
			if(player.enterPressed)
			{
					player.enterPressed = false;
					this.gameState = "Game Loop";
			}
			
		break;
	
		case "Game Loop" :
		
			if(player.enterPressed)
			{
					player.enterPressed = false;
					this.gameState = "Pause";
			}
		
			//////// Musique principale
			var music = this.assetManager.getSound("music");
			music.loop = true;
			music.volume = 0.8;
			music.play();
			
			//////// Update du background
			this.parallax.Update(localTimeDelta / 1000);
		
			//////// Update du player
			
			player.Update(localTimeDelta / 1000, this.localTime, entityManager.speed);
			
			if(player.health <= 0)
			{
				player.health = 0; //////// éviter que le rectangle ne se dessine si health = -0.5
				music.currentTime = 0;
				music.pause();
				
				var deathSound = this.assetManager.getSound("death");
				deathSound.loop = false;
				deathSound.volume = 1;
				deathSound.play();
				this.gameState = "Game Over";
			}
			
			
			////////Update des entités
			
			entityManager.Update(localTimeDelta / 1000, this.localTime);

			for ( var i = 0; i < entityList.length; i++)
			{
				entityList[i].speed = entityManager.speed; //////// La vitesse de entités est gérée par l'entityManager, elle augmente avec le temps jusqu'à une certaine limite
			
				if(entityList[i].active){
				
					entityList[i].Update(localTimeDelta / 1000, this.localTime)
					
					if(entityList[i].x < player.x && !entityList[i].scoreGiven && entityList[i].type != 3 && entityList[i].type != 4){
						entityList[i].scoreGiven = true; //////// Pour éviter que le même entity n'augmente plusieurs fois le score
						player.combo++;
						player.score += entity.scoreValue * player.combo;
					}
				}
				else
					entityList.splice(i, 1);	//////// Dès que l'entité n'est plus actif, on la supprimme
			}
			
			this.CheckCollision(player, entity);
			
			//////// Dessin des personnages
			
			graphics.save();
			
			graphics.clearRect(0,0, this.canvas.width, this.canvas.height);
			
			this.parallax.Draw(graphics);
			//graphics.drawImage(this.assetManager.getImage("background"), 0, 0 );

			player.render(graphics);
			
			for (var i = 0; i < entityList.length; i++)
			{
				if(!entityList[i].collisionDone)	//////// Ne gérer que les entité n'ayant pas encore collisionné
					this.CheckCollision(player, entityList[i]);
				
				entityList[i].render(graphics);
			}
			
			//////// Dessin des informations
			
			//////// Dessin du cadre
			graphics.drawImage(this.assetManager.getImage("cadre"), 0, 0);
						
			graphics.fillStyle = "green";
			
			graphics.fillText("LIFE " , 10, 50)
			
			graphics.strokeRect(100, 20, 150, 40);
			
			if(player.health > 2)
				graphics.fillStyle = "green";
			else
				graphics.fillStyle = "red";
			
			graphics.fillRect(100, 20, 30 * player.health, 40);
			
			
			graphics.fillStyle = "pink";
			graphics.textAlign = "center";
			graphics.fillText("Score : " + player.score, graphics.canvas.width/2, 50);

			graphics.fillStyle = "blue";
			graphics.fillText("Combo : " + player.combo, 700, 50);

			graphics.restore();
			
			break;
			
			
			//////// GAME OVER
			
			
			case "Game Over" :
			
			var deathMusic = this.assetManager.getSound("GOMusic");
				deathMusic.loop = true;
				deathMusic.volume = 0.8;
				deathMusic.play();
			
				graphics.save();
			
				//graphics.clearRect(0,0, this.canvas.width, this.canvas.height);
				graphics.drawImage(this.assetManager.getImage("Game Over"), 0, 85);
				
				graphics.textAlign = "center";
				graphics.font = "30px Comic Sans MS";
				
				var gradient=graphics.createLinearGradient(0,0,graphics.canvas.width,0);
				gradient.addColorStop("0","black");
				gradient.addColorStop("0.5","blue");
				gradient.addColorStop("1.0","black");
				
				graphics.fillStyle=gradient;
				graphics.fillText("Press ENTER to play again !", graphics.canvas.width/2 + 200, 150);

				graphics.fillText("You are DEAD !", graphics.canvas.width/2 - 200, 120);
				
				
				player.checkBestScore();
				player.decreaseLives();
				
				//////// On remet les valeurs à 0
				
				player.score = 0;
				player.combo = 0;
				player.health = 5;
				player.framerate = 5;
				entityManager.speed = 65;
				this.parallax.Reset();
				
				entityList = [];
				
				this.AddPattern();
				
				if(player.enterPressed)
				{
					player.enterPressed = false;
					this.AddPattern();
					deathMusic.pause();
					deathMusic.currentTime = 0;
					this.gameState = "Start Menu";
				}
				
				graphics.restore();
				
			break;
	
	}
};

Game.prototype.CheckCollision = function(player, entity){
	
	if((player.x + player.width/2 > entity.x - entity.width/2) && (player.x - player.width/2 < entity.x + entity.width/2)
		&& player.y + player.height/2 > entity.y - entity.height/2 && player.y - player.height/2 < entity.y + entity.width/2)
		{
		
			if(entity.type == 3 || entity.type == 4)
			{
				entity.collisionDone = true;
				
				if(player.color == entity.color)
				{
					player.score += entity.scoreValue;
					player.combo ++;
					
					entity.setSprite("eclat");
					entity.currentSprite.setCenter(50, 50);
					
					var cookieSound = this.assetManager.getSound("cookie");
					cookieSound.loop = false;
					cookieSound.volume = 0.8;
					cookieSound.play();
				}
				else
				{
					player.combo = 0;
					player.health -= entity.dmg / 2;
				
					entity.setSprite("wrong");
					entity.currentSprite.setCenter(50, 50);
				
					var wrongSound = this.assetManager.getSound("wrong");
					wrongSound.loop = false;
					wrongSound.volume = 0.8;
					wrongSound.play();
				}
			}
			else{
				player.health -= entity.dmg;
				entity.collisionDone = true;
				player.combo = 0;
				entity.setSprite("explosion");
				entity.currentSprite.setCenter(50, 50);
				
				var boumSound = this.assetManager.getSound("explosion");
					boumSound.loop = false;
					boumSound.volume = 0.5;
					boumSound.play();
				
				var ouchSound = this.assetManager.getSound("ouch");
					ouchSound.loop = false;
					ouchSound.volume = 0.8;
					ouchSound.play();
			}
		}
};

Game.prototype.AddPattern = function()
{
	if(entityList.length < 1){
		
		this.lastPattern = this.nextPattern;
		
		do
		{
			this.nextPattern = Math.floor((Math.random()* 5)+1);
			
		}while (this.nextPattern == this.lastPattern);
		
		entityManager.AddPattern(entityList, this.nextPattern, this.assetManager);
	}
}




var Layer = function(){

	this.image;
	this.x;
	this.xCopy;
	this.speed;
	this.width;
	////// Chaque couche est dessin�e deux fois l'une � la suite de l'autre

}

Layer.prototype.init = function (img, speed, width){
	this.image = img;
	this.speed = speed;
	this.width = width;
	this.x = 0;
	this.xCopy = width;
}

Layer.prototype.Update = function(deltaTime)
{
	this.x -= this.speed * deltaTime;
	this.xCopy -= this.speed * deltaTime;
	
	if(this.x  <= - this.width)
		this.x = this.xCopy + this.width;
	else if(this.xCopy <= - this.width)
		this.xCopy = this.x + this.width;
	//this.CheckPosition();
}

Layer.prototype.CheckPosition = function(){
	if(this.x  <= - this.width)
		this.x = this.xCopy + this.width;
	else if(this.xCopy <= - this.width)
		this.xCopy = this.x + this.width;
}
var ParallaxBackground = function(){

	this.Layers = [];

}

ParallaxBackground.prototype.init = function(){}

ParallaxBackground.prototype.Update = function(deltaTime){

	for ( var i = 0; i < this.Layers.length; i++)
	{
		this.Layers[i].Update(deltaTime);
	}
}

ParallaxBackground.prototype.AddLayer = function(img, speed, width)
{
	var layer = new Layer();
	layer.init(img, speed, width);
	
	this.Layers.push(layer);
}

ParallaxBackground.prototype.Draw = function(graphics)
{
	graphics.save();
	
	for ( var i = 0; i < this.Layers.length; i++)
	{
		if(this.Layers[i].x <= 800 && this.Layers[i].x + this.Layers[i].width >= 0){
			graphics.drawImage(this.Layers[i].image, this.Layers[i].x, 0);
			}
		
		if(this.Layers[i].xCopy <= 800 && this.Layers[i].xCopy + this.Layers[i].width >= 0){
			graphics.drawImage(this.Layers[i].image, this.Layers[i].xCopy, 0);
			}
	}
	
	graphics.restore();

}

ParallaxBackground.prototype.Reset = function(){
	for ( var i = 0; i < this.Layers.length; i++)
	{
		this.Layers[i].x = 0;
		this.Layers[i].xCopy = this.Layers[i].width;
	}
}
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
	
	console.log(this.lives);
	console.log(this.bestScore);
	
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
	//$.runner.api('updateLives', this.lives);
}

Player.prototype.checkBestScore = function()
{
	if(true)
	{
		console.log("updating");
		this.bestScore = 50;
		var dataToSend = {action:'updateBestScore', data:this.bestScore};
		($.ajax({
		  url: 'api.php',
		  method: 'POST',
		  data: dataToSend,
		  success: function (data) {
			//console.log("SUCCESS");
			//console.log(data);
		  }
		}));
	}
}
var Sprite = function(id, image, width, height, colCount, rowCount, loop){
	this.image = image;
	this.id = id;
	this.loop = loop;
	this.rowCount = rowCount;
	this.colCount = colCount;
	this.frameCount = this.rowCount * this.colCount;
	this.currentFrame = 0;
	this.setFrameRate(15);
	this.invert = false;
	this.invertAnim = false;
	this.scale = 1;
	this.lastUpdateTime = 0;
	this.imgWidth = width;
	this.imgHeight = height;
	this.centerX = 0;
	this.centerY = 0;
	this.x = 0;
	this.y = 0;
	
	/*this.$elm = $("<div>").css({
		position: "absolute",
		top: "0px",
		overflow: "hidden",
		left: "0px"
	});
	this.parent.append(this.$elm);*/
	this.hide();
	this.onAnimationComplete = false;
	
	/*this.$img = $("<img>").css({
		position: "absolute",
		left: "0",
		top: "0",
		width: this.imgWidth + 'px',
		height: this.imgHeight + 'px'
	});*/
	this.width = Math.round(this.imgWidth / this.colCount);
	this.height = Math.round(this.imgHeight / this.rowCount);
	//this.$elm.width(this.width).height(this.height).append(this.$img);
	
	/*if(url){
		this.setUrl(url);
	}*/
};

Sprite.prototype.setUrl = function(url){
	if(this.url != url){
		this.url = url;
		this.$img.attr("src", this.url);
	}
};
Sprite.prototype.setPosition = function(x, y){
	this.x = x;
	this.y = y;
	this.refreshPosition();
};


Sprite.prototype.setCenter = function(x, y){
	this.centerX = x;
	this.centerY = y;
	this.refreshPosition();
};
Sprite.prototype.refreshPosition = function(){
	//this.$elm[0].style.left = Math.round(this.x - this.scale * this.centerX) + "px";
	//this.$elm[0].style.top = Math.round(this.y - this.scale * this.centerY) + "px";
};
Sprite.prototype.show = function(type, options){
	if(this.loop){
		this.currentFrame = 0;
		this.play();
	}
	//this.$elm.show(type, options);
};
Sprite.prototype.hide = function(hideType){
	this.stop();
	//this.$elm.hide(hideType);
};
Sprite.prototype.play = function(onComplete){
	var _this = this;
	if(this.player){
		clearTimeout(this.player);
	}
	var frameDuration = this.frameDuration;
	if(this.character && this.character.slowMotion){
		frameDuration = Math.round(frameDuration * 1.5);
	}
	this.player = setTimeout(function(){
		_this.nextFrame();
		if(_this.loop || _this.currentFrame < _this.frameCount - 1){
			_this.play(onComplete);
		}else if((typeof onComplete) == "function"){
			onComplete(_this);
		}
	}, frameDuration);
};
Sprite.prototype.resetAnim = function(){
	this.stop();
	this.currentFrame = 0;
};
Sprite.prototype.stop = function(){
	if(this.player){
		clearTimeout(this.player);
		this.player = false;
	}
};
Sprite.prototype.nextFrame = function(frames){
	if(!frames){
		frames = 1;
	}
	this.currentFrame = this.currentFrame + frames;
	if(this.currentFrame >= this.frameCount){
		if(this.loop){
			this.currentFrame %= this.frameCount;
		}else{
			this.currentFrame = this.frameCount - 1;
		}
	}
};
Sprite.prototype.render = function(g, revertDirection){
	var frame = this.currentFrame;
	if(this.invertAnim){
		frame = this.frameCount - this.currentFrame - 1;
	}
	if (revertDirection)
	{
		g.scale(-this.scale, this.scale);
	}
	else
	{
		g.scale(this.scale, this.scale);
	}
	
	var col = frame % this.colCount;
	var row = Math.floor(frame / this.colCount);
	
	g.drawImage(this.image, this.width * col, this.height * row, this.width, this.height, -this.centerX, -this.centerY, this.width, this.height); //sx, sy, sw, sh
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/*this.$img[0].style.left = -Math.round(this.width * this.scale * col) + "px";
	this.$img[0].style.top = -Math.round(this.height * this.scale * row) + "px";*/
};
Sprite.prototype.setFrameRate = function(frameRate){
	this.frameRate = frameRate;
	this.frameDuration = 1.0 / this.frameRate * 1000;
};
Sprite.prototype.setScale = function(scale){
	if(this.scale != scale){
		this.scale = scale;
		this.refreshPosition();
	}
};
var infoPage;

$(document).ready(function(){
	console.log("game started");

	game = new Game();
});
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(callback, element) {
           window.setTimeout(callback, 1000/60);
         };
})();


$.getTimeMillis = function(){
	return new Date().getTime();
};
$.getTimeFloat = function(){
	return $.getTimeMillis() / 1000;
};
var localTime = Math.floor(new Date().getTime() / 1000);
$.getTime = function(){
	var timeElapsed = Math.floor($.getTimeFloat()) - localTime;
	return serverTime + timeElapsed;
};
$.getElmRegion = function(elm){
	var pos = elm.offset();
	var rootPos = gameManager.root.offset();
	var posX = pos.left - rootPos.left;
	var posY = pos.top - rootPos.top;
	var w = elm.width();
	var h = elm.height();
	return {
		posX: posX,
		posY: posY,
		width: w,
		height: h
	};
};

$.ease = function(from, to, func, options){
	var isObject = true;
	if(typeof from != "object"){
		from = {v: from};
		to = {v: to};
		isObject = false;
	}
	var o = {};
	if(options){
		for(i in options){
			o[i] = options[i];
		}
	}
	o.step = function(f){
		if(isObject){
			var res = {};
			for(i in from){
				res[i] = f * (to[i] - from[i]) + from[i];
			}
			func(res);
		}else{
			func(f * (to.v - from.v) + from.v);
		}
	};
	var listener = $({f:0});
	if(options && options.delay){
		listener.delay(options.delay).animate({f:1}, o);
	}else{
		listener.animate({f:1}, o);
	}
	return listener;
};

$.shuffle = function(list){
	var i, j, t;
	for (i = 1; i < list.length; i++) {
		j = Math.floor(Math.random() * (1 + i));
		if (j != i) {
			t = list[i];
			list[i] = list[j];
			list[j] = t;
		}
	}
};
