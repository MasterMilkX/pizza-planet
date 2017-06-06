function getIMG(name){

  var buildIMG = new Image();
  buildIMG.src = "../beta_sprites/" + name + ".png";
  var buildReady = false;
  buildIMG.onload = function(){buildReady = true;};

  this.img = buildIMG;
  this.ready = buildReady;

}

function PLACE(name, x, y, tx, ty, thru){
	this.name = name;
	this.x = x;
	this.y = y;
	this.tx = tx;
	this.ty = ty;
	this.thru = thru;

	var set = new getIMG(name);
	this.img = set.img;
	this.ready = true;
}