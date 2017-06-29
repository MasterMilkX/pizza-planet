/*global levelList*/

var story = {
	//character stats
	natName : "Nat",
	ashName : "Ash",
	gender : ["m", "nb", "f"],
	pronouns : [["he", "him", "his"], ["they", "them", "their"], ["she", "her", "her"]],
	dating : ["boyfriend", "sig. other", "girlfriend"],
	natGen : 2,
	ashGen : 0,

	//mission
	cutscene : false,
	mission : "Moon Walk",
	task : "Go for a walk",
	area : "",
	storyIndex : 0,
	taskIndex : 0,
	trigger : "none",

	//dialogue
	dialogue : {
		text : "",
		index : 0,
		show : false
	}

};

function getLevelbyName(name, quad=null, sect=null){
	for(var l=0;l<levelList.length;l++){
		var level = levelList[l];
		if(name === "moon"){
			if(level.quad === quad && level.sect === sect)
				return level;
		}else{
			if(level.name == name){
				return level;
			}
		}
	}
	return null;
}

function getCharbyName(level, name){
	for(var c=0;c<level.chars.length;c++){
		var char = level.chars[c];
		if(char.name === name)
			return char;
	}
	return null;
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

	var waitForClose = 0;

if(mission === "Orientation"  && storyIndex == 0){
	if(task === "Go to Vals"){
		if(area === "vals"){
			//do something here
		}
	}
}

//test cutscene
else if(mission === "Moon Walk"  && storyIndex == 0){
	if(task === "Go for a walk"){
		if(area === "q2_newton"){
			if(trigger === "talk_damon" ){
				if(taskIndex == 0){
					cutscene = true;
					dialogue.text = ["Damon: Hey " + story.natName + ", let's go for a space walk"]
					dialogue.show = true;
				}else if(taskIndex == 1){
					console.log("WALK")
				}
				//wait to finish

				//console.log("STORY: " + storyIndex);

				//the end			
				//storyIndex+=1;
				//story.trigger = "none";
			}
		}
	}
}

}