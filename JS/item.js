
//the interact function
function canInteract(person, item){
	//get the positions
  	var rx;
  	var ry;
  	if(person.dir === "north" || person.dir === "west"){
      rx = Math.ceil(person.x / size);
	  ry = Math.ceil(person.y / size);
	}else if(person.dir === "south" || person.dir === "east"){
	  rx = Math.floor(person.x / size);
	  ry = Math.floor(person.y / size);
	}
  
  	//decide if adjacent to person
    var t = item;
    var t_ba = item.area;

    //get bounding box area
    var xArea = [];
    for(var z=0;z<t_ba.w;z++){
      xArea.push(t_ba.x+t.x+z);
    }
    var yArea = [];
    for(var z=0;z<t_ba.h;z++){
      yArea.push(t_ba.y+t.y+z);
    }

    //determine if able to interact
    var interact = false;
    if(person.dir == "north" && (xArea.indexOf(rx) !== -1) && (yArea.indexOf(ry-1) !== -1))
      interact = true;
    else if(person.dir == "south" && (xArea.indexOf(rx) !== -1) && (yArea.indexOf(ry+1) !== -1))
      interact = true;
    else if(person.dir == "east" && (xArea.indexOf(rx+1) !== -1) && (yArea.indexOf(ry) !== -1))
      interact = true;
    else if(person.dir == "west" && (xArea.indexOf(rx-1) !== -1) && (yArea.indexOf(ry) !== -1))
      interact = true;

  	return interact;
}