var Game = function(){
	var self = this;
	this.localTime = 0;
	this.globalTime = 0;
	
	bg = new Image();
	
	bg.drawBg = false;

	this.canvas = $("#main-scene-canvas").get(0);
	graphics = this.canvas.getContext("2d");
	
	var sleep = 1;
	var imageList = {
		"background": "/web-static/img/background.jpg",
		"JellykidRuns": "/web-static/img/jellykidRuns.png",
		"JellykidJump1": "/web-static/img/jellykid-jump1.png",
		"JellykidJump2": "/web-static/img/jellykid-jump2.png",
		"JellykidRuns-red": "/web-static/img/jellykidRuns-red.png",
		"JellykidJump1-red": "/web-static/img/jellykid_jump_red1.png",
		"JellykidJump2-red": "/web-static/img/jellykid_jump_red2.png",
		"Impossibear" : "/web-static/img/impossibear120.png",
		"catbug" : "/web-static/img/catbug.png"
	};
	
	var soundList = {};
	this.assetManager = new AssetManager();
	this.assetManager.startLoading(imageList, soundList);
	
	$scene = $("#main-scene");


	player = new Player(this.assetManager);
	enemy = new Enemy();
	patternList = new PatternList(this.assetManager);
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
	player.Update(localTimeDelta / 1000, this.localTime);
	
	if(enemyList.length < 5){
		patternList.AddPattern(enemyList, 1, this.assetManager);
	}
	
	
	for ( var i = 0; i < enemyList.length; i++)
	{
		if(enemyList[i].active)
			enemyList[i].Update(localTimeDelta / 1000, this.localTime)
		else
			enemyList.splice(i, 1);
	}
	
	this.CheckCollision(player, enemy);
	
	graphics.canvas = this.canvas;
	graphics.drawTimeMillis = now;
	graphics.clearRect(0,0, this.canvas.width, this.canvas.height);
	graphics.save();
	graphics.drawImage(this.assetManager.getImage("background"), 0, 0 );

			////// Dessin des personnages
	player.render(graphics);
	for (var i = 0; i < enemyList.length; i++)
	{
		enemyList[i].render(graphics);
		this.CheckCollision(player, enemyList[i]);
	}
	//enemy.Draw(graphics);
	graphics.restore();	//restore le contexte
};

Game.prototype.CheckCollision = function(player, enemy){
	
	if((player.x + player.width/2 > enemy.x - enemy.width/2) && (player.x - player.width/2 < enemy.x + enemy.width/2)
		&& player.y + player.height/2 > enemy.y - enemy.height/2 && player.y - player.height/2 < enemy.y + enemy.width/2)
		{
			player.health -= enemy.dmg;
			enemy.active = false;
			console.log(player.health);
		}
};















