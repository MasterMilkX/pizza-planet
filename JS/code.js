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
var curHalf = "NEWTON";
var boundVal = 1;
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
tiles.src = "../beta_sprites/planet.png";
var tilesReady = false;
tiles.onload = function(){
  tilesReady = true;
};

//player
var natIMG  = new Image();
natIMG.src = "../beta_sprites/nat_f.png";
var natReady = false;
natIMG.onload = function(){natReady = true;}

var hoverIMG  = new Image();
hoverIMG.src = "../beta_sprites/hover-nat_f.png";
var hoverReady = false;
hoverIMG.onload = function(){hoverReady = true;}

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
  speed : 0.5,
  initPos : 0,
  moving : false,
  x : 20 * size, 
  y : 15 * size,
  velX : 0,
  velY : 0,
  fps : 9,            //frame speed
  fpr : 12,            //# of frames per row
  show : true,

  //hoverboard
  board : false, 
  hover_height: 24,
  hover_offsetY : 8,
  hover_speed : 1,
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

  curFrame : 0,
  ct : 0
}


//camera
var camera = {
  x : 0,
  y : 0
};

//controls
var keys = [];
var upKey = 38; //[Up]
var leftKey = 37;
var rightKey = 39;
var downKey = 40;


//////////////////   MAP FUNCTIONS  /////////////////

function blankMap(quadrant){
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

  blankMap(new_quad);

}
/*
//go to the opposite sector
function sectorChange(quadrant){
  var halfTile = size / 2;
  var pixX = Math.round(nat.x / size);
  var pixY = Math.round(nat.y / size);
  var altWorld;
  var altDir;

  if(quadrant === "q1")
    altWorld = "q2";
  else if(quadrant === "q2")
    altWorld = "q1";
  else if(quadrant === "q3")
    altWorld = "q4";
  else if(quadrant === "q4")
    altWorld = "q3";

  if(nat.dir === "north")
    altDir = "south";
  else if(nat.dir === "south")
    altDir = "north";
  else if(nat.dir === "east")
    altDir = "west";
  else if(nat.dir === "west")
    altDir = "east";

  if(level_loaded && map[pixX][pixY] == boundVal){
    atWorldsEnd(altWorld, altDir, pixX, pixY)
  }
}
*/
function sectorChange2(){
  var halfTile = size / 2;
  var altWorld;
  var n = Math.round((nat.y - halfTile) / size);
  var s = Math.round((nat.y + halfTile) / size);
  var e = Math.round((nat.x + halfTile) / size);
  var w = Math.round((nat.x - halfTile) / size);
  var pixX = Math.round(nat.x / size);
  var pixY = Math.round(nat.y / size);

  if(n < 0 || s >= rows || w < 0 || e >= cols)
    return;


  if(curQuad === "q1")
    altWorld = "q2";
  else if(curQuad === "q2")
    altWorld = "q1";
  else if(curQuad === "q3")
    altWorld = "q4";
  else if(curQuad === "q4")
    altWorld = "q3";

  if(level_loaded){
    if(nat.dir === "north" && map[n][pixX] == boundVal)
      atWorldsEnd2(altWorld, nat.dir, pixX, pixY);
    else if(nat.dir === "south" && map[s][pixX] == boundVal)
      atWorldsEnd2(altWorld, nat.dir, pixX, pixY);
    else if(nat.dir === "east" && map[pixY][e] == boundVal)
      atWorldsEnd2(altWorld, nat.dir, pixX, pixY);
    else if(nat.dir === "west" && map[pixY][w] == boundVal)
      atWorldsEnd2(altWorld, nat.dir, pixX, pixY);
  }
  
}
/*
//change the section and quadrant
function atWorldsEnd(altWorld, direction, x, y){
  curHalf = (curHalf === "NETWON" ? "DA VINCI" : "NEWTON" );
  blankMap(altWorld);
  nat.dir = direction;
  
  nat.moving = false;
  var newX = rows - x;
  var diff = (direction === "west" ? -2 : 2);
  var diff2 = (direction === "west" ? -3 : 3);
  nat.x = (newX + diff) * size;
  nat.initPos = (newX + diff + diff2) * size;

}
*/
function atWorldsEnd2(world, dir, ix, iy){
  if(dir === "north" || dir === "south")
    nat.y = (iy + 3) * size;
  var off = (dir === "west" ? -2 : 2);
  nat.x = Math.abs(cols + off - ix) * size;
  var halfTile = size / 2;

  if(curHalf === "NEWTON")
    curHalf = "DA VINCI";
  else
    curHalf = "NEWTON"; 

  blankMap(world);
  nat.velX = 0;
  nat.velY = 0;
  nat.action = "idle";
  nat.moving = false;
  if(dir === "north")
    nat.dir = "south";
  else if(dir === "south")
    nat.dir = "north";

  if(dir === "north" || dir === "south")
    nat.initPos = nat.y;
  else
    nat.initPos = nat.x;

  //nat.initPos = nat.x;
  console.log("GO!");

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
      if(Math.floor(sprite.y) > (sprite.initPos - size)){
        sprite.velY = curspeed;
        sprite.y += velControl(Math.floor(sprite.y), -sprite.velY, (sprite.initPos - size));
        sprite.moving = true;
      }else{
        sprite.velY = 0;
        sprite.action = "idle";
        sprite.moving = false;
      }
    }else if(sprite.dir == "south"){
      if(Math.floor(sprite.y) < (sprite.initPos + size)){
        sprite.velY = curspeed;
        sprite.y += velControl(Math.floor(sprite.y), sprite.velY, (sprite.initPos + size));;
        sprite.moving = true;
      }else{
        sprite.velY = 0;
        sprite.action = "idle";
        sprite.moving = false;
      }
    }else if(sprite.dir == "east"){
      if(Math.floor(sprite.x) < (sprite.initPos + size)){
        sprite.velX = curspeed;
        sprite.x += velControl(Math.floor(sprite.x), sprite.velX, (sprite.initPos + size));
        sprite.moving = true;
      }else{
        sprite.velX = 0;
        sprite.action = "idle";
        sprite.moving = false;
      }
    }else if(sprite.dir == "west"){
      if(Math.floor(sprite.x) > (sprite.initPos - size)){
        sprite.velX = curspeed;
        sprite.x += velControl(Math.floor(sprite.x), -sprite.velX, (sprite.initPos - size));;
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


///////////////////  RENDER  //////////////////////

//rendering function for the map
function drawMap(){
  if(tilesReady){
    for(var y = 0; y < rows; y++){
      for(var x = 0; x < cols; x++){
        //if(withinBounds(x,y)){
          ctx.drawImage(tiles, size * map[y][x], 0, size, size, (x * size), (y * size), size, size);
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
  //set the animation sequence
  var sequence;
  if(sprite.dir == "north")
    sequence = sprite.moveNorth;
  else if(sprite.dir == "south")
    sequence = sprite.moveSouth;
  else if(sprite.dir == "west")
    sequence = sprite.moveWest;
  else if(sprite.dir == "east")
    sequence = sprite.moveEast;
    
  //update the frames
  if(sprite.ct == (sprite.fps - 1))
    sprite.curFrame = (sprite.curFrame + 1) % sequence.length;
    
  sprite.ct = (sprite.ct + 1) % sprite.fps;
}
function rendersprite(sprite){
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
  
  var curheight = (sprite.board ? sprite.hover_height : sprite.height);
  var offY = (sprite.board ? sprite.hover_offsetY : sprite.offsetY);
  var sprIMG = (sprite.board ? sprite.hover_img : sprite.img);

  if(sprite.show){
    ctx.drawImage(sprIMG, 
    col * sprite.width, row * curheight, 
    sprite.width, curheight,
    sprite.x - sprite.offsetX, sprite.y - offY, 
    sprite.width, curheight);
  }
}

function render(){
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

  drawsprite(nat);

  ctx.restore();
  requestAnimationFrame(render);

}

////////////////////  GAME FUNCTIONS  //////////////////


function init(){
  blankMap("q2");
}

function keyboard(){
  if(!nat.moving){
    if(keys[leftKey])
      goWest(nat);
    else if(keys[rightKey])
      goEast(nat);
    else if(keys[upKey])
      goNorth(nat);
    else if(keys[downKey])
      goSouth(nat);
  }
  
}


function main(){
  requestAnimationFrame(main);
  canvas.focus();

  travel(nat);
  panCamera();
  quadChange(curQuad);
  sectorChange2();

   // key events
  document.body.addEventListener("keydown", function (e) {
      keys[e.keyCode] = true;
      keyIn = true;
  });
  document.body.addEventListener("keyup", function (e) {
      keys[e.keyCode] = false;
      keyIn = false;
  });
  document.body.addEventListener("keypress", function (e){
    if(e.keyCode == 122)
      nat.board = !nat.board;
  });
  keyboard();

  var pixX = Math.round(nat.x / size);
  var pixY = Math.round(nat.y / size);

  //debug
  var settings = "X: " + Math.round(nat.x) + " | Y: " + Math.round(nat.y);
  settings += " --- Pix X: " + pixX + " | Pix Y: " + pixY;
  settings += " --- " + curHalf + " | " + curQuad;
  document.getElementById('botSettings').innerHTML = settings;

}
main();
render();
