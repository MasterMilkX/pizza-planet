/*global levelList*/

var story = {
	//character stats
	nat : null,
	ash : null,
	natName : "Nat",
	ashName : "Ash",
	gender : ["m", "nb", "f"],
	pronouns : [["he", "him", "his"], ["they", "them", "their"], ["she", "her", "her"]],
	dating : ["boyfriend", "sig. other", "girlfriend"],
	natGen : 1,
	ashGen : 2,
	lovePts : 0,

	//level data
	level : null,
	size : 16,

	//mission
	cutscene : false,
	mission : "Lucky",
	task : "Punch Me",
	area : "",
	storyIndex : 0,
	taskIndex : 0,
	trigger : "none",

	//dialogue
	dialogue : {
		text : "",
		index : 0,
		show : false
	},
	choice_box : {
		options : [],
		index : 0,
		show : false
	}

};

function getCharbyName(name){
	for(var c=0;c<story.level.chars.length;c++){
		var char = story.level.chars[c];
		if(char.name === name)
			return char;
	}z
	return null;
}


//NOTE: slightly glitchy but gives best result :/
function follow(p1, p2){

	var nx;
    var ny;
    if(p1.dir === "north" || p1.dir === "west"){
      nx = Math.ceil(p1.x / size);
      ny = Math.ceil(p1.y / size);
    }else if(p1.dir === "south" || p1.dir === "east"){
      nx = Math.floor(p1.x / size);
      ny = Math.floor(p1.y / size);
    }


	if(p2.moving){
		if(p1.pathQueue.length > 0 && !arrEq(p1.pathQueue[0], [nx, ny])){
			//console.log("not done");
			return;
		}
		else if((p1.pathQueue.length == 0) || (p1.pathQueue.length > 0 && arrEq(p1.pathQueue[0], [nx, ny]))){
			//console.log("next step")
			gotoBot(p2, p1, story.level, story.size);
			return;
		}
	}

	return;

}

function reset(){
	story.taskIndex = 0;
	story.dialogue.show = false;
	story.choice_box.show = false;
	story.cutscene = false;
}

//the entire script for the game
function play(){
	//make local variables
	var mission = story.mission;
	var task = story.task;
	var area = story.area;
	var trigger = story.trigger;
	var storyIndex = story.storyIndex;
	var taskIndex = story.taskIndex;
	var cutscene = story.cutscene;
	var dialogue = story.dialogue;
	var choice = story.choice_box;


	//permavariables
	if(area === "shuttle"){
		getCharbyName("ash_" + story.gender[story.ashGen]).text = ["Hey bae~"]
	}


if(mission === "Orientation"  && storyIndex == 0){
	if(task === "Go to Vals"){
		if(area === "vals"){
			//do something here
		}
	}
}

//test option
else if(mission === "Lucky" && storyIndex == 0){
	if(task === "Punch Me"){
		if(area === "q2_newton"){
			if(trigger === "talk_damon"){
				story.cutscene = true;
				if(taskIndex == 0){
					dialogue.text = ["Damon: Feeling lucky?"];
					choice.show = true;
					choice.options = ["Sure?", "Not really"];
					dialogue.show = true;
				}else{
					reset();
				}
			}
			else if(trigger === "> Sure?" && taskIndex == 1){
				dialogue.text = ["Damon: Then punch me! I dare you!"];
				choice.show = true;
				choice.options = ["Punch", "Don't Punch"];
				dialogue.show = true;			
			}else if(trigger === "> Not really"){
				if(taskIndex == 1){
					choice.show = false;
					dialogue.text = ["Damon: Ha! Didn't think so!"];
					dialogue.show = true;
				}else{
					story.taskIndex = 0;
					story.cutscene = false;
				}
			}else if(trigger === "> Punch"){
				if(taskIndex == 2){
					choice.show = false;
					dialogue.text = ["POW!", 
									"Damon: Whoa! That's quite a punch!",
									"I underestimated you, " + story.natName + "!", 
									"Here's a prize",
									story.natName + " got a badge...?",
									"Damon: That'll show everyone you're not", "somebody to mess with!"];
					dialogue.show = true;
				}else{
					getCharbyName("damon").text = ["Damon: That'll show everyone you're not", "somebody to mess with!"]
					story.nat.inventory.push("punch badge");
					story.mission = "Moon Walk";
					story.task = "Go for a walk";
					story.cutscene = false;
					story.taskIndex = 0;
				}
			}else if(trigger === "> Don't Punch"){
				if(taskIndex == 2){
					choice.show = false;
					dialogue.text = ["Damon: Chicken..."];
					dialogue.show = true;
				}else{
					story.taskIndex = 0;
					story.cutscene = false;
				}
			}
		}
	}
}

//test follow cutscene
else if(mission === "Moon Walk"  && storyIndex == 0){
	if(task === "Go for a walk"){
		if(area === "q2_newton"){
			if(trigger === "talk_damon"){
				story.cutscene = true;
				if(taskIndex == 0){
					dialogue.text = ["Damon: Hey " + story.natName + ", let's go for a space walk"]
					dialogue.show = true;
				}else if(taskIndex == 1){
					dialogue.show = false;
					story.nat.board = false;
					//goto 
					var damon = getCharbyName("damon");
					gotoPos(damon, [13, 21], story.level, story.size);
					story.taskIndex = 2;
				}else if(taskIndex == 2){
					var damon = getCharbyName("damon");
					var dx = Math.floor(damon.x/story.size);
					var dy = Math.floor(damon.y/story.size);

					follow(story.nat, damon)

					//if(story.nat.pathQueue.length == 0)
					//	gotoBot(damon, story.nat, story.level, story.size)


					if((dx == 13) && (dy == 21) && (!damon.moving))
						story.taskIndex = 3;
					
						
					
					
				}else if(taskIndex == 3){
					story.nat.following = false;
					faceOpposite(getCharbyName("damon"), story.nat)
					dialogue.text = ["Damon: That was a fun walk"];
					dialogue.show = true;
				}else{
					getCharbyName("damon").text = ["Damon: That's enough walking for today..."]
					story.storyIndex = 1;
					dialogue.show = false;
					story.cutscene = false;
				}
			}
		}
	}
}

}