var Game = function(){
	var self = this;
	this.localTime = 0;
	this.globalTime = 0;
	this.gameState = "Start Menu";
	
	this.nextPattern = 1;
	this.lastPatter = 0;
	
	bg = new Image();
	
	bg.drawBg = false;

	this.canvas = $("#main-scene-canvas").get(0);
	graphics = this.canvas.getContext("2d");
	
	var imageList = {
		"background": "/web-static/img/background.jpg",
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


	player = new Player(this.assetManager);
	enemy = new Enemy();
	enemyManager = new EnemyManager(this.assetManager);
	enemyList = [];
	
	//camera = new Camera(player);
	
	requestAnimFrame(
		function loop() {
			self.mainLoop();
			requestAnimFrame(loop);
		}					
	);
};
Game.prototype.mainLoop = function(){
	var now = Date.now();
	var globalTimeDelta = now - this.globalTime;
	var localTimeDelta = Math.min(50, globalTimeDelta);
	this.localTime += localTimeDelta;
	
	if(enemyList.length < 1){
		
		this.lastPattern = this.nextPattern;
		
		do
		{
			this.nextPattern = Math.floor((Math.random()* 5)+1);
			console.log("lllll");
			
		}while (this.nextPattern == this.lastPattern);
		
		console.log("Pattern : " + this.nextPattern);
		
		enemyManager.AddPattern(enemyList, this.nextPattern, this.assetManager);
	}
	
	graphics.canvas = this.canvas;
	graphics.drawTimeMillis = now;
	
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
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////// GAME LOOP
	
	
		case "Game Loop" :
		
			en = new Enemy();
			
			var music = this.assetManager.getSound("music");
			music.loop = true;
			music.volume = 0;
			music.play();
		
			player.Update(localTimeDelta / 1000, this.localTime, enemyManager.speed);
			
			if(player.health <= 0)
			{
				music.currentTime = 0;
				music.pause();
				
				var deathSound = this.assetManager.getSound("death");
				deathSound.loop = false;
				deathSound.volume = 1;
				deathSound.play();
				this.gameState = "Game Over";
			}
			
			enemyManager.Update(localTimeDelta / 1000, this.localTime);

			for ( var i = 0; i < enemyList.length; i++)
			{
				enemyList[i].speed = enemyManager.speed;
			
				if(enemyList[i].active){
					enemyList[i].Update(localTimeDelta / 1000, this.localTime)
					if(enemyList[i].x < player.x && !enemyList[i].scoreGiven && enemyList[i].type != 3 && enemyList[i].type != 4){
						enemyList[i].scoreGiven = true;
						player.combo++;
						player.score += enemy.scoreValue * player.combo;
					}
				}
				else
					enemyList.splice(i, 1);
			}
			
			this.CheckCollision(player, enemy);
			
			graphics.save();
			
			graphics.clearRect(0,0, this.canvas.width, this.canvas.height);
			
			graphics.drawImage(this.assetManager.getImage("background"), 0, 0 );

								////// Dessin des personnages
			player.render(graphics);
			for (var i = 0; i < enemyList.length; i++)
			{
				if(!enemyList[i].collisionDone){
					this.CheckCollision(player, enemyList[i]);
				}
				
				// if(enemyList[i].type != 3 && enemyList[i].type != 4)
					// enemyList[i].render(graphics);
				// else if (enemyList[i].active)
				enemyList[i].render(graphics);
			}
			
			graphics.font = "30px Comic Sans MS";
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
			
			//////////////////////////////////////////////////////////////////////// GAME OVER
			
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
				gradient.addColorStop("0","red");
				gradient.addColorStop("0.5","orange");
				gradient.addColorStop("1.0","red");
				
				
				graphics.fillStyle=gradient;
				graphics.fillText("Press ENTER to play again !", graphics.canvas.width/2 + 200, 150);

				graphics.fillText("You are DEAD !", graphics.canvas.width/2 - 200, 120);
				
				player.score = 0;
				player.combo = 0;
				player.health = 5;
				player.framerate = 5;
				enemyManager.speed = 65;
				
				enemyList = [];
				
				enemyManager.AddPattern(enemyList, 1, this.assetManager);
				
				if(player.enterPressed)
				{
					player.enterPressed = false;
					deathMusic.pause();
					deathMusic.currentTime = 0;
					this.gameState = "Start Menu";
				}
				
				graphics.restore();
				
			break;
	
	}
};

Game.prototype.CheckCollision = function(player, enemy){
	
	if((player.x + player.width/2 > enemy.x - enemy.width/2) && (player.x - player.width/2 < enemy.x + enemy.width/2)
		&& player.y + player.height/2 > enemy.y - enemy.height/2 && player.y - player.height/2 < enemy.y + enemy.width/2)
		{
		
			if(enemy.type == 3 || enemy.type == 4)
			{
				enemy.collisionDone = true;
				
				if(player.color == enemy.color)
				{
					player.score += enemy.scoreValue;
					player.combo ++;
					
					enemy.setSprite("eclat");
					enemy.currentSprite.setCenter(50, 50);
					
					var cookieSound = this.assetManager.getSound("cookie");
					cookieSound.loop = false;
					cookieSound.volume = 0.8;
					cookieSound.play();
				}
				else
				{
					enemy.setSprite("wrong");
					enemy.currentSprite.setCenter(50, 50);
				
					var wrongSound = this.assetManager.getSound("wrong");
					wrongSound.loop = false;
					wrongSound.volume = 0.8;
					wrongSound.play();
				}
			}
			else{
				player.health -= enemy.dmg;
				enemy.collisionDone = true;
				player.combo = 0;
				enemy.setSprite("explosion");
				enemy.currentSprite.setCenter(50, 50);
				
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















