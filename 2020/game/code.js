//set up the canvas
var canvas = document.createElement("canvas");
canvas.id = "game";
var ctx = canvas.getContext("2d");
canvas.width = 320;
canvas.height = 280;
document.body.appendChild(canvas);
ctx.imageSmoothingEnabled = false;		//allow scale up of pixel images


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
var nat = new character("Nat", 4.5, 6, "", "nat_nb");
nat.sec_dir = "";

//buildings and environment

var capsuleIMG = new Image();
capsuleIMG.src = "../env_sprites/capsule_crash.png";
var capsule = new building(capsuleIMG, 100, 30);

var ufoIMG = new Image();
ufoIMG.src = "../env_sprites/vals_ship.png";
var ufo = new building(ufoIMG, 250, 130)

var shuttleIMG = new Image();
shuttleIMG.src = "../env_sprites/shuttle.png";
var shuttle = new building(shuttleIMG, 450, 170);

var buildings = [capsule, ufo, shuttle];

//planet coordinates
var planetXY = {
	x : 0,
	y : 0,
	pt : 0

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
		clearInterval(planetXY.mt);
		planetXY.mt = 0;

		return;
	}else{
		for(let b=0;b<buildings.length;b++){
			movePt(buildings[b],planetXY.x,planetXY.y)
		}
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

			movePlanet(planetXY, "x", nat.speed);
		}else if(keys[rightKey]){
			nat.dir = "east";
			nat.action = "move";

			movePlanet(planetXY, "x", -nat.speed);
		}else if(keys[upKey]){
			nat.dir = "north";
			nat.action = "move";

			movePlanet(planetXY, "y", nat.speed);
		}else if(keys[downKey]){
			nat.dir = "south";
			nat.action = "move";

			movePlanet(planetXY, "y", -nat.speed);
		}
	}
}

function movePlanet(p, a, m){
	if(planetXY.mt != 0)
		return;

	planetXY.mt = setTimeout(function(){
		if(a == "x")
			p.x += m
		else
			p.y += m
		clearTimeout(planetXY.mt);
		planetXY.mt = 0;
	},10);
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





function drawCraters(c){
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

	//draw the moon + objects
	drawMoonObjs([buildings], ctx);


	drawsprite(nat, ctx);

	
	
	ctx.restore();
}



//////////////   GAME LOOP FUNCTIONS   //////////////////

//game initialization function
function init(){
	for(let b=0;b<buildings.length;b++){
		movePt(buildings[b],planetXY.x,planetXY.y)
	}
}

//main game loop
function main(){
	requestAnimationFrame(main);
	canvas.focus();

	//panCamera();

	move_keyboard();

	//keep within planetary bounds
	if(planetXY.x > moonRad*4)
		planetXY.x = 0;
	if(planetXY.x < 0)
		planetXY.x = moonRad*4;
	if(planetXY.y > moonRad*4)
		planetXY.y = 0
	if(planetXY.y < 0)
		planetXY.y = moonRad*4;

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
	var settings = "PLANET: (" + planetXY.x + "," + planetXY.y + ")";
	settings += " | UFO: (" + Math.round(ufo.x) + "," + Math.round(ufo.y) + ")";
	settings += " | DARK: " + ufo.dark;

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
