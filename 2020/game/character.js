var size = 32;
var spr_size = 16;

//area for collision (x and y are relative to the object starting from the top right)
function boundArea(x, y, w, h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}


//gets the sprite sheet for the character
function getIMGNPC(name){
  var charIMG = new Image();
  charIMG.src = "../sprites/" + name + ".png";

  return charIMG;

}

//character object definition
function character(name, x, y, text,skin=null){
	this.name = name;
	this.x = x*size;
	this.y = y*size;

	//movement
	this.width = spr_size;
	this.height = spr_size;
	this.dir = "north";
	this.action = "idle";

	this.speed = 1;
	this.initPos = 0;
	this.moving = false;
	this.velX = 0;
	this.velY = 0;
	this.move = "drunk_walk";
	this.mt = 0;

	//interactions
	this.text = text;
	this.text_index = 0;
	this.interact = false;
	this.boundary = new boundArea(4,4,8,12);
	this.wt = 0;

	this.img = new getIMGNPC((skin == null ? name : skin));
	this.show = true;

	//animations
	this.fps = 10;            //frame speed
	this.fpr = 3;            //# of frames per row
	this.seqlength = 2;		
	this.curFrame = 0;
	this.ct = 0;


	this.idleNorth = [3,3];
	this.idleSouth = [0,0];
	this.idleWest = [6,6];
	this.idleEast = [9,9];
	this.moveNorth = [4,5];
	this.moveSouth = [1,2];
	this.moveWest = [7,8];
	this.moveEast = [10,11];
}


//draw a character sprite
function drawsprite(sprite, ctx){
	updatesprite(sprite);
	rendersprite(sprite, ctx);
}

//update animation
function updatesprite(sprite){
	//update the frames
	if(sprite.ct == (sprite.fps - 1))
		sprite.curFrame = (sprite.curFrame + 1) % sprite.seqlength;
		
	sprite.ct = (sprite.ct + 1) % sprite.fps;
}
//draw the sprite
function rendersprite(sprite, ctx){
	//set the animation sequence
	var sequence;
	if(sprite.dir == "north"){
		if(sprite.action == "idle")
			sequence = sprite.idleNorth;
		else 
			sequence = sprite.moveNorth;
	}
	else if(sprite.dir == "south"){
		if(sprite.action == "idle")
			sequence = sprite.idleSouth;
		else 
			sequence = sprite.moveSouth;
	}
	else if(sprite.dir == "west"){
		if(sprite.action == "idle")
			sequence = sprite.idleWest;
		else 
			sequence = sprite.moveWest;
	}
	else if(sprite.dir == "east"){
		if(sprite.action == "idle")
			sequence = sprite.idleEast;
		else 
			sequence = sprite.moveEast;
	}
	
	//get the row and col of the current frame
	var row = Math.floor(sequence[sprite.curFrame] / sprite.fpr);
	var col = Math.floor(sequence[sprite.curFrame] % sprite.fpr);

	var sprIMG = sprite.img;

	if(sprite.show && sprite.img.width > 0){
		ctx.drawImage(sprIMG, 
		col * sprite.width, row * sprite.height, 
		sprite.width, sprite.height,
		sprite.x, sprite.y, 
		size, size);
	}
}