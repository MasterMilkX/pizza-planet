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
	ashGen : 0,
	lovePts : 0,

	//level data
	level : null,
	size : 16,

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

function getCharbyName(name){
	for(var c=0;c<story.level.chars.length;c++){
		var char = story.level.chars[c];
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
					story.nat.pathQueue.push(damon.lastPos);
					gotoPos(damon, [13, 21], story.level, story.size);
					console.log(story.nat.pathQueue)
					story.taskIndex = 2;
				}else if(taskIndex == 2){
					var damon = getCharbyName("damon");
					var dx = Math.floor(damon.x/story.size);
					var dy = Math.floor(damon.y/story.size);


					//console.log("run man!");
					//console.log(story.nat.pathQueue.length)
					//followBot(damon, story.nat, story.level, story.size);
					if(!inArr(story.nat.pathQueue, damon.lastPos)){
						console.log("go for it");
						story.nat.pathQueue.push(damon.lastPos);
					}
					console.log(story.nat.pathQueue[0])

					if((dx == 13) && (dy == 21) && (!damon.moving))
						story.taskIndex = 3;
					
						
					
					
				}else if(taskIndex == 3){
					faceOpposite(getCharbyName("damon"), story.nat)
					dialogue.text = ["Damon: That was a fun walk"];
					dialogue.show = true;
				}else{
					getCharbyName("damon").text = ["Damon: That's enough walking for today..."]
					story.storyIndex = 1;
					dialogue.show = false;
					story.cutscene = false;
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