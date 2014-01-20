var Layer = function(){

	this.image;
	this.x;
	this.xCopy;
	this.speed;
	this.width;
	////// Chaque couche est dessinée deux fois l'une à la suite de l'autre

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
	
	this.CheckPosition();
}

Layer.prototype.CheckPosition = function(){
	if(this.x  <= - this.width)
		this.x = this.xCopy + this.width;
	else if(this.xCopy <= - this.width)
		this.xCopy = this.x + this.width;

}