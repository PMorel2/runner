var Game = function(){
	var self = this;
	this.localTime = 0;
	this.globalTime = 0;
	this.gameState = "Start Menu";
	
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
		"Game Over" : "/web-static/img/gameover.png"
		
	};
	
	var soundList = {
		"music" : "/web-static/sounds/music.mp3"
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
		enemyManager.AddPattern(enemyList, 1, this.assetManager);
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
	
		case "Game Loop" :
		
			en = new Enemy();
			
			var music = this.assetManager.getSound("music");
			music.loop = true;
			music.volume = 1;
			music.play();
		
			player.Update(localTimeDelta / 1000, this.localTime);
			
			if(player.health <= 0)
			{
				this.gameState = "Game Over";
				music.pause();
				music.currentTime = 0;
			}
			
			enemyManager.Update(localTimeDelta / 1000, this.localTime);

			for ( var i = 0; i < enemyList.length; i++)
			{
				if(enemyList[i].active){
					enemyList[i].Update(localTimeDelta / 1000, this.localTime)
					if(enemyList[i].x < player.x && !enemyList[i].scoreGiven){
						console.log(enemyList[i].scoreGiven);
						enemyList[i].scoreGiven = true;
						player.combo++;
						console.log(enemyList[i].scoreGiven);
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
				if(enemyList[i].active){
					enemyList[i].render(graphics);
					this.CheckCollision(player, enemyList[i]);
				}
			}
			
			graphics.font = "30px Comic Sans MS";
			graphics.fillStyle = "green";
			
			graphics.fillText("LIFE " , 10, 60)
			
			graphics.strokeRect(100, 30, 150, 40);
			
			if(player.health > 2)
				graphics.fillStyle = "green";
			else
				graphics.fillStyle = "red";
			
			graphics.fillRect(100, 30, 30 * player.health, 40);
			
			
			graphics.fillStyle = "pink";
			graphics.fillText("Score : " + player.score, 300, 50);

			graphics.fillStyle = "blue";
			graphics.fillText("Combo : " + player.combo, 580, 50);
			graphics.fillText("Speed : " + enemyManager.speed, 600, 100);
			
			graphics.restore();
			
			break;
			
			case "Game Over" :
				graphics.save();
			
				graphics.clearRect(0,0, this.canvas.width, this.canvas.height);
				graphics.drawImage(this.assetManager.getImage("Game Over"), 0, 0);
				
				player.score = 0;
				player.combo = 0;
				player.health = 5;
				enemyManager.speed = 80;
				
				enemyList = [];
				
				enemyManager.AddPattern(enemyList, 1, this.assetManager);
				
				if(player.enterPressed)
				{
					player.enterPressed = false;
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
			player.health -= enemy.dmg;
			enemy.active = false;
			player.combo = 0;
			console.log(player.health);
		}
};















