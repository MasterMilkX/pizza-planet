var story = {
	//character stats
	natName : "Nat",
	ashName : "Ash",
	gender : ["m", "nb", "f"],
	pronouns : [["he", "him", "his", "he's"], ["they", "them", "their", "they're"], ["she", "her", "her", "she's"]],
	dating : ["boyfriend", "sig. other", "girlfriend"],
	natGen : 2,
	ashGen : 0,

	//mission
	mission : "none",
	task : "none",
	area : "",
	storyIndex : 0

}


//the entire script for the game
function play(){
if(mission === "Orientation"){
	if(task === "Go to Vals" && story.storyIndex == 0){
		if(area === "vals"){

		}
	}
}

}