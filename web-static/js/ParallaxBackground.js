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
			console.log("L1 drawn : " + i);
			graphics.drawImage(this.Layers[i].image, this.Layers[i].x, 0);
			}
		
		if(this.Layers[i].xCopy <= 800 && this.Layers[i].xCopy + this.Layers[i].width >= 0){
			console.log("L2 drawn : " + i);
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