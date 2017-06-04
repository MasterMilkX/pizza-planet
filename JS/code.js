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
var edges = [
[22, 3], [24, 2], [26, 2], [29, 1], 
[21, 4], [20, 4], [19, 5], [17, 6], 
[16, 7], [15, 8], [14, 9], [13, 10], 
[12, 11], [11, 12], [9, 14], [8, 15], 
[7, 16], [6, 18], [5, 19], [4, 21], 
[3, 23], [2, 26], [1, 29], [0, 34], 
[6, 18], [3, 23], [2, 25], [4, 22], 
[3, 24], [2, 27], [1, 28], [1, 30], 
[1, 31], [1, 32], [0, 33], [0, 35], 
[0, 36], [0, 37], [0, 38], [0, 39], 
[18, 6], [23, 3], [25, 2], [27, 1], 
[28, 1], [30, 0], [31, 0], [32, 0], 
[33, 0], [34, 0], [35, 0], [36, 0], 
[37, 0], [38, 0], [39, 0], [10, 13], 
[7, 17], [5, 20]];
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
var tiles = new Image();
tiles.src = "../beta_sprites/planet.png";
var tilesReady = false;
tiles.onload = function(){
  tilesReady = true;
};

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
  x : 9 * size, 
  y : 9 * size,
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


//////////////////   MAP FUNCTIONS  /////////////////

function blankMap(){
  map = [];
  for(var y = 0; y < rows; y++){
      var r = [];
      for(var x = 0; x < cols; x++){
        r.push(0);
      }
      map.push(r);
    }

    mapEdge();
}

function mapEdge(){
  for(var i=0; i<edges.length; i++){
    var edge = edges[i];
    map[edge[1]][edge[0]] = 1;
  }
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
  //camera displacement
  if((nat.x >= (canvas.width / 2)) && (nat.x <= (map[0].length * size) - (canvas.width / 2)))
      camera.x = nat.x - (canvas.width / 2);

  if((nat.y >= (canvas.width / 2)) && (nat.y <= (map[0].length * size) - (canvas.width / 2)))
      camera.y = nat.y - (canvas.width / 2);
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
  blankMap();
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
    nat.board = !nat.board;
  });
  keyboard();

  var pixX = Math.round(nat.x / size);
  var pixY = Math.round(nat.y / size);

  //debug
  var settings = "X: " + Math.round(nat.x) + " | Y: " + Math.round(nat.y);
  settings += " --- Pix X: " + pixX + " | Pix Y: " + pixY;
  document.getElementById('botSettings').innerHTML = settings;

}
main();
render();
