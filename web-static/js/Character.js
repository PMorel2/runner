var Character = function(){

    this.revertDirection = false;

	this.spriteList = {};
	this.currentSprite = false;
	
	this.positionListenerList = [];
};

Character.prototype.addPositionListener = function(listener){
	// TODO
		this.positionListenerList.push(listener);
	
};

Character.prototype.createSprite = function(id, image, width, height, colCount, rowCount, loop){
	this.spriteList[id] = new Sprite(id, image, width, height, colCount, rowCount, loop);
	console.log("id : " + id);
};


Character.prototype.setSprite = function(anim, onComplete){
	this.lastAnimId = anim;
	var spriteId = anim;
	//console.log("new anim " + spriteId);
	if(this.currentSprite != this.spriteList[spriteId]){
		if(!this.currentSprite || this.currentSprite.loop || this.currentSprite.currentFrame == this.currentSprite.frameCount - 1){
			if(this.currentSprite){
				this.currentSprite.stop();
				this.currentSprite.hide();
			}
			console.log("sprite ID : " + spriteId);
			this.currentSprite = this.spriteList[spriteId];
			this.currentSprite.resetAnim();
			this.currentSprite.play(onComplete);
			this.currentSprite.show();
        }else{
            this.nextSprite = anim;
        }
	}
};

Character.prototype.render = function(g){
	if(this.currentSprite)
	{
		g.save();
		g.translate(this.x, this.y);
	
		this.currentSprite.render(g, this.revertDirection);
		g.restore();
	}
}

Character.prototype.setPosition = function(x, y){
	// TODO
	this.x = parseInt(x);
	this.y = parseInt(y);
/*	this.$elm.css("top", "20px");
	this.$elm.css({
		top: this.y + "px",
		left: this.x + "px"
	});*/
	
	for(var i in this.positionListenerList)
	{
		this.positionListenerList[i](this.x, this.y);
	}
	
};
Character.prototype.moveTo = function(x, y){
	var self = this;
	if(this.animHandler){
		this.animHandler.stop(false, false);
	}
	this.animHandler = $.ease({
		x: this.x,
		y: this.y
	}, {
		x: x, 
		y: y
	}, function(o){
		self.setPosition(o.x, o.y);
	},
	{
		easing: "easeOutCirc",
		duration: 300
	});
};
Character.prototype.move = function(x, y){
	this.moveTo(this.x + x, this.y + y);
};