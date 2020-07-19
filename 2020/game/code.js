//set up the canvas
var canvas = document.createElement("canvas");
canvas.id = "game";
var ctx = canvas.getContext("2d");
canvas.width = 320;
canvas.height = 280;
document.body.appendChild(canvas);

var size = 16;

//camera
var camera = {
	x : 0,
	y : 0
};

//KEYS

// directionals
var upKey = 38;     //[Up]
var leftKey = 37;   //[Left]
var rightKey = 39;  //[Rigt]
var downKey = 40;   //[Down]
var moveKeySet = [upKey, leftKey, rightKey, downKey];

// A and b
var a_key = 90;   //[Z]
var b_key = 88;   //[X]
var actionKeySet = [a_key, b_key];

var keys = [];

var moveType = "moon";


//characters
var nat = new character("Nat", 9, 10, "", "nat_nb");
nat.sec_dir = "";

//buildings and environment
var moonIMG = new Image();
moonIMG.src = "../env_sprites/moon.png";

var capsuleIMG = new Image();
capsuleIMG.src = "../env_sprites/capsule_crash.png";
var capsule = new building(capsuleIMG, 5, 10);

var ufoIMG = new Image();
ufoIMG.src = "../env_sprites/vals_ship.png";
var shuttleIMG = new Image();
shuttleIMG.src = "../env_sprites/shuttle.png";

var buildings = [];

//planet coordinates
var planetXY = {
	x : 0,
	y : 0

}

//////////////////    GENERIC FUNCTIONS   ///////////////


//checks if an element is in an array
function inArr(arr, e){
	if(arr.length == 0)
		return false;
	return arr.indexOf(e) !== -1
}


////////////////   KEYBOARD FUNCTIONS  //////////////////


// key events
var keyTick = 0;
var kt = null; 

function anyKey(){
	return anyMoveKey() || anyActionKey();
}

//check if any directional key is held down
function anyMoveKey(){
	return (keys[upKey] || keys[downKey] || keys[leftKey] || keys[rightKey])
}

function anyActionKey(){
	return (keys[a_key] || keys[b_key]);
}

//all key inputs
function move_keyboard(){

	if(!anyMoveKey()){
		nat.action = "idle";
		return;
	}

	//free movement
	if(moveType == "free"){
		
		if(keys[leftKey]){
			nat.dir = "west";
			nat.action = "move";

			nat.x -= nat.speed;
		}else if(keys[rightKey]){
			nat.dir = "east";
			nat.action = "move";

			nat.x += nat.speed;
		}else if(keys[upKey]){
			nat.dir = "north";
			nat.action = "move";

			nat.y -= nat.speed;
		}else if(keys[downKey]){
			nat.dir = "south";
			nat.action = "move";

			nat.y += nat.speed;
		}
	}
	//moon rotation movement
	else if(moveType == "moon"){
		if(keys[leftKey]){
			nat.dir = "west";
			nat.action = "move";

			planetXY.x -= nat.speed;
		}else if(keys[rightKey]){
			nat.dir = "east";
			nat.action = "move";

			planetXY.x += nat.speed;
		}else if(keys[upKey]){
			nat.dir = "north";
			nat.action = "move";

			planetXY.y -= nat.speed;
		}else if(keys[downKey]){
			nat.dir = "south";
			nat.action = "move";

			planetXY.y += nat.speed;
		}
	}
}


////////////////   CAMERA FUNCTIONS   /////////////////

/*  OPTIONAL IF LARGE GAME MAP
//if within the game bounds
function withinBounds(x,y){
	var xBound = (x >= Math.floor(camera.x / size) - 1) && (x <= Math.floor(camera.x / size) + (canvas.width / size));
	return xBound;
}

//have the camera follow the player
function panCamera(){
	camera.x = 0;
	camera.y = 0;

	if(map.length != 0 && player.x > ((map[0].length) - ((canvas.width/size)/2)))
		camera.x = (map[0].length * size) - canvas.width;
	else if(player.x < ((canvas.width/size)/2))
		camera.y = 0;
	else
		camera.x = player.x *size - (canvas.width / 2);

	if(map.length != 0 && player.y > ((map.length) - ((canvas.height/size) / 2)))
		camera.y = (map.length * size) - canvas.height;
	else if(player.y < ((canvas.height/size)/2))
		camera.y = 0;
	else
		camera.y = player.y *size - (canvas.height / 2) + (size/2);

	camera.x += cam_offset.x;
	camera.y += cam_offset.y;
}
*/


//////////////////  RENDER FUNCTIONS  ////////////////////



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
		sprite.width, sprite.height);
	}
}


function drawCraters(){
	ctx.fillStyle = "#7D7D7D";
	ctx.beginPath();
	ctx.ellipse(Math.cos(0), Math.sin(0), 10, Math.sin(planetXY.y),0,0,2*Math.PI);
	ctx.stroke();
}

function render(){
	ctx.save();
	//ctx.translate(-camera.x, -camera.y);		//camera
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	//background
	ctx.fillStyle = "#20002F";
	ctx.fillRect(0,0,canvas.width, canvas.height);

	//draw the moon
	ctx.drawImage(moonIMG, 0, 100,canvas.width,canvas.height-100);
	
	/*   add draw functions here  */
	drawsprite(nat);

	
	
	ctx.restore();
}



//////////////   GAME LOOP FUNCTIONS   //////////////////

//game initialization function
function init(){

}

//main game loop
function main(){
	requestAnimationFrame(main);
	canvas.focus();

	//panCamera();

	move_keyboard();

	//keep within planetary bounds
	if(planetXY.x > 100)
		planetXY.x = 0;
	if(planetXY.x < 0)
		planetXY.x = 100;
	if(planetXY.y > 100)
		planetXY.y = 0
	if(planetXY.y < 0)
		planetXY.y = 100;

	render();

	//keyboard ticks
	var akey = anyKey();
	if(akey && kt == 0){
		kt = setInterval(function(){keyTick+=1}, 75);
	}else if(!akey){
		clearInterval(kt);
		kt = 0;
		keyTick=0;
	}

	//debug
	var settings = "PLANET: (" + planetXY.x + "," +planetXY.y + ")";

	document.getElementById('debug').innerHTML = settings;
}


/////////////////   HTML5 FUNCTIONS  //////////////////

//determine if valud key to press
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
	}
});

//prevent scrolling with the game
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if(([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)){
        e.preventDefault();
    }
}, false);


main();
