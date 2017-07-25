//Global variables
/*global levelList */
/*global story*/

//set up the canvas
var canvas = document.createElement("canvas");
canvas.id = "game";
var ctx = canvas.getContext("2d");
canvas.width = 320;
canvas.height = 320;
document.body.appendChild(canvas);

//background image
var bgPNG = new Image();
bgPNG.src = "../beta_sprites/q2.png";
bgPNG.onload = function(){
  ctx.drawImage(bgPNG, 0, 0);
};

//level
var map = [];
var curQuad = "q2";
var curSect = "newton";
var curLvl;
var boundVal = 1;
var collideTiles = [1];
var teleportTriggers = [];

//pre-set map
/*
map = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ];
*/

var rows = 40;
var cols = 40;
var size = 16;
var level_loaded = false;
var tiles = new Image();
tiles.src = "../tilesets/moon.png";
var tilesReady = false;
tiles.onload = function(){
  tilesReady = true;
};
var tpr = 3; //tiles per row

//player
var natIMG  = new Image();
natIMG.src = "../beta_sprites/nat_" + story.gender[story.natGen] + ".png";
var natReady = false;
natIMG.onload = function(){natReady = true;};

var hoverIMG  = new Image();
hoverIMG.src = "../beta_sprites/hover-nat_" + story.gender[story.natGen] + ".png";
var hoverReady = false;
hoverIMG.onload = function(){hoverReady = true;};

var nat = {
  //sprite properties
  width : 16,
  height : 20,
  dir : "south",
  action : "idle",
  img : natIMG,
  ready : natReady,
  offsetX : 0,
  offsetY : 4,

  //movement
  speed : 1,
  initPos : 0,
  moving : false,
  x : 20 * size, 
  y : 15 * size,
  velX : 0,
  velY : 0,
  fps : 9,            //frame speed
  fpr : 12,            //# of frames per row
  show : true,

  //other properties
  interact : false,
  other : null,
  pathQueue : [],
  lastPos : [],
  following : false,

  //hoverboard
  board : false, 
  hover_height: 24,
  hover_offsetY : 8,
  hover_speed : 2,
  hover_img : hoverIMG,
  hover_ready : hoverReady,

  //walk animation
  idleNorth : [4,4,4,4],
  idleSouth : [1,1,1,1],
  idleWest : [7,7,7,7],
  idleEast : [10,10,10,10],

  //movement animation
  moveNorth : [3,4,5,4],
  moveSouth : [0,1,2,1],
  moveWest : [6,7,8,7],
  moveEast : [9,10,11,10],

  seqlength : 4,
  curFrame : 0,
  ct : 0
};

//camera
var camera = {
  x : 0,
  y : 0
};

//gui
var dialogIMG = new Image();
dialogIMG.src = '../gui/dialog.png';
var dialogReady = false;
dialogIMG.onload = function(){dialogReady = true;};

var optionIMG = new Image();
optionIMG.src = "../gui/choice_box.png";
var optionReady = false;
optionIMG.onload = function(){optionReady = true;};

var selectIMG = new Image();
selectIMG.src = "../gui/select_box.png";
var selectReady = false;
selectIMG.onload = function(){selectReady = true;};

var inventoryIMG = new Image();
inventoryIMG.src = "../gui/inventory.png";
var inventoryReady = false;
inventoryIMG.onload = function(){inventoryReady = true;};

//music
var bg_music = new Audio("../music/Night Theme.mp3");
bg_music.loop = true;
bg_music.volume = .50;
bg_music.load();
//bg_music.autoplay = true;

//controls
function key(code){
  this.code = code;
  this.press = false;
  this.tick = 0;
}

var upKey = 38;     //[Up]
var leftKey = 37;   //[Left]
var rightKey = 39;  //[Rigt]
var downKey = 40;   //[Down]
var moveKeySet = [upKey, leftKey, rightKey, downKey];

var z_key = 90;   //[Z]
var x_key = 88;   //[X]
var c_key = 67;   //[X]
var a_key = 65;   //[A]
var s_key = 83;   //[S]
var actionKeySet = [z_key, x_key, a_key, s_key, c_key];
var keys = [];

//add-ins
var npcs = [];
var buildings = [];
var items = [];

story.nat = nat;


//////////////////    GENERIC FUNCTIONS   ///////////////



//checks if an element is in an array
function inArr(arr, e){
  if(arr.length == 0)
    return false;
  return arr.indexOf(e) !== -1
}



//////////////////    LEVEL FUNCTIONS   //////////////



//resets the lists for the objects
function reset(){
  npcs = [];
  buildings = [];
  items = [];
  teleportTriggers = [];
}

//create eeverything needed for the next level
function loadLevel(aLevel, px, py, dir=null){
  //reset everything
  reset();
  curLvl = aLevel.name;
  story.level = aLevel;

  //reset nat's position
  nat.x = px;
  nat.y = py;
  if(dir)
    nat.dir = dir;

  //construct buildings
  for(var b=0;b<aLevel.buildings.length;b++){
    buildings.push(aLevel.buildings[b]);
  }

  //make new characters
  for(var c=0;c<aLevel.chars.length;c++){
    npcs.push(aLevel.chars[c]);
  }

  //add new items
  for(var i=0;i<aLevel.items.length;i++){
    items.push(aLevel.items[i]);
  }

  teleportTriggers = aLevel.teleports;

  //make a moon level
  if(aLevel.name === "moon"){
    blankMoon(aLevel.quad);
    console.log("moon loaded");
    return;
  }

  var aMap = aLevel.map

  //reset rows and cols
  rows = aMap.rows;
  cols = aMap.cols;
  collideTiles = aMap.collision;
  teleportTriggers = aLevel.teleports;

  loadMap(aMap);

  story.area = aMap.name;
  //bg_music.play();
  aLevel.initFunc();
  console.log("level loaded");

}




//////////////////   MAP FUNCTIONS  /////////////////




//makes the moon level
function blankMoon(quadrant){
  //reset background
  bgPNG.src = "../beta_sprites/" + quadrant + ".png";
  bgPNG.onload = function(){
    ctx.drawImage(bgPNG, 0, 0);
  };

  rows = 40;
  cols = 40;
  collideTiles = [boundVal];

  //reset map
  map = [];
  level_loaded = false;
  for(var y = 0; y < rows; y++){
    var r = [];
    for(var x = 0; x < cols; x++){
      r.push(0);
    }
    map.push(r);
  }

  //ready the tiles
  tiles.src = "../tilesets/moon.png";
  tilesReady = false;
  tiles.onload = function(){
    tilesReady = true;
  };
  tpr = 3;

  //finish
  var edge;
  if(quadrant === "q1")
    edge = q1_space_edges;
  else if(quadrant === "q2")
    edge = q2_space_edges;
  else if(quadrant === "q3")
    edge = q3_space_edges;
  else if(quadrant === "q4")
    edge = q4_space_edges;
  mapEdge(edge);
  curQuad = quadrant;

  story.area = curQuad + "_" + curSect;
  level_loaded = true;

  //reset camera
  resetCamera();
}

function loadMap(lvlmap){
  //reset background
  bgPNG.src = "../beta_sprites/blank.png";
  bgPNG.onload = function(){
    ctx.drawImage(bgPNG, 0, 0);
  };

  //load the map from mapList
  map = [];
  level_loaded = false;
  for(var y = 0; y < rows; y++){
    var r = [];
    for(var x = 0; x < cols; x++){
      r.push(lvlmap.map[y][x]);
      //r.push(1);
    }
    map.push(r);
  }

  //ready the tiles
  tiles.src = lvlmap.tileset.src;
  tilesReady = lvlmap.ready;
  tpr = lvlmap.tpr;

  level_loaded = true;

  //reset camera
  resetCamera();
}

//if at the edge of space
function mapEdge(edgeset){
  for(var i=0; i<edgeset.length; i++){
    var edge = edgeset[i];
    map[edge[1]][edge[0]] = boundVal;
  }
}

//if at the edge of the quadrant
function quadChange(quadrant){
  var halfTile = size / 2;

  if(quadrant === "q1"){
    if(nat.x <= -halfTile){                            //edge of west side
      newQuadrant("q2","west");
    }else if(nat.y >= ((rows * size) - halfTile)){     //edge of south side
      newQuadrant("q4", "south");
    }
  }else if(quadrant === "q2"){
    if(nat.x >= ((cols * size) - halfTile)){           //edge of east side
      newQuadrant("q1", "east");
    }else if(nat.y >= ((rows * size) - halfTile)){     //edge of south side
      newQuadrant("q3", "south");
    }
  }else if(quadrant === "q3"){
    if(nat.y <= -halfTile){                           //edge of north side
      newQuadrant("q2", "north");
    }else if(nat.x >= ((cols * size) - halfTile)){     //edge of east side
      newQuadrant("q4", "east");
    }
  }else if(quadrant === "q4"){
    if(nat.y <= -halfTile){                           //edge of north side
      newQuadrant("q1", "north");
    }else if(nat.x <= -halfTile){                            //edge of west side
      newQuadrant("q3","west");
    }
  }
}

//go to the next quadrant
function newQuadrant(new_quad, direction){
  var halfTile = size / 2;
  if(direction == "north"){             //spawn at the bottom
    nat.y = rows * size - halfTile;
    nat.initPos = rows * size;
  }else if(direction == "south"){       //spawn at the top
    nat.y = -halfTile;
    nat.initPos = -size;
  }else if(direction == "west"){        //spawn at the right
    nat.x = cols * size - halfTile;
    nat.initPos = cols * size;
  }else if(direction == "east"){        //spawn at the left
    nat.x = -halfTile;
    nat.initPos = -size;
  }

  //look for next leveldata
  var lvl;
  for(var a = 0;a<levelList.length;a++){
    var bLvl = levelList[a];
    if(bLvl.name === "moon" && bLvl.quad === new_quad && bLvl.sect === curSect){
      lvl = bLvl;
      break;
    }
  }
  loadLevel(lvl, nat.x, nat.y);
}

//retrieves level data by name
function getLevel(name){
  //look for next leveldata
  var lvl;
  for(var a = 0;a<levelList.length;a++){
    var bLvl = levelList[a];
    if(bLvl.name === name && bLvl.quad === curQuad && bLvl.sect === curSect){
      return bLvl;
    }
  }
}

//teleports to a new level based on teleportTriggers
function beamMeUp(){
   //get the positions
  var rx;
  var ry;
  if(nat.dir === "north" || nat.dir === "west"){
    rx = Math.ceil(nat.x / size);
    ry = Math.ceil(nat.y / size);
  }else if(nat.dir === "south" || nat.dir === "east"){
    rx = Math.floor(nat.x / size);
    ry = Math.floor(nat.y / size);
  }

  for(var t=0;t<teleportTriggers.length;t++){
    var trig = teleportTriggers[t];
    if((rx == trig.ax) && (ry == trig.ay)){
      //console.log("LET'S TELEPORT!");
    
      nat.initPos = 0;
      nat.velX = nat.velY = 0;
      nat.action = "idle";
      nat.moving = false;
      
      loadLevel(getLevel(trig.dest), trig.dx*size, trig.dy*size, trig.dir);
    }
  }
}




//////////////////  PLAYER CONTROLS /////////////////



//directional movement
function goNorth(sprite){
  if(!sprite.moving){
    sprite.initPos = Math.floor(sprite.y / size) * size;
    if(!story.cutscene)
      sprite.lastPos = [Math.floor(sprite.x / size), Math.floor(sprite.y / size)];
    sprite.dir = "north";
    sprite.action = "travel";
  }
}
function goSouth(sprite){
  if(!sprite.moving){
    sprite.initPos = Math.floor(sprite.y / size) * size;
    if(!story.cutscene)
      sprite.lastPos = [Math.floor(sprite.x / size), Math.floor(sprite.y / size)];
    sprite.dir = "south";
    sprite.action = "travel";
  }
}
function goEast(sprite){
  if(!sprite.moving){
    sprite.initPos = Math.floor(sprite.x / size) * size;
    if(!story.cutscene)
      sprite.lastPos = [Math.floor(sprite.x / size), Math.floor(sprite.y / size)];
    sprite.dir = "east";
    sprite.action = "travel";
  }
}
function goWest(sprite){
  if(!sprite.moving){
    sprite.initPos = Math.floor(sprite.x / size) * size;
    if(!story.cutscene)
      sprite.lastPos = [Math.floor(sprite.x / size), Math.floor(sprite.y / size)];
    sprite.dir = "west";
    sprite.action = "travel";
  }
}

//movement on the map
function travel(sprite){
  if(sprite.action == "travel"){   //continue if allowed to move
    var curspeed = (sprite.board ? sprite.hover_speed : sprite.speed);

    //travel north
    if(sprite.dir == "north"){
      if(Math.floor(sprite.y) > (sprite.initPos - size) && !collide(sprite)){
        sprite.velY = curspeed;
        sprite.y += velControl(Math.floor(sprite.y), -sprite.velY, (sprite.initPos - size));
        sprite.moving = true;
      }else{
        sprite.velY = 0;
        sprite.action = "idle";
        sprite.moving = false;
      }
    }else if(sprite.dir == "south"){
      if(Math.floor(sprite.y) < (sprite.initPos + size) && !collide(sprite)){
        sprite.velY = curspeed;
        sprite.y += velControl(Math.floor(sprite.y), sprite.velY, (sprite.initPos + size));
        sprite.moving = true;
      }else{
        sprite.velY = 0;
        sprite.action = "idle";
        sprite.moving = false;
      }
    }else if(sprite.dir == "east"){
      if(Math.floor(sprite.x) < (sprite.initPos + size) && !collide(sprite)){
        sprite.velX = curspeed;
        sprite.x += velControl(Math.floor(sprite.x), sprite.velX, (sprite.initPos + size));
        sprite.moving = true;
      }else{
        sprite.velX = 0;
        sprite.action = "idle";
        sprite.moving = false;
      }
    }else if(sprite.dir == "west"){
      if(Math.floor(sprite.x) > (sprite.initPos - size) && !collide(sprite)){
        sprite.velX = curspeed;
        sprite.x += velControl(Math.floor(sprite.x), -sprite.velX, (sprite.initPos - size));
        sprite.moving = true;
      }else{
        sprite.velX = 0;
        sprite.action = "idle";
        sprite.moving = false;
      }
    }
  }
}

//velocity control
function velControl(cur, value, max){
  //increment or decrement
  if(value > 0){
    if((cur + value) > max)
      return velControl(cur, Math.floor(value/2), max);
    else
      return value;
  }else if(value < 0){
    if((cur + value) < max)
      return velControl(cur, Math.floor(value/2), max);
    else
      return value;
  }else{
    return 1;
  }
}




/////////////////   COLLISIONS   ////////////////////



//if hit a collision point on the wall
function hitWall(person){
  if(!level_loaded)
    return false;

  //get the positions
  var rx;
  var ry;
  if(person.dir === "north" || person.dir === "west"){
    rx = Math.ceil(person.x / size);
    ry = Math.ceil(person.y / size);
  }else if(person.dir === "south" || person.dir === "east"){
    rx = Math.floor(person.x / size);
    ry = Math.floor(person.y / size);
  }
  

  //edge of map = undecided
  if(rx-1 < 0 || rx+1 >= cols || ry-1 < 0 || ry+1 >= cols)
    return;

  //decide if adjacent to person
  if(person.dir == "north" && inArr(collideTiles, map[ry-1][rx]))
    return true;
  else if(person.dir == "south" && inArr(collideTiles, map[ry+1][rx]))
    return true;
  else if(person.dir == "east" && inArr(collideTiles, map[ry][rx+1]))
    return true;
  else if(person.dir == "west" && inArr(collideTiles, map[ry][rx-1]))
    return true;
  else
    return false;
}

//if hit a boundary area if the building
function hitBuilding(person){
  //get the positions
  var rx;
  var ry;
  if(person.dir === "north" || person.dir === "west"){
    rx = Math.ceil(person.x / size);
    ry = Math.ceil(person.y / size);
  }else if(person.dir === "south" || person.dir === "east"){
    rx = Math.floor(person.x / size);
    ry = Math.floor(person.y / size);
  }
  
  //decide if adjacent to person
  var ouch = false;
  for(var i=0;i<buildings.length;i++){
    var t = buildings[i];
    var t_ba = t.area;

    if(t.area == null)
      continue;

    //get bounding box area
    var xArea = [];
    for(var z=0;z<t_ba.w;z++){
      xArea.push(t_ba.x+t.x+z);
    }
    var yArea = [];
    for(var z=0;z<t_ba.h;z++){
      yArea.push(t_ba.y+t.y+z);
    }

    //console.log(xArea + "\t" + yArea);


    if(person.dir == "north" && inArr(xArea, rx) && inArr(yArea, ry-1))
      ouch = true;
    else if(person.dir == "south" && inArr(xArea, rx) && inArr(yArea, ry+1))
      ouch = true;
    else if(person.dir == "east" && inArr(xArea, rx+1) && inArr(yArea, ry))
      ouch = true;
    else if(person.dir == "west" && inArr(xArea, rx-1) && inArr(yArea, ry))
      ouch = true;
  }
  return ouch;
}

//if hit another person
function hitNPC(person){

  //get the positions
  var rx;
  var ry;
  if(person.dir === "north" || person.dir === "west"){
    rx = Math.ceil(person.x / size);
    ry = Math.ceil(person.y / size);
  }else if(person.dir === "south" || person.dir === "east"){
    rx = Math.floor(person.x / size);
    ry = Math.floor(person.y / size);
  }

  //decide if adjacent to person
  var ouch = false;
  for(var i=0;i<npcs.length;i++){
    var n = npcs[i];

    if(n == person)
      continue;

    nx = Math.floor(n.x / size);
    ny = Math.floor(n.y / size);

    if(person.dir == "north" && (rx == nx) && (ry-1 == ny))
      ouch = true;
    else if(person.dir == "south" && (rx == nx) && (ry+1 == ny))
      ouch = true;
    else if(person.dir == "east" && (rx+1 == nx) && (ry == ny))
      ouch = true;
    else if(person.dir == "west" && (rx-1 == nx) && (ry == ny))
      ouch = true;
  }
  return ouch;
}

//if hit an item's boundary
function hitItem(person){
  //get the positions
  var rx;
  var ry;
  if(person.dir === "north" || person.dir === "west"){
    rx = Math.ceil(person.x / size);
    ry = Math.ceil(person.y / size);
  }else if(person.dir === "south" || person.dir === "east"){
    rx = Math.floor(person.x / size);
    ry = Math.floor(person.y / size);
  }
  
  //decide if adjacent to person
  var ouch = false;
  for(var i=0;i<items.length;i++){
    var t = items[i];
    var t_ba = t.area;
    if(t_ba == null)
      continue;

    //get bounding box area
    var xArea = [];
    for(var z=0;z<t_ba.w;z++){
      xArea.push(t_ba.x+t.x+z);
    }
    var yArea = [];
    for(var z=0;z<t_ba.h;z++){
      yArea.push(t_ba.y+t.y+z);
    }

    //console.log(xArea + "\t" + yArea);


    if(person.dir == "north" && inArr(xArea, rx) && inArr(yArea, ry-1))
      ouch = true;
    else if(person.dir == "south" && inArr(xArea, rx) && inArr(yArea, ry+1))
      ouch = true;
    else if(person.dir == "east" && inArr(xArea, rx+1) && inArr(yArea, ry))
      ouch = true;
    else if(person.dir == "west" && inArr(xArea, rx-1) && inArr(yArea, ry))
      ouch = true;
  }
  return ouch;

}

//if hit a specific boundary area
function hitBoundary(sprite, boundary){
  //boundary in the form [x,y,w,h]
  if(boundary == null){
    return false;
  }
  
  //get the positions
  var rx;
  var ry;
  if(sprite.dir === "north" || sprite.dir === "west"){
    rx = Math.ceil(sprite.x / size);
    ry = Math.ceil(sprite.y / size);
  }else if(sprite.dir === "south" || sprite.dir === "east"){
    rx = Math.floor(sprite.x / size);
    ry = Math.floor(sprite.y / size);
  }
  

  //edge of map = undecided
  if(rx-1 < 0 || rx+1 >= cols || ry-1 < 0 || ry+1 >= cols)
    return;

  //get bounding box area
  var xArea = [];
  for(var z=0;z<boundary.w;z++){
    xArea.push(boundary.x+z);
  }
  var yArea = [];
  for(var z=0;z<boundary.h;z++){
    yArea.push(boundary.y+z);
  }

  //console.log(xArea + "\t" + yArea);

  if(sprite.dir == "north" && (!inArr(xArea, rx) || !inArr(yArea, ry-1)))
    return true;
  else if(sprite.dir == "south" && (!inArr(xArea, rx) || !inArr(yArea, ry+1)))
    return true;
  else if(sprite.dir == "east" && (!inArr(xArea, rx+1) || !inArr(yArea, ry)))
    return true;
  else if(sprite.dir == "west" && (!inArr(xArea, rx-1) || !inArr(yArea, ry)))
    return true;
  
  return false;
}

//if hit another generic object
function hitOther(sprite, other){
  //get the positions
  var rx;
  var ry;
  if(sprite.dir === "north" || sprite.dir === "west"){
    rx = Math.ceil(sprite.x / size);
    ry = Math.ceil(sprite.y / size);
  }else if(sprite.dir === "south" || sprite.dir === "east"){
    rx = Math.floor(sprite.x / size);
    ry = Math.floor(sprite.y / size);
  }

  //decide if adjacent to sprite
  var nx = Math.floor(other.x / size);
  var ny = Math.floor(other.y / size);

  if(sprite.dir == "north" && (rx == nx) && (ry-1 == ny))
    return true;
  else if(sprite.dir == "south" && (rx == nx) && (ry+1 == ny))
    return true;
  else if(sprite.dir == "east" && (rx+1 == nx) && (ry == ny))
    return true;
  else if(sprite.dir == "west" && (rx-1 == nx) && (ry == ny))
    return true;

  return false;
}


//grouped collision checker
function collide(sprite, boundary=null){
  //disable if cutscenes on
  if(story.cutscene)
    return false;
  //otherwise continue
  return hitNPC(sprite) || hitItem(sprite) || hitWall(sprite) || hitBuilding(sprite) || hitBoundary(sprite, boundary)
}



///////////////   INTERACT   ////////////////



//the interact function
function canInteract(person, item){
  //get the positions
    var rx;
    var ry;
    if(person.dir === "north" || person.dir === "west"){
      rx = Math.ceil(person.x / size);
      ry = Math.ceil(person.y / size);
    }else if(person.dir === "south" || person.dir === "east"){
      rx = Math.floor(person.x / size);
      ry = Math.floor(person.y / size);
    }
  
    //decide if adjacent to person
    var t = item;
    var xArea = [];
    var yArea = [];
    if(t.area !== null){
      var t_ba = item.area;

      //get bounding box area
      for(var z=0;z<t_ba.w;z++){
        xArea.push(t_ba.x+t.x+z);
      }
      for(var z=0;z<t_ba.h;z++){
        yArea.push(t_ba.y+t.y+z);
      }
    }else{
      xArea.push(t.x);
      yArea.push(t.y);
    }
    

    //determine if able to interact
    if(person.dir == "north" && (inArr(xArea, rx) && inArr(yArea, ry-1)))
      return true;
    else if(person.dir == "south" && (inArr(xArea, rx) && inArr(yArea, ry+1)))
      return true;
    else if(person.dir == "east" && (inArr(xArea, rx+1) && inArr(yArea, ry)))
      return true;
    else if(person.dir == "west" && (inArr(xArea, rx-1) && inArr(yArea, ry)))
      return true;
  
  return false;
}

//the talk function
function canTalk(person, other_pers){
  if(other_pers.moving)
    return false;

  //get the positions
    var rx;
    var ry;
    if(person.dir === "north" || person.dir === "west"){
      rx = Math.ceil(person.x / size);
      ry = Math.ceil(person.y / size);
    }else if(person.dir === "south" || person.dir === "east"){
      rx = Math.floor(person.x / size);
      ry = Math.floor(person.y / size);
    }
  
    //decide if adjacent to person
    nx = Math.floor(other_pers.x / size);
    ny = Math.floor(other_pers.y / size);

    if(person.dir == "north" && (rx == nx) && (ry-1 == ny))
      return true;
    else if(person.dir == "south" && (rx == nx) && (ry+1 == ny))
      return true;
    else if(person.dir == "east" && (rx+1 == nx) && (ry == ny))
      return true;
    else if(person.dir == "west" && (rx-1 == nx) && (ry == ny))
      return true;
}

//faces the main character
function faceOpposite(npc){
  if(nat.dir === "north")
    npc.dir = "south";
  else if(nat.dir === "south")
    npc.dir = "north"
  else if(nat.dir === "west")
    npc.dir = "east"
  else if(nat.dir === "east")
    npc.dir = "west"
}

//non-cutscene specific behavior
function defaultBehavior(npc){
  if(!story.cutscene){
    if(npc.interact){
      clearInterval(npc.wt);
      npc.wt = 0;
    }
    if(npc.move === "drunk_walk" && !npc.interact && npc.show){
      if(npc.wt == 0 && !npc.moving){
        npc.wt = setInterval(function(){
          drunkardsWalk(npc, npc.boundary);
          clearInterval(npc.wt);
          npc.wt = 0;
        }, (Math.random() * 2 + 1)*1000);
      }
    }
  }else{
    clearInterval(npc.wt);
    npc.wt = 0;
  }
}



///////////////////   CAMERA  /////////////////////


//if within the game bounds
function withinBounds(x,y){
  var xBound = (x >= Math.floor(camera.x / 16) - 1) && (x <= Math.floor(camera.x / 16) + (canvas.width / 16));
  return xBound;
}

//have the camera follow the player
function panCamera(){
  if(level_loaded){   //map filled?
    //camera displacement
    if((nat.x >= (canvas.width / 2)) && (nat.x <= (map[0].length * size) - (canvas.width / 2)))
        camera.x = nat.x - (canvas.width / 2);

    if((nat.y >= (canvas.height / 2)) && (nat.y <= (map.length * size) - (canvas.height / 2)))
        camera.y = nat.y - (canvas.height / 2);
  }
}

//reset the camera's position on the player
function resetCamera(){
  camera.x = 0;
  camera.y = 0;

  if((nat.x > (map[0].length * size) - (canvas.width / 2)))
    camera.x = (map[0].length * size) - canvas.width;

  if((nat.y > (map.length * size) - (canvas.height / 2)))
    camera.y = (map.length * size) - canvas.height;
}



///////////////////    NPCS    //////////////////



//random walking
function drunkardsWalk(sprite, boundary=null){
  var dice;
  var directions = ["north", "south", "west", "east"];
  if(!sprite.moving){
    var pseudoChar = {dir : directions[0], x : sprite.x, y : sprite.y}
    //check if it would hit other character
    do{
      dice = Math.floor(Math.random() * directions.length);
      pseudoChar.dir = directions.splice(dice, 1)[0];

      //no options left
      if(directions.length == 0)
        return;
      
    }while(collide(pseudoChar, boundary) || hitOther(pseudoChar, nat))

    //move in direction
    if(pseudoChar.dir === "north"){
      goNorth(sprite);
    }else if(pseudoChar.dir === "south"){
      goSouth(sprite);
    }else if(pseudoChar.dir === "west"){
      goWest(sprite);
    }else if(pseudoChar.dir === "east"){
      goEast(sprite);
    }
  }
}

//look in randomdirections
function drunkardsLook(sprite){
  var dice;
  var directions = ["north", "south", "west", "east"];
  dice = Math.floor(Math.random() * 4);
  sprite.dir = directions[dice];
}

//act upon the robot pathQueue
function smallStep(robot){
  if(robot.pathQueue.length != 0 && !robot.moving){       //if not already moving and not an empty pathQueue
    var nextStep = robot.pathQueue[0];
    var curX = Math.floor(robot.x / 16);
    var curY = Math.floor(robot.y / 16);

    //changing y pos
    if(curX == nextStep[0]){
      if(nextStep[1] < curY)
        goNorth(robot);
      else if(nextStep[1] > curY)
        goSouth(robot);
    }   
    //changing x pos    
    else if(curY == nextStep[1]){
      if(nextStep[0] < curX)
        goWest(robot);
      else if(nextStep[0] > curX)
        goEast(robot);
    }
    //remove the node once reached
    robot.lastPos = robot.pathQueue.shift();
    //robot.lastPos = [Math.floor(robot.x / size), Math.floor(robot.y / size)];
  }
}


///////////////////  RENDER  //////////////////////

//check for render ok
function checkRender(){
  //tiles
  if(!tilesReady){
    tiles.onload = function(){
      tilesReady = true;
    };
  }
  
  if(!test_tilesReady){
    testTiles.onload = function(){
      test_tilesReady = true;
    };
  }

  //nat
  if(!nat.ready){
    nat.img.onload = function(){nat.ready = true;}
  }

  //npcs
  for(var a=0;a<npcs.length;a++){
    if(!npcs[a].ready){
      if(npcs[a].img.width !== 0){
        npcs[a].ready = true;
      }
    }
  }

  //buildings
  for(var b=0;b<buildings.length;b++){
    if(!buildings[b].ready){
      if(buildings[b].img.width !== 0){
        buildings[b].ready = true;
      }
    }
  }

  //item
  for(var i=0;i<items.length;i++){
    if(!items[i].ready){
      if(items[i].img.width !== 0){
        items[i].ready = true;
      }
    }
  }
}

//rendering function for the map
function drawMap(){
  if(tilesReady && level_loaded){
    for(var y = 0; y < rows; y++){
      for(var x = 0; x < cols; x++){
        //if(withinBounds(x,y)){
          //ctx.drawImage(tiles, size * map[y][x], 0, size, size, (x * size), (y * size), size, size);
          ctx.drawImage(tiles, 
            size * Math.floor(map[y][x] % tpr), size * Math.floor(map[y][x] / tpr), 
            size, size, 
            (x * size), (y * size), 
            size, size);
        //}
      }
    }
  }
}

//draw a character sprite
function drawsprite(sprite){
  updatesprite(sprite);
  rendersprite(sprite);
}

//update animation
function updatesprite(sprite){
  //update the frames
  if(sprite.ct == (sprite.fps - 1))
    sprite.curFrame = (sprite.curFrame + 1) % sprite.seqlength;
    
  sprite.ct = (sprite.ct + 1) % sprite.fps;
}
//draw the sprite
function rendersprite(sprite){
  //set the animation sequence
  var sequence;
  if(sprite.dir == "north"){
    if(sprite.action == "idle" && !sprite.board)
      sequence = sprite.idleNorth;
    else 
      sequence = sprite.moveNorth;
  }
  else if(sprite.dir == "south"){
    if(sprite.action == "idle"  && !sprite.board)
      sequence = sprite.idleSouth;
    else 
      sequence = sprite.moveSouth;
  }
  else if(sprite.dir == "west"){
    if(sprite.action == "idle"  && !sprite.board)
      sequence = sprite.idleWest;
    else 
      sequence = sprite.moveWest;
  }
  else if(sprite.dir == "east"){
    if(sprite.action == "idle"  && !sprite.board)
      sequence = sprite.idleEast;
    else 
      sequence = sprite.moveEast;
  }
  
  //get the row and col of the current frame
  var row = Math.floor(sequence[sprite.curFrame] / sprite.fpr);
  var col = Math.floor(sequence[sprite.curFrame] % sprite.fpr);
  
  var curheight = (sprite.board ? sprite.hover_height : sprite.height);
  var offY = (sprite.board ? sprite.hover_offsetY : sprite.offsetY);
  var sprIMG = (sprite.board ? sprite.hover_img : sprite.img);

  if(sprite.show && sprite.ready){
    ctx.drawImage(sprIMG, 
    col * sprite.width, row * curheight, 
    sprite.width, curheight,
    sprite.x - sprite.offsetX, sprite.y - offY, 
    sprite.width, curheight);
  }
}

//draw a building
function renderPlace(build){
  if(build.ready){
    ctx.drawImage(build.img, build.x*size, build.y*size);
  }
}

//draw an item
function drawItem(item){
  if(item.ready && item.show){
    if(item.animation !== null){
      var itemANIM = item.animation;

      //get the row and col of the current frame
      var row = Math.floor(itemANIM.sequence[itemANIM.curFrame] / itemANIM.fpr);
      var col = Math.floor(itemANIM.sequence[itemANIM.curFrame] % itemANIM.fpr);

      //console.log("r: " + row + "\tc: " + col + "\tf: " + itemANIM.curFrame)

      ctx.drawImage(item.img, 
      col * itemANIM.width, row * itemANIM.height, 
      itemANIM.width, itemANIM.height,
      item.x*size, item.y*size, 
      itemANIM.width, itemANIM.height);
    }else{
      ctx.drawImage(item.img, item.x*size, item.y*size);
    }
  }
}

//update and draw an item
function renderItem(item){
  if(item.animation !== null)
    updatesprite(item.animation);
  drawItem(item);
}

//show dialog gui
function drawDialog(){
  var dialogue = story.dialogue;
  var choice = story.choice_box;
  if(dialogue.show){
    ctx.drawImage(dialogIMG, camera.x, camera.y);
    wrapText(dialogue.text[dialogue.index], camera.x + 20, camera.y + 260)
  
    if(choice.show){
      for(var c=0;c<choice.options.length;c++){
        var cx = camera.x+232;
        var cy = camera.y+216+(-23*(c+1));
        ctx.drawImage(optionIMG, cx, cy);
        ctx.font = "12px Fixedsys";
        ctx.fillText(choice.options[choice.options.length-(c+1)], cx+8, cy+14);
      }

     ctx.drawImage(selectIMG, camera.x+232, camera.y+216+(23*(choice.index-choice.options.length)));
    }
  }
}
var indexOffset;

function drawInventory(){
  var inv = story.inventory;

  if(inv.show){
    //w:112 h:240
    ctx.drawImage(inventoryIMG, camera.x+200, camera.y+24);
    
    //set the cutoff
    var max = (inv.bag.length > 9 ? 9 : inv.bag.length);
    if(inv.index >= (inv.window+10))
      inv.window = inv.index-9;
    else if(inv.index < (inv.window))
      inv.window--;

    //var indexOffset;
    if (inv.index == (inv.window+9))
      indexOffset = 9
    else if(inv.index == (inv.window))
      indexOffset = 0;
    else
      indexOffset = inv.index - inv.window;

    for(var i=0;i<=max;i++){
      var ix = camera.x+200;
      var iy = camera.y+24+(23*(i));
      ctx.font = "12px Fixedsys";
      ctx.fillStyle = "#000000";
      ctx.fillText(inv.bag[i+inv.window], ix+8, iy+14);
    }
    
    ctx.drawImage(selectIMG, 
      0, 0,
      80, 24,
      camera.x+200, camera.y+24+(23*(indexOffset)),
      112, 24);
  }
}

function drawGUI(){
  drawInventory();
  drawDialog();
}

//wrap the text if overflowing on the dialog
function wrapText(text, x, y) {
  ctx.font = "20px Fixedsys";
  ctx.fillStyle = "#000000"

  var maxWidth = 280;
  var lineHeight = 30;
  var words = text.split(' ');
  var line = '';

  for(var n=0;n<words.length;n++) {
    var testLine = line + words[n] + ' ';
    var metrics = ctx.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

//DEBUG TILES
var testTiles = new Image();
testTiles.src = "../tilesets/test.png";
var test_tilesReady = false;
testTiles.onload = function(){test_tilesReady = true}

function drawTestMap(level){
  var tmap = binMap(level, size);
  if(test_tilesReady){
    for(var y = 0; y < rows; y++){
      for(var x = 0; x < cols; x++){
        //if(withinBounds(x,y)){
          //ctx.drawImage(tiles, size * map[y][x], 0, size, size, (x * size), (y * size), size, size);
          ctx.drawImage(testTiles, 
            size * Math.floor(tmap[y][x] % 2), size * Math.floor(tmap[y][x] / 2), 
            size, size, 
            (x * size), (y * size), 
            size, size);
        //}
      }
    }
  }
}
 
 //render everything 
function render(){
  checkRender();
  ctx.save();

  ctx.translate(-camera.x, -camera.y);

   //clear eveoything
  ctx.clearRect(camera.x, camera.y, canvas.width,canvas.height);
  
  //re-draw bg
  var ptrn = ctx.createPattern(bgPNG, 'repeat'); // Create a pattern with this image, and set it to "repeat".
  ctx.fillStyle = ptrn;
  ctx.fillRect(camera.x, camera.y, canvas.width, canvas.height);
  
  //draw the map
  drawMap();

  //draw the buildings if behind nat

  for(var i=0;i<items.length;i++){
    if(items[i].thru)
      renderItem(items[i]);
  }

  //draw the buildings if in front of nat
  for(var b=0;b<buildings.length;b++){
    if(buildings[b].thru)
      renderPlace(buildings[b])
  }

  //if npc behind nat
  for(var c=0;c<npcs.length;c++){
    if(nat.y >= npcs[c].y)
      drawsprite(npcs[c]);
  }

  //draw nat
  drawsprite(nat);

  //if npc in front of nat
  for(var c=0;c<npcs.length;c++){
    if(nat.y < npcs[c].y)
      drawsprite(npcs[c]);
  }

  for(var i=0;i<items.length;i++){
    if(!items[i].thru)
      renderItem(items[i]);
  }

  //draw the buildings if in front of nat
  for(var b=0;b<buildings.length;b++){
    if(!buildings[b].thru)
      renderPlace(buildings[b])
  }
  

  drawGUI();


  //if(story.area === "vals")
    //drawTestMap(levelList[1]);

  ctx.restore();
 // requestAnimationFrame(render);

}

////////////////////   KEY FUNCTIONS  //////////////////



// key events
var keyTick = 0;
var kt = null; 

//check for keydown
document.body.addEventListener("keydown", function (e) {
  if(story.cutscene && story.choice_box.show){
    var c = story.choice_box;
    if(e.keyCode == downKey || e.keyCode == rightKey)
      story.choice_box.index = (c.index + 1) % c.options.length;
    else if(e.keyCode == upKey || e.keyCode == leftKey)
      story.choice_box.index = ((c.index + c.options.length) - 1) % c.options.length;
  }

  if(story.inventory.show){
    var i = story.inventory;
    if(e.keyCode == downKey || e.keyCode == rightKey)
      story.inventory.index = (i.index + 1) % i.bag.length;
    else if(e.keyCode == upKey || e.keyCode == leftKey)
      story.inventory.index = ((i.index + i.bag.length) - 1) % i.bag.length;
  }
});

document.body.addEventListener("keydown", function (e) {
  if(inArr(moveKeySet, e.keyCode)){
    keys[e.keyCode] = true;
  }else if(inArr(actionKeySet, e.keyCode)){
    keys[e.keyCode] = true;
  }
});

//check for key released
document.body.addEventListener("keyup", function (e) {
  if(inArr(moveKeySet, e.keyCode)){
    keys[e.keyCode] = false;
  }else if(inArr(actionKeySet, e.keyCode)){
    keys[e.keyCode] = false;
    reInteract = true;
  }
});


//check if any directional key is held down
function anyKey(){
  return (keys[upKey] || keys[downKey] || keys[leftKey] || keys[rightKey])
}

//movement arrow keys
function moveKeys(){
  if(!nat.moving && !nat.interact && !story.cutscene && !story.inventory.show){
    if(keyTick < 1){
      if(keys[leftKey])         //left key
        nat.dir = "west";
      else if(keys[rightKey])    //right key
        nat.dir = "east";
      else if(keys[upKey])    //up key
        nat.dir = "north";
      else if(keys[downKey])    //down key
        nat.dir = "south";
    }else{
      if(keys[leftKey])         //left key
        goWest(nat);
      else if(keys[rightKey])    //right key
        goEast(nat);
      else if(keys[upKey])    //up key
        goNorth(nat);
      else if(keys[downKey])    //down key
        goSouth(nat);
    }
  }
}


//action and interaction keys
var reInteract = false;
function actionKeys(){

  //interact [Z]
  var dialogue = story.dialogue;
  if(keys[z_key] && !nat.interact && !nat.moving && reInteract && !story.cutscene && !story.inventory.show){
    for(var i=0;i<items.length;i++){
      if(canInteract(nat, items[i]) && items[i].text){
        story.trigger = "touch_" + items[i].name;
        reInteract = false;
        if(!story.cutscene){
          nat.other = items[i];
          nat.interact = true;
          dialogue.text = items[i].text;
          dialogue.index = 0;
        }
        return;
      }
    }
    for(var i=0;i<npcs.length;i++){
      if(canTalk(nat, npcs[i]) && npcs[i].text){
        story.trigger = "talk_" + npcs[i].name;
        reInteract = false;
        if(!story.cutscene){
          nat.other = npcs[i];
          nat.other.interact = true;
          faceOpposite(nat.other);
          nat.interact = true;
          dialogue.text = npcs[i].text;
          dialogue.index = 0;
        }
        return;
      }
    }
  }else if(keys[z_key] && dialogue.show && reInteract){
    reInteract = false;
    if(dialogue.index +1 == dialogue.text.length){
      //select item if options showing
      if(story.choice_box.show){
        story.trigger = "> " + story.choice_box.options[story.choice_box.index];
      }
      
      nat.interact = false;
      nat.other.interact = false;
      if(story.cutscene)
        story.taskIndex++;
    }else{
      dialogue.index++;
      //console.log('next')
    }
  }

  //hoverboard
  if(keys[x_key] && !story.cutscene && !nat.interact && reInteract && !story.inventory.show){
    reInteract = false;
    nat.board = !nat.board;
  }

  //inventory
  if(keys[c_key] && !story.cutscene && reInteract){
    reInteract = false;
    story.inventory.show = !story.inventory.show;

  }

}



////////////////////  GAME FUNCTIONS  //////////////////


//startup function
function init(name, quad, sect, x, y){
  //look for next leveldata
  var lvl;
  for(var a = 0;a<levelList.length;a++){
    var bLvl = levelList[a];
    if(bLvl.name === name && bLvl.quad === quad && bLvl.sect === sect){
      lvl = bLvl;
      break;
    }
  }
  loadLevel(lvl, x*size, y*size);
}

function maestro(){
  !bg_music.paused ? bg_music.pause() : bg_music.play();
}

//main running function for the game
function main(){
  requestAnimationFrame(main);
  canvas.focus();
  render();

  //game
  play();

  //player movement
  travel(nat);
  panCamera();
  beamMeUp();
  if(story.cutscene)
    smallStep(nat);
  if(curLvl === "moon")
    quadChange(curQuad);

  //npc movement
  for(var n = 0;n<npcs.length;n++){
    var npc = npcs[n];
    travel(npc);
    defaultBehavior(npc);
    if(story.cutscene)
      smallStep(npc);
  }

  if(!story.cutscene){
    if(nat.interact){
      story.dialogue.show = true;
    }else
      story.dialogue.show = false;
  }

  //keyboard ticks
  var akey = anyKey();
  if(akey && kt == 0){
      kt = setInterval(function(){keyTick+=1}, 75);
  }else if(!akey){
    clearInterval(kt);
    kt = 0;
    keyTick=0;
  }
  moveKeys();
  actionKeys();

  ///////////////    DEBUG   //////////////////

  var pixX = Math.round(nat.x / size);
  var pixY = Math.round(nat.y / size);

  if(npcs.length > 0){
    var nx = Math.round(npcs[0].x / size);
    var ny = Math.round(npcs[0].y / size);
  }

  var settings = "X: " + Math.round(nat.x) + " | Y: " + Math.round(nat.y);
  settings += " --- Pix X: " + pixX + " | Pix Y: " + pixY;
  settings += " --- " + curSect + " | " + curQuad;
  settings += " --- " + story.taskIndex + " | " + story.cutscene;
  //settings += " --- " + story.mission + " | " + story.task;
  settings += " --- " + story.dialogue.index;

  /*
  if(npcs.length > 0){
    settings += " --- " + npcs[0].lastPos;
    //settings += " (" + npcs[0].x + ", " + npcs[0].y + ")";
  }

  settings += " ---";
  for(var a=0;a<story.nat.pathQueue.length;a++){
    settings += " [" + story.nat.pathQueue[a].toString() + "], ";  
  }
  */
  
  document.getElementById('botSettings').innerHTML = settings;

  //console.log(keys);

}

main();
