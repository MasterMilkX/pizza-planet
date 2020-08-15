/////////////////     OVERWORLD SCRIPT    ////////////////////

// GLOBAL VARIABLES //

//canvas width + height
let cw = 320;
let ch = 280;


// --- moon variables ---  //
let moonRad = cw/2;		//radius of the moon

//moon center
let mx = cw/2;
let my = ch;

var moonIMG = new Image();
moonIMG.src = "../env_sprites/moon.png";

// CLASS DEFINITIONS //
function building(img, x, y){
	this.img = img;

	//on the dark side of the moon
	this.start_dark = (x > (moonRad*2));
	this.dark = this.start_dark;

	//alter y so as to not overlap from bottom	
	y = (y > (moonRad*2) ? (r*4)-y : y);

	//render x,y
	this.x = x;
	this.y = y;

	/*
	//projected x,y
	this.yy = y;
	this.xx = x;
	*/

	//constant x,y
	this.cx = x;
	this.cy = y;

	/*
	//offset x,y
	this.ox = (x>(r*2) ? Math.abs((r*4)-x) : x);
	this.oy = (y>(r*2) ? Math.abs((r*4)-y) : y);

	//percentage x,y
	this.px = (this.ox/(2*r));
	this.py = (this.oy/(2*r));

	//radius x,y
	this.rx = 0;
	this.ry = 0;

	//lock x,y toggle
	this.lockx = false;
	this.lockx = true;
	*/
}


// UTILITY FUNCTIONS //

//convert the point's x,y based on moon radius
function convPt(p,rad){
	if(rad == 0)
		return p;

	if(p<0)
		return rad*4;
	else if(p>= (rad*4))
		return p%(rad*4);
	else
		return p;
}

//moves the point (building) on the moon
function movePt(p, x,y){
	let r = moonRad;

	//offset coords
	let ox = x+p.cx;
	let oy = y+p.cy;

	//offset double access coords
	//p.ox = ox;
	//p.oy = oy;
	while(ox > (r*2)){
		ox = Math.abs((r*4)-ox);
	}
	while(oy > (r*2)){
		oy = Math.abs((r*4)-oy);
	}

	px = convPt(ox, r);
	py = convPt(oy, r);

	//parabolic function for descent
	perx = -1*(1/(r*r))*Math.pow(px-r,2)+1;		
	pery = -1*(1/(r*r))*Math.pow(py-r,2)+1;

	//p.px = perx;
	//p.py = pery;	

	//square-based
	let xx = (ox > r ? r+(1-perx)*r : (r*perx));
	let yy = (oy > r ? r+(1-pery)*r : (r*pery));

	//set the alternative radii
	let rx = Math.sqrt(Math.pow(r,2)-Math.pow(r-yy,2));
	let ry = Math.sqrt(Math.pow(r,2)-Math.pow(r-xx,2));
	//p.rx = rx;
	//p.ry = ry;

	//lock at the edge temporarily
	let lockx = (xx > r+rx || xx < r-rx);
	let locky = (yy > r+ry || yy < r-ry);

	if(!lockx)
		p.x = xx;
	if(!locky)
		p.y = yy;
	

	//on the dark or light side of the planet
	if(ox % (2*r) == 0 || oy % (2*r) == 0){
		console.log("next!");
		p.dark = !p.dark;
	}

}

//draw a point on the moon
function drawMoonObjs(objs, ctx){
	//flatten object array
	objs = [].concat.apply([], objs);


	//split dark moon objects from front moon objects
	let darkMoon = [];
	let frontMoon = [];
	for(let o=0;o<objs.length;o++){
		if(objs[o].dark)
			darkMoon.push(objs[o]);
		else
			frontMoon.push(objs[o])
	}
 
	//draw dark moon objects first behind the moon
	for(let d=0;d<darkMoon.length;d++){
		let b = darkMoon[d];

		//if no image skip
		if(b.img == null || b.img.width == 0)
			continue;

		//building center
		let bx = mx-moonRad+b.x-2;
		let by = my-moonRad+b.y-2;
		ctx.drawImage(b.img, bx-b.img.width/2,by-b.img.height);
	}

	//draw the image of the moon
	ctx.drawImage(moonIMG, 0, 100,cw,ch-100);

	//draw light moon objects
	for(let f=0;f<frontMoon.length;f++){
		let b = frontMoon[f];

		//if no image skip
		if(b.img == null || b.img.width == 0)
			continue;

		//building center
		let bx = mx-moonRad+b.x-2;
		let by = my-moonRad+b.y-2;
		ctx.drawImage(b.img, bx-b.img.width/2,by-b.img.height);
	}

	

}
