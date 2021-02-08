	
//set up the canvas
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = 160;
canvas.height = 144;


// IMAGES

//[duet]
var ashduetIMG = new Image();
ashduetIMG.src = "sprites/ash_view_full.png";
var ashDReady = false;
ashduetIMG.onload = function(){ashDReady = true;};

var natduetIMG = new Image();
natduetIMG.src = "sprites/nat_view_full.png";
var natDReady = false;
natduetIMG.onload = function(){natDReady = true;};


// [band]
var ashbandIMG = new Image();
ashbandIMG.src = "sprites/ash_bass.png";
var ashBReady = false;
ashbandIMG.onload = function(){ashBReady = true;};

var natbandIMG = new Image();
natbandIMG.src = "sprites/nat_guitar.png";
var natBReady = false;
natbandIMG.onload = function(){natBReady = true;};

var damonbandIMG = new Image();
damonbandIMG.src = "sprites/damon_drums.png";
var damonBReady = false;
damonbandIMG.onload = function(){damonBReady = true;};


//sprite for dueting (ash and nat)
function duetMember(name){
	this.name = name;
	this.width = 144;
	this.height = 96;
	this.x = 8;
	this.y = -8;

	this.fps = 4;           
	this.fpr = 2;         
	this.action = "rhythm_open";
	this.show = false;
	this.curFrame = 0;
	this.ct = 0;
	this.canAnim = true;

	this.o_leadStrum = [0,4];
	this.o_rhythmStrum = [0,2,0,4];
	this.c_leadStrum = [1,3];
	this.c_rhythmStrum = [1,3,1,5];

	this.anim = {"rhythm_open":this.o_rhythmStrum,"rhythm_close":this.c_rhythmStrum,"lead_open":this.o_leadStrum,"lead_close":this.c_leadStrum};

	if(name == "ash"){
		this.img = ashduetIMG;
		this.ready = ashDReady;
	}else if(name == "nat"){
		this.img = natduetIMG;
		this.ready = natDReady;
	}
}

//sprite for band playing
function bandMember(name){
	this.name = name;
	this.width = 48;
	this.height = 48;

	this.fps = 8;           
	this.fpr = 3;         
	this.action = "back_idle";
	this.show = false;
	this.curFrame = 0;
	this.ct = 0;

	this.i_solo = [0,1];
	this.i_back = [0,1,0,2];
	this.b_back = [0,1,0,5];
	this.c_solo = [6,7];
	this.c_back = [6,7,6,8];

	this.anim = {"back_idle":this.i_back,"solo_idle":this.i_solo,"back_bop":this.b_back,"back_close":this.c_back,"solo_close":this.c_solo};

	if(name == "ash"){
		this.img = ashbandIMG;
		this.ready = ashBReady;
		this.x = 14;
		this.y = 32;
	}else if(name == "nat"){
		this.img = natbandIMG;
		this.ready = natBReady;
		this.x = 109;
		this.y = 32;
	}else if(name == "damon"){
		this.img = damonbandIMG;
		this.ready = damonBReady;
		this.x = 56;
		this.y = 8;
	}
}

var ashDuet = new duetMember("ash");
var natDuet = new duetMember("nat");

var ashBand = new bandMember("ash");
var natBand = new bandMember("nat");
var damonBand = new bandMember("damon");
damonBand.i_back = [0,2,0,1];
damonBand.i_solo = [0,2];

var characters = [ashDuet,natDuet,ashBand,natBand,damonBand];


var ashHeart = new Image();
ashHeart.src = "sprites/ash_heart.png";
var ashHReady = false;
ashHeart.onload = function(){ashHReady = true;}

var natHeart = new Image();
natHeart.src = "sprites/nat_heart.png";
var natHReady = false;
natHeart.onload = function(){natHReady = true;}

var damonHeart = new Image();
damonHeart.src = "sprites/damon_heart.png";
var damonHReady = false;
damonHeart.onload = function(){damonHReady = true;}


//GAME PROPERTIES
var curSong = null;
var curPlayer = "band";



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



//////////////////  RENDER FUNCTIONS  ////////////////////

function checkRender(){
	for(let c=0;c<characters.length;c++){
		let player = characters[c];
		if(!player.ready){
			player.img.onload = function(){player.ready = true;}
			if(player.img.width !== 0){
				player.ready = true;
			}
		}
	}
}


function loopSprite(sprite){
	repeatAnim(sprite);
	rendersprite(sprite);
}

//update animation
function repeatAnim(sprite){
	let seq = sprite.anim[sprite.action];
	let seqLen = seq.length;

	//update the frames
	if(sprite.ct == (sprite.fps - 1))
		sprite.curFrame = (sprite.curFrame + 1) % seqLen;
		
	sprite.ct = (sprite.ct + 1) % sprite.fps;
}

//reset the animation once it finishes
function resetAnim(sprite){
	sprite.curFrame = 0;
	sprite.ct = 0;
	sprite.canAnim = true;
	//sprite.st = setTimeout(function(){sprite.curFrame = 0;clearTimeout(sprite.st);sprite.st=0;},(1000/sprite.fps)*sprite.anim[sprite.action]);
}
//animate on the sequence once
function onceAnim(sprite){
	if(!sprite.canAnim)
		return;

	let seq = sprite.anim[sprite.action];
	let seqLen = seq.length;

	//update the frames
	if(sprite.ct == (sprite.fps - 1)){
		if(sprite.curFrame+1 == seqLen){	//end of sequence
			sprite.curFrame = 0;
			sprite.canAnim = false;
			//console.log("done");
			return;
		}	
		else{
			sprite.curFrame = (sprite.curFrame + 1) % seqLen;
		}
		
	}
		
	sprite.ct = (sprite.ct + 1) % sprite.fps;
}


//draw the sprite
function rendersprite(sprite){
	//set the animation sequence
	var sequence = sprite.anim[sprite.action];
	
	//get the row and col of the current frame
	var row = Math.floor(sequence[sprite.curFrame] / sprite.fpr);
	var col = Math.floor(sequence[sprite.curFrame] % sprite.fpr);
	
	var sprIMG = sprite.img;

	if(sprite.show && sprite.ready){
		ctx.drawImage(sprIMG, 
		col * sprite.width, row * sprite.height, 
		sprite.width, sprite.height,
		sprite.x, sprite.y, 
		sprite.width, sprite.height);
	}
}


function render(){
	ctx.save();
	//ctx.translate(-camera.x, -camera.y);		//camera
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	//background
	ctx.fillStyle = "#dedede";
	ctx.fillRect(0,0,canvas.width, canvas.height);
	
	/*   add draw functions here  */
	checkRender();


	setStage(curPlayer);
	
	ctx.restore();
}

//draw the game screen based on who's playing
function setStage(stageType){	
	if(stageType == "duet_ash"){
		//draw backgrounds
		ctx.fillStyle = "#C97ED6";
		ctx.fillRect(0,0,canvas.width,96);
		ctx.fillStyle = "#343434";
		ctx.fillRect(0,96,canvas.width,112);

		ashDuet.show = true;

		//draw characters
		onceAnim(ashDuet);
		rendersprite(ashDuet);

		//draw hearts
		ctx.drawImage(ashHeart,0,0,64,64,24,112,24,24);
		ctx.drawImage(natHeart,0,0,64,64,112,112,24,24);
	}
	else if(stageType == "duet_nat"){
		//draw backgrounds
		ctx.fillStyle = "#7EC5D6";
		ctx.fillRect(0,0,canvas.width,96);
		ctx.fillStyle = "#343434";
		ctx.fillRect(0,96,canvas.width,112);

		natDuet.show = true;

		//draw characters
		onceAnim(natDuet);
		rendersprite(natDuet);

		//draw hearts
		ctx.drawImage(ashHeart,0,0,64,64,24,112,24,24);
		ctx.drawImage(natHeart,0,0,64,64,112,112,24,24);
	}else if(stageType == "band"){
		//draw backgrounds
		ctx.fillStyle = "#cdcdcd";
		ctx.fillRect(0,0,canvas.width,96);
		ctx.fillStyle = "#343434";
		ctx.fillRect(0,96,canvas.width,112);

		natBand.show = true;
		ashBand.show = true;
		damonBand.show = true;

		//draw characters
		onceAnim(natBand);
		rendersprite(natBand);
		onceAnim(ashBand);
		rendersprite(ashBand);
		onceAnim(damonBand);
		rendersprite(damonBand);


		//draw hearts
		ctx.drawImage(ashHeart,0,0,64,64,20,112,24,24);
		ctx.drawImage(natHeart,0,0,64,64,116,112,24,24);
		ctx.drawImage(damonHeart,0,0,64,64,68,112,24,24);
	}
}

//hide all characters
function hideAllChars(){
	for(let c=0;c<characters.length;c++){
		characters[c].show = false;
	}
}


//////////////////   MUSIC FUNCTIONS  ///////////////////

function testSong(){
	console.log("songy time!")


	// Initialize player and register event handler
	var Player = new MidiPlayer.Player(function(event) {
		console.log(event);
	});

	// Load a MIDI file
	let xhr = new XMLHttpRequest();

	// Use JSFiddle logo as a sample image to avoid complicating
	// this example with cross-domain issues.
	xhr.open( "GET", "/music/midi/title_and_registration_ash_and_nat.midi");
	//xhr.open( "GET", "/cave_story.mid");

	// Ask for the result as an ArrayBuffer.
	xhr.responseType = "arraybuffer";

	xhr.onreadystatechange = function() {
		//var arrayBufferView = new Uint8Array( xhr.response );
    	//var blob = new Blob( [ arrayBufferView ], { type: "audio/midi" } );

	//fr.readAsArrayBuffer('../music/midi/title_and_registration_ash_and_nat.midi');
	//reader.addEventListener("load", function () {
			Player = new MidiPlayer.Player(function(event) {
				if (event.name == 'Note on' && event.channel == 1) {
					console.log("Ash: " + event.tick);
					//instrument.play(event.noteName, ac.currentTime, {gain:event.velocity/100});
					//document.querySelector('#track-' + event.track + ' code').innerHTML = JSON.stringify(event);
				}else if(event.name == "Note on" && event.channel == 4){
					console.log("Guitar: " + event.tick);
				}
			});
			Player.loadArrayBuffer(xhr.response);
			

			//buildTracksHtml();
			console.log("SONG LOADED")
			Player.play();
	}
	//}, false);
	//Player.loadFile('../music/midi/title_and_registration_ash_and_nat.midi');
	//Player.play();

	console.log("fini")
	xhr.send();
}




//////////////   GAME LOOP FUNCTIONS   //////////////////

let strum = true;

//game initialization function
function init(){
	//testSong()
}

//main game loop
function main(){
	requestAnimationFrame(main);
	canvas.focus();

	//panCamera();

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

	//strum test
	if(keys[a_key] && strum){
		resetAnim(ashDuet);
		resetAnim(natDuet);
		resetAnim(ashBand);
		resetAnim(damonBand);
		resetAnim(natBand);
		strum = false;
	}if(!keys[a_key])
		strum = true;

	//debug
	var settings = keys[a_key];

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
