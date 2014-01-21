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
		"background": "/web-static/img/background3.png",
		"test" : "/web-static/img/test.png",
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
		"pause" : "/web-static/img/pause.png"
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

	player = new Player(this.assetManager);
	entity = new Entity();
	entityManager = new EntityManager(this.assetManager);
	entityList = [];
	
	
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
	graphics.font = "30px Comic Sans MS";	//////// Comic Sans pour plus de swag
	
	
	
	//////// On switch entre les différents états du jeu : Menu/Tutoriel/Jeu/Game Over
	
	
	switch(this.gameState){
	
		case "Start Menu" :
		
			this.parallax.AddLayer(this.assetManager.getImage("background"), 20, 1000);
			this.parallax.AddLayer(this.assetManager.getImage("test"), entityManager.speed, 800);
		
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
			music.volume = 1;
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
			
			graphics.fillRect(0, 0, 800, 85);
			
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
				
				
				//////// On remet les valeurs à 0
				
				player.score = 0;
				player.combo = 0;
				player.health = 5;
				player.framerate = 5;
				entityManager.speed = 65;
				
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













