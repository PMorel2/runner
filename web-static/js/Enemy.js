var Enemy = function (){
	
	this.x = 400;
	this.y = 100;
	this.width = 25;
	this.height = 40;
	this.active = true;
	this.dmg = 1;
	this.speed = 80;
	this.color = "black";
}

Enemy.prototype.init = function(x, y, color){
	this.x = x;
	this.y = y;
	this.color = color;
	this.active = true;

}

Enemy.prototype.Update = function(deltaTime)
{
	this.move(deltaTime);
	
	if(this.x + this.width/2 < 0)
		this.active = false;
};

Enemy.prototype.move = function(deltaTime)
{
	this.x -= this.speed * deltaTime;
};

Enemy.prototype.Draw = function(g)
{
	g.fillStyle = this.color;
	g.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
}