/*global mapList*/
/*global story*/

//////////////////// ITEM ///////////////////

function getIMGITEM(name){
	var itemIMG = new Image();
	itemIMG.src = "../items/" + name + ".png";
	var itemReady = false;
	itemIMG.onload = function(){itemReady = true;};

	this.img = itemIMG;
	this.ready = itemReady;
}

function animateITEM(w, h, sequenceSet, fps, fpr){
	this.width = w;
	this.height = h;
	this.sequenceSet = sequenceSet;
	this.fps = fps;            //frame speed
  	this.fpr = fpr;            //# of frames per row
  	this.ct = 0;
  	this.curFrame = 0;
	this.curSeq = sequenceSet[0];
}

function animSet(name, sequence){
	this.name = name;
	this.sequence = sequence;
}

function ITEM(name, x, y, ba=null, text=null, thru=false, show=true, animation=null){
	var set = new getIMGITEM(name);

	this.name = name;
	this.x = x;
	this.y = y;
	this.area = ba;
	this.text = text;
	this.thru = thru;
	this.show = show;
	this.animation = animation;

	this.img = set.img;
	this.ready = set.ready;
}

//area for collision (x and y are relative to the object starting from the top right)
function boundArea(x, y, w, h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}



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

  //interaction variables
  this.board = false;
  this.text = ["I AM ERROR"];
  this.move = "drunk_walk";
  this.wt = 0;
  this.interact = false;
  this.boundArea;
  this.pathQueue = [];
  this.lastPos = [];
  this.following = false;
  this.emotion = "";

  //movement
  this.speed = 1;
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
  this.seqlength = 4;
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

//separate building into top half and lower half 
// which are rendered at different layers

function PLACE(name, x, y, boundary=null, thru=false){
	this.name = name;
	this.x = x;
	this.y = y;
	this.area = boundary;
	this.thru = thru;

	var set = new getIMGBuild(name);
	this.img = set.img;
	this.ready = set.ready;
}

function TELEPORT(ax, ay, dest, dx, dy, dir){
	this.ax = ax;
	this.ay = ay;
	this.dest = dest;
	this.dx = dx;
	this.dy = dy;
	this.dir = dir;
}

/////////////////////// LEVEL ////////////////////

function levelDat(name, quad, sect, buildings, chars, items, teleports, initFunc){
	this.name = name;
	this.quad = quad;
	this.sect = sect;
	this.buildings = buildings;
	this.chars = chars;
	this.items = items;
	this.teleports = teleports;
	this.initFunc = initFunc;
	
	this.map = getMap(this.name);
}

function getMap(name){
  for(var d=0;d<mapList.length;d++){
    bMap = mapList[d];
    if(name === bMap.name){
      return bMap;
    }
  }
  return null;
}

//function ITEM(name, x, y, ba=null, text=null, thru=false, show=true, animation=null){


var levelList = [
	//moon places
	new levelDat("moon", "q1", "newton",
			[new PLACE("capsule_crash_top", 10, 15, null),
			 new PLACE("capsule_crash_bottom", 10, 21, new boundArea(1, 0, 7, 1), true)],
			[],
			[],
			[new TELEPORT(14, 22, "shuttle", 10, 14)],
			function(){return;}
			),
	new levelDat("moon", "q2", "newton", 
			[new PLACE("vals_ship", 24, 15)], 
			[new NPC("damon", 26, 24)],
			[new ITEM("vals_shadow", 24.5, 16.5),
			 new ITEM("beam", 27, 22, null, null, false, true, 
			 	new animateITEM(32, 32, [new animSet("active", [0,1])], 25, 2))],
			[new TELEPORT(27, 23, "vals", 10, 13, "south"),
			 new TELEPORT(28, 23, "vals", 10, 13, "south")],
			function(){this.chars[0].boundary = new boundArea(0, 0, 40, 40);
				this.chars[0].text = ["Damon: Yo bro"];
			}
			),
	new levelDat("moon", "q3", "newton",
			[],
			[new NPC("damon", 12, 7)],
			[],
			[],
			function(){return;}
			),
	new levelDat("moon", "q4", "newton",
			[],
			[],
			[],
			[],
			function(){return;}
			),

	//interior places
	new levelDat("vals", "q2", "newton",
			[],
			[new NPC("mr_val", 12, 7)],
			[new ITEM("oven", 5, 4, new boundArea(0, 2, 3, 1), ["WHOA! That's a hot pizza!"], true),
				new ITEM("pizza_stack_tall", 8, 4, new boundArea(0, 2, 1, 1), ["A leaning tower of pizza"], true),
				new ITEM("pizza_stack_med", 9, 5, new boundArea(0, 1, 1, 1), ["A leaning tower of pizza"], true),
				new ITEM("pizza_stack_med", 4, 12, new boundArea(0, 1, 1, 2), ["Someone is a master pizza box stacker"]),
				new ITEM("pizza_stack_layer3", 4, 12, new boundArea(0, 1, 1, 2), ["Lots of boxes"]),
				new ITEM("pizza_stack_layer3", 5, 11, new boundArea(0, 1, 1, 2), ["Lots of boxes"], true),
				new ITEM("pizza_stack_med", 6, 9, new boundArea(0, 1, 1, 1), ["Mmm... pizza...."]),
				new ITEM("pizza_mtn", 4, 8, new boundArea(0, 0, 2, 3), ["How high can you get on this mountain of pizza?"]),
				new ITEM("counter_top", 13, 5, new boundArea(0, 1, 2, 1), null, true),
				new ITEM("counter_right", 15, 5, new boundArea(0, 0, 1, 4), null),
				new ITEM("fridge", 10, 5, new boundArea(0, 0, 3, 2), ["So cold..."], true),
				new ITEM("phone_table", 15, 9, new boundArea(0, 0, 1, 2), ["*RIIIIING*", "Is this the Krusty Krab?", "*CLICK*"])
				],
			[new TELEPORT(13, 14, "moon", 28, 24, "south")],
			function(){this.chars[0].boundary = new boundArea(10, 7, 5, 4);
						this.chars[0].text = ["Mr. Val: Ayyy! " + story.natName + "!"]}

		),
	new levelDat("shuttle", "q1", "newton",
		[],
		[new NPC("ash_" + story.gender[story.ashGen], 13, 12)],
		[new ITEM("bed", 8, 6, new boundArea(0, 0, 4, 4), ["This bed is juuuust right"], true),
		 new ITEM("rug", 8, 11, null, null,true),
		 new ITEM("library_left", 5, 5, new boundArea(0, 0, 1, 4), ["Lots of technical books"], true),

		 new ITEM("tv", 13, 6, new boundArea(0, 0, 1, 2), ["The TV's unplugged"], true, true, 
		 	new animateITEM(16, 32, [new animSet("off", [0]), new animSet("on", [1])], 2, 2)),

		 new ITEM("tool_table", 14, 12, new boundArea(0, 0, 1, 2), null, true),

		 new ITEM("instrument_rack", 5, 12, new boundArea(0, 0, 1, 2), ["It's your guitar"], true, true, 
		 	new animateITEM(16, 32, [new animSet("full", [0]), new animSet("bass_only", [1])], 2,2)),
		 new ITEM("table_vert", 14, 10, new boundArea(0, 0, 1, 2), null, false),
		 new ITEM("clock", 13, 4.5),
		 new ITEM("painting_1", 8.5, 4)],
		[new TELEPORT(10, 15, "moon", 14, 23),
		 new TELEPORT(9, 15, "moon", 14, 23)],
		function(){this.chars[0].text = [story.ashName + ": Hey bae~"];}
		)
];