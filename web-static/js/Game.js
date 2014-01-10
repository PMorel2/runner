var Game = function(){
	var self = this;
	this.localTime = 0;
	this.globalTime = 0;
	
	bg = new Image();
	bg.src = '/web-static/img/background.jpg';
	
	bg.drawBg = false;

	//var win = new Window('main-window', document.getElementById("gui"));
	
	/*infoPage = new InfoPage();
	try{
		win.addPage("info", infoPage);
		win.addPage("description", new Page("<strong>hello</strong> world"));
		win.addPage("equipement", new Page("lorem ipsum"));
	}catch(e){
		console.log("New Exception : " + e);
	}
	
	infoPage.refreshData({
		name: "Johnny",
		title: "be good",
		xp: 200,
		hp: 643,
		power: 65,
		progress: 0.8
	});*/
	
	this.canvas = $("#main-scene-canvas").get(0);
	graphics = this.canvas.getContext("2d");
	
	
	graphics.fillStyle = "red";
	//graphics.fillRect(0,0, this.canvas.width, this.canvas.height);
	
	$scene = $("#main-scene");

	/*$("#gui").append($("<div>").button().css({position:"absolute",top:"5px",left:"5px"}).append("Menu").click(function(){
		$(win.root).toggle('fade', 200);
	}));
	$(win.root).hide();*/

	player = new Player();
	enemy = new Enemy();
	patternList = new PatternList();
	enemyList = [];
	
	/*camera = new Camera(player);

	player.setPosition(3530, 1770);
	player.init();
	
	requestAnimFrame(
		function loop() {
			self.mainLoop();
			requestAnimFrame(loop);
		}					
	);*/
	
	bg.onload = function(){
		//graphics.drawImage(bg, 0, 0 );
	}

	count = 1;
	
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
		patternList.AddPattern(enemyList, 1);
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
	graphics.save();		//sauvegarder le contexte
	graphics.drawImage(bg, 0, 0 );

			////// Dessin des personnages
	player.Draw(graphics);
	for (var i = 0; i < enemyList.length; i++)
	{
		enemyList[i].Draw(graphics);
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















