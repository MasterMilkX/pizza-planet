////////////////////  NPC  //////////////////


function getIMGNPC(name){

  var charIMG = new Image();
  charIMG.src = "../beta_sprites/" + name + ".png";
  var charReady = false;
  charIMG.onload = function(){charReady = true;};

  this.img = charIMG;
  this.ready = charReady;

}


//npc object
function NPC(name, x, y){
  var set = new getIMGNPC(name);

  //sprite properties
  this.name = name;
  this.width = 16;
  this.height = 20;
  this.dir = "south";
  this.action= "idle";
  this.img = set.img;
  this.ready = set.ready;
  this.offsetX = 0;
  this.offsetY = 4;
  this.board = false;

  //movement
  this.speed = 0.5;
  this.initPos = 0;
  this.moving = false;
  this.x = x * 16; 
  this.y = y * 16;
  this.velX = 0;
  this.velY = 0;
  this.fps = 4;            //frame speed
  this.fpr = 12;           //# of frames per row
  this.show = true;
  
  //animation
  this.idleNorth = [4,4,4,4];
  this.idleSouth = [1,1,1,1];
  this.idleWest = [7,7,7,7];
  this.idleEast = [10,10,10,10];
  this.moveNorth = [3,4,5,4];
  this.moveSouth = [0,1,2,1];
  this.moveWest = [6,7,8,7];
  this.moveEast = [9,10,11,10];
  this.curFrame = 0;
  this.ct = 0;
}

////////////////////////  PLACE  ///////////////////////////

function getIMGBuild(name){

  var buildIMG = new Image();
  buildIMG.src = "../buildings/" + name + ".png";
  var buildReady = false;
  buildIMG.onload = function(){buildReady = true;};

  this.img = buildIMG;
  this.ready = buildReady;

}

function PLACE(name, x, y, tx, ty, thru){
	this.name = name;
	this.x = x;
	this.y = y;
	this.tx = tx;		//entrance x
	this.ty = ty;		//entrance y
	this.thru = thru;

	var set = new getIMGBuild(name);
	this.img = set.img;
	this.ready = set.ready;
}

/////////////////////// LEVEL ////////////////////

function levelDat(name, quad, sect, buildings, chars){
	this.name = name;
	this.quad = quad;
	this.sect = sect;
	this.buildings = buildings;
	this.chars = chars;
}

var levelList = [
	//moon places
	new levelDat("moon", "q1", "NEWTON",
			[new PLACE("capsule_crash", 10, 15, [5,6], [7], false)],
			[]),
	new levelDat("moon", "q2", "NEWTON", 
			[new PLACE("vals_ship", 24, 15, [5,6], [7], false)], 
			[]),
	new levelDat("moon", "q3", "NEWTON",
			[],
			[new NPC("damon", 12, 7)]),
	new levelDat("moon", "q4", "NEWTON",
			[],
			[]),

	//interior places
	new levelDat("vals", "q2", "NEWTON",
			[],
			[new NPC("mr_val", 12, 7)])
];