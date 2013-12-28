var Game = function(){
	var self = this;
	this.localTime = 0;
	this.globalTime = 0;
	

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
	this.graphics = this.canvas.getContext("2d");
	
	
	var sleep = 1;
	var baseUrl = "/web-static/img/getImage.php?url=";
	var imageList = {
		"background": "/web-static/img/background.jpg&sleep=" + sleep,
		"test": "/web-static/img/getImage.php?url=test.jpg&sleep=" + sleep
		/*"player-idle": baseUrl + "sprite/idle-1-2-1.png&sleep=" + sleep,
		"player-attack": baseUrl + "sprite/attack-1-2-1.png&sleep=" + sleep,
		"player-move": baseUrl + "sprite/move-1-2-1.png&sleep=" + sleep,
		"mob-idle": baseUrl + "sprite/idle-1.png&sleep=" + sleep,
		"mob-damage" : baseUrl + "sprite/damage-1.png&sleep=" + sleep,
		"mob-attack" : baseUrl + "sprite/attack-1.png&sleep=" + sleep,
		"mob-death" : baseUrl + "sprite/death-1.png&sleep=" + sleep	*/
	}; 
	
	var soundList = {};
	
	this.assetManager = new AssetManager();
	this.assetManager.startLoading(imageList, soundList);
	
	this.graphics.fillStyle = "red";
	this.graphics.fillRect(100,100, this.canvas.width, this.canvas.height);
	
	$scene = $("#main-scene");

	/*$("#gui").append($("<div>").button().css({position:"absolute",top:"5px",left:"5px"}).append("Menu").click(function(){
		$(win.root).toggle('fade', 200);
	}));
	$(win.root).hide();*/

	/*player = new Player();
	camera = new Camera(player);

	player.setPosition(3530, 1770);
	player.init();
	
	requestAnimFrame(
		function loop() {
			self.mainLoop();
			requestAnimFrame(loop);
		}					
	);*/
	
	this.bg = new Image();
	this.bg.src = '/web-static/img/background.jpg';
	
	this.graphics.drawImage(this.bg, 10, 10);
	
	self.mainLoop();
};
Game.prototype.mainLoop = function(){
	var now = Date.now();
	var globalTimeDelta = now - this.globalTime;
	var localTimeDelta = Math.min(50, globalTimeDelta);
	this.localTime += localTimeDelta;
	//player.update(localTimeDelta / 1000);
	
	this.graphics.canvas = this.canvas;
	this.graphics.drawTimeMillis = now;
	
	
	//this.graphics.clearRect(0,0, this.canvas.width, this.canvas.height);
	
	if(!this.assetManager.isDoneLoading()){
	
		this.assetManager.renderLoadingProgress(this.graphics);
	}else{
		this.graphics.save();		//sauvegarder le contexte
		//camera.render(this.graphics);
		this.graphics.clearRect(0,0, this.canvas.width, this.canvas.height);
		this.graphics.drawImage(this.assetManager.getImage("test"), 0, 0 );
	
		this.graphics.restore();	//restore le contexte
	}
};