/*global story*/

function event(setup, requirements, success_action, fail_action=null){
	setup();
	if(requirements()){
		success_action();
		return true;
	}else{
		fail_action();
		return false;
	}
}

function pre_req(stuff, ev){
	if(stuff())
		story.currentEvent = ev;
}

function nothing(){return true;}

//area for collision (x and y are relative to the object starting from the top right)
function boundArea(x, y, w, h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}


function myStory(npcs){
	function getNPC(name){
		for(var n=0;n<npcs.length;n++){
			if(npcs[n].name === name)
				return npcs[n];
		}
	}
	
	if(story.currentEvent === "val_interact"){
		pre_req(nothing(), "vals_default");
	}else if(story.currentEvent === "vals_default"){
		event(function(){
				var val = getNPC("mr_val");
	 			val.text = [story.natName + "! Go spend time with your " + story.dating[story.ashGen]];
				val.boundary = new boundArea(10, 7, 5, 4);
			},
			nothing(),
			nothing(),
		);
	}

}

