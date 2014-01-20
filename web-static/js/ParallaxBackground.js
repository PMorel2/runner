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
		graphics.drawImage(this.Layers[i].image, this.Layers[i].x, 0);
		graphics.drawImage(this.Layers[i].image, this.Layers[i].xCopy, 0);
	}
	
	graphics.restore();

}