var Enemy = function (){
	
	this.x =400;
	this.y = 400;
	this.width = 25;
	this.height = 40;
	this.active = true;
	this.dmg = 1;
	this.speed = 100;
	this.color = "red";
}

Enemy.prototype.Update = function(deltaTime)
{
	this.move(deltaTime);
};

Enemy.prototype.move = function(deltaTime)
{
	this.x -= this.speed * deltaTime;
};

Enemy.prototype.Draw = function(g)
{
	g.fillStyle = this.color;
	g.fillRect(this.x, this.y, this.width, this.height);
	console.log("drawn");
}