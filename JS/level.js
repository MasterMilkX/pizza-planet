function levelDat(quad, sect, buildings, chars){
	this.quad = quad;
	this.sect = sect;
	this.buildings = buildings;
	this.chars = chars;
}

var levelList = [
	new levelDat("q2", "NEWTON", 
			[], 
			[new NPC("damon", 24, 15), new NPC("ash_m", 30, 10)])
];