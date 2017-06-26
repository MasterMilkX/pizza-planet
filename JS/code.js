//Global variables
/*global levelList */
/*global mapList */

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
var curSect = "NEWTON";
var boundVal = 1;
var triggerVal = 4;
var collideTiles = [1];

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
tiles.src = "../tilesets/moon_tiles.png";
var tilesReady = false;
tiles.onload = function(){
  tilesReady = true;
};
var tpr = 3; //tiles per row

//player
var natIMG  = new Image();
natIMG.src = "../beta_sprites/nat_f.png";
var natReady = false;
natIMG.onload = function(){natReady = true;};

var hoverIMG  = new Image();
hoverIMG.src = "../beta_sprites/hover-nat_f.png";
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
dialogIMG.onload = function(){dialogReady = true;}

var dialogue = {
  show : false,
  text : "",
  curtext : "",
  index : 0,
  speed : 0.4,
  end : false
}


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
var a_key = 65;   //[A]
var s_key = 83;   //[S]
var actionKeySet = [z_key, x_key, a_key, s_key];
var keys = [];

//add-ins
var npcs = [];
var buildings = [];
var items = [];

//////////////////    LEVEL FUNCTIONS   //////////////

function reset(){
  npcs = [];
  buildings = [];
}

//create eeverything needed for the next level
function loadLevel(aLevel, px, py){
  //reset everything
  reset();

  //reset nat's position
  nat.x = px;
  nat.y = py;

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

  //make a moon level
  if(aLevel.name === "moon"){
    blankMoon(aLevel.quad);
    console.log("moon loaded");
    return;
  }

  //otherwise make a building level
  //get the map data
  var aMap;
  for(var d=0;d<mapList.length;d++){
    bMap = mapList[d];
    if(aLevel.name === bMap.name){
      aMap = bMap;
      break;
    }
  }

  //reset rows and cols
  rows = aMap.rows;
  cols = aMap.cols;
  collideTiles = aMap.collision;

  loadMap(aMap);

  console.log("level loaded");

}


//////////////////   MAP FUNCTIONS  /////////////////

function blankMoon(quadrant){
  //reset background
  bgPNG.src = "../beta_sprites/" + quadrant + ".png";
  bgPNG.onload = function(){
    ctx.drawImage(bgPNG, 0, 0);
  };

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


//////////////////  PLAYER CONTROLS /////////////////

function goNorth(sprite){
  if(!sprite.moving){
    sprite.initPos = Math.floor(sprite.y / size) * size;
    sprite.dir = "north";
    sprite.action = "travel";
  }
}
function goSouth(sprite){
  if(!sprite.moving){
    sprite.initPos = Math.floor(sprite.y / size) * size;
    sprite.dir = "south";
    sprite.action = "travel";
  }
}
function goEast(sprite){
  if(!sprite.moving){
    sprite.initPos = Math.floor(sprite.x / size) * size;
    sprite.dir = "east";
    sprite.action = "travel";
  }
}
function goWest(sprite){
  if(!sprite.moving){
    sprite.initPos = Math.floor(sprite.x / size) * size;
    sprite.dir = "west";
    sprite.action = "travel";
  }
}
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

function drunkardsLook(sprite){
  var dice;
  var directions = ["north", "south", "west", "east"];
  dice = Math.floor(Math.random() * 4);
  sprite.dir = directions[dice];
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

//determine if about to collide with an object
function map_collide(person, val){
  if(!level_loaded)
    return;

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

  //edge of map undecided
  if(rx-1 < 0 || rx+1 >= cols || ry-1 < 0 || ry+1 >= cols)
    return;

  //decide if adjacent to person
  if(person.dir == "north" && map[ry-1][rx] == val)
    return true;
  else if(person.dir == "south" && map[ry+1][rx] == val)
    return true;
  else if(person.dir == "east" && map[ry][rx+1] == val)
    return true;
  else if(person.dir == "west" && map[ry][rx-1] == val)
    return true;
  else
    return false;
}

//determine if colliding with an object
function map_overlap(person, val){
  if(!level_loaded)
    return;

  //get the positions
  var rx = Math.round(person.x / size);
  var ry = Math.round(person.y / size);

  //decide if adjacent to person
  if(map[ry][rx] == val)
    return true;
  else
    return false;
}

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
  if(person.dir == "north" && collideTiles.indexOf(map[ry-1][rx]) != -1)
    return true;
  else if(person.dir == "south" && collideTiles.indexOf(map[ry+1][rx]) != -1)
    return true;
  else if(person.dir == "east" && collideTiles.indexOf(map[ry][rx+1]) != -1)
    return true;
  else if(person.dir == "west" && collideTiles.indexOf(map[ry][rx-1]) != -1)
    return true;
  else
    return false;
}

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


    if(person.dir == "north" && (xArea.indexOf(rx) !== -1) && (yArea.indexOf(ry-1) !== -1))
      ouch = true;
    else if(person.dir == "south" && (xArea.indexOf(rx) !== -1) && (yArea.indexOf(ry+1) !== -1))
      ouch = true;
    else if(person.dir == "east" && (xArea.indexOf(rx+1) !== -1) && (yArea.indexOf(ry) !== -1))
      ouch = true;
    else if(person.dir == "west" && (xArea.indexOf(rx-1) !== -1) && (yArea.indexOf(ry) !== -1))
      ouch = true;
  }
  return ouch;

}

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

  if(sprite.dir == "north" && ((xArea.indexOf(rx) == -1) || (yArea.indexOf(ry-1) == -1)))
    return true;
  else if(sprite.dir == "south" && ((xArea.indexOf(rx) == -1) || (yArea.indexOf(ry+1) == -1)))
    return true;
  else if(sprite.dir == "east" && ((xArea.indexOf(rx+1) == -1) || (yArea.indexOf(ry) == -1)))
    return true;
  else if(sprite.dir == "west" && ((xArea.indexOf(rx-1) == -1) || (yArea.indexOf(ry) == -1)))
    return true;
  
  return false;
  }

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

function collide(sprite, boundary=null){
  return hitNPC(sprite) || hitItem(sprite) || hitWall(sprite) || hitBoundary(sprite, boundary)
}

///////////////////   CAMERA  /////////////////////
function withinBounds(x,y){
  var xBound = (x >= Math.floor(camera.x / 16) - 1) && (x <= Math.floor(camera.x / 16) + (canvas.width / 16));
  return xBound;
}

function panCamera(){
  if(level_loaded){   //map filled?
    //camera displacement
    if((nat.x >= (canvas.width / 2)) && (nat.x <= (map[0].length * size) - (canvas.width / 2)))
        camera.x = nat.x - (canvas.width / 2);

    if((nat.y >= (canvas.height / 2)) && (nat.y <= (map.length * size) - (canvas.height / 2)))
        camera.y = nat.y - (canvas.height / 2);
  }
}

function resetCamera(){
  camera.x = 0;
  camera.y = 0;

  if((nat.x > (map[0].length * size) - (canvas.width / 2)))
    camera.x = (map[0].length * size) - canvas.width;

  if((nat.y > (map.length * size) - (canvas.height / 2)))
    camera.y = (map.length * size) - canvas.height;
}

///////////////////    NPCS    //////////////////




///////////////////  RENDER  //////////////////////

//check for render ok
function checkRender(){
  //tiles
  if(!tilesReady){
    tiles.onload = function(){
      tilesReady = true;
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
  if(tilesReady){
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

function drawsprite(sprite){
  updatesprite(sprite);
  rendersprite(sprite);
}

function updatesprite(sprite){
  //update the frames
  if(sprite.ct == (sprite.fps - 1))
    sprite.curFrame = (sprite.curFrame + 1) % sprite.seqlength;
    
  sprite.ct = (sprite.ct + 1) % sprite.fps;
}
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

function renderPlace(build){
  if(build.ready){
    ctx.drawImage(build.img, build.x*size, build.y*size);
  }
}

function drawItem(item){
  if(item.ready && item.show){
    if(item.animation !== null){
      var itemANIM = item.animation;

      //get the row and col of the current frame
      var row = Math.floor(itemANIM.sequence[itemANIM.curFrame] / itemANIM.fpr);
      var col = Math.floor(itemANIM.sequence[itemANIM.curFrame] % itemANIM.fpr);

      ctx.drawImage(item.img, 
      col * itemANIM.width, row * itemANIM.height, 
      itemANIM.width, itemANIM.height,
      item.x, item.y, 
      itemANIM.width, itemANIM.height);
    }else{
      ctx.drawImage(item.img, item.x*size, item.y*size);
    }
  }
}

function renderItem(item){
  if(item.animation !== null)
    updatesprite(item.animation);
  drawItem(item);
}

function drawDialog(){
  if(dialogue.show){
    ctx.drawImage(dialogIMG, camera.x, camera.y);
    wrapText(dialogue.text[dialogue.index], camera.x + 20, camera.y + 260)
  }
}

function wrapText(text, x, y) {
  var maxWidth = 280;
  var lineHeight = 30;
  var words = text.split(' ');
  var line = '';

  for(var n = 0; n < words.length; n++) {
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
  ctx.font = "20px Fixedsys";
  ctx.fillText(line, x, y);
}

function render(){
  checkRender();
  //ctx.save();

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
  /*
  for(var b=0;b<buildings.length;b++){
    if(buildings[b].thru){
      renderPlace(buildings[b]);
    }
  }
  */

  for(var i=0;i<items.length;i++){
    if(items[i].thru)
      renderItem(items[i]);
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

  //draw the buildings if in front of nat
  for(var b=0;b<buildings.length;b++){
   // if(!buildings[b].thru){
      renderPlace(buildings[b]);
   // }
  }


  for(var i=0;i<items.length;i++){
    if(!items[i].thru)
      renderItem(items[i]);
  }

  drawDialog();

  //ctx.restore();
 // requestAnimationFrame(render);

}

////////////////////   KEY FUNCTIONS  //////////////////



// key events
var keyTick = 0;
var kt = null; 

document.body.addEventListener("keydown", function (e) {
  if((moveKeySet.indexOf(e.keyCode) != -1)){
    keys[e.keyCode] = true;
  }else if(actionKeySet.indexOf(e.keyCode) != -1){
    keys[e.keyCode] = true;
  }
});

document.body.addEventListener("keyup", function (e) {
  if(moveKeySet.indexOf(e.keyCode) != -1){
    keys[e.keyCode] = false;
  }else if(actionKeySet.indexOf(e.keyCode) != -1){
    keys[e.keyCode] = false;
    reInteract = true;
  }
});

function anyKey(){
  return (keys[upKey] || keys[downKey] || keys[leftKey] || keys[rightKey])
}

function moveKeys(){
  if(!nat.moving && !nat.interact){
    if(keyTick < 1){
      if(keys[leftKey])         //left key
        nat.dir = "west";
      else if(keys[rightKey])    //right key
        nat.dir = "east";
      else if(keys[upKey])    //upkey
        nat.dir = "north";
      else if(keys[downKey])    //downkey
        nat.dir = "south";
    }else{
      if(keys[leftKey])         //left key
        goWest(nat);
      else if(keys[rightKey])    //right key
        goEast(nat);
      else if(keys[upKey])    //upkey
        goNorth(nat);
      else if(keys[downKey])    //downkey
        goSouth(nat);
    }
  }

}


var reInteract = false;
function actionKeys(){
  if(keys[z_key] && !nat.interact && !nat.moving && reInteract){
    for(var i=0;i<items.length;i++){
      if(canInteract(nat, items[i]) && items[i].text){
        reInteract = false;
        nat.other = items[i];
        nat.interact = true;
        dialogue.text = items[i].text;
        dialogue.index = 0;
        return;
      }
    }
  }else if(keys[z_key] && nat.interact && reInteract){
    reInteract = false;
    if(dialogue.index +1 == nat.other.text.length){
      nat.interact = false;
    }else{
      dialogue.index++;
    }
  }
}



////////////////////  GAME FUNCTIONS  //////////////////


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


function main(){
  requestAnimationFrame(main);
  canvas.focus();
  render();

  travel(nat);
  panCamera();
  quadChange(curQuad);

  //npc movement
  for(var n = 0;n<npcs.length;n++){
    var npc = npcs[n];
    travel(npc);
    
    if(npc.walkType === "drunk"){
      if(npc.wt == 0 && !npc.moving){
        npc.wt = setInterval(function(){
          drunkardsWalk(npc, new boundArea(10, 7, 5, 4));
          clearInterval(npc.wt);
          npc.wt = 0;
        }, (Math.random() * 2 + 1)*1000);
      }
    }
    
  }

  if(nat.interact){
    dialogue.show = true;
  }else
    dialogue.show = false;

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

  var pixX = Math.round(nat.x / size);
  var pixY = Math.round(nat.y / size);

  if(npcs.length > 0){
    var nx = Math.round(npcs[0].x / size);
    var ny = Math.round(npcs[0].y / size);
  }

  //debug
  var settings = "X: " + Math.round(nat.x) + " | Y: " + Math.round(nat.y);
  settings += " --- Pix X: " + pixX + " | Pix Y: " + pixY;
  settings += " --- " + curSect + " | " + curQuad;
  if(npcs.length > 0){
    settings += " --- " + npcs[0].dir + " | " + npcs[0].initPos;
    settings += " (" + npcs[0].x + ", " + npcs[0].y + ")";
  }
  
  document.getElementById('botSettings').innerHTML = settings;

  //console.log(keys);

}

main();

