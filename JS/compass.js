////////////////////////
///   BST MOVEMENT   ///
///   PATHFINDING    ///
////////////////////////


function gotoPos(robot, pos, level, size, extra=null, exclusions=null){
  var map = binMap(level, size, extra, exclusions);

  //if no target move on
  

  //function variables
  var frontier = [];
  var closedCells = [];
  var index = 0;
  var parents = [];

  //position variables
  var robotX = Math.round(robot.x / size);
  var robotY = Math.round(robot.y / size);
  var targetX = pos[0];
  var targetY = pos[1];
  var robotPos = [robotX, robotY];
  var targetPos = [targetX, targetY];

  if(arrEq(robotPos, targetPos))
    return;

  //add initial position to the sets
  frontier.push(robotPos);
  closedCells.push(robotPos);

  //////   BFS algorithm  ////////
  while(index < frontier.length){
    //get the neighbors of the node - north,south,east,west
    var neighbors = getMapNeighbors(frontier[index], map);

    //go through the neighbors of the node
    for(var t = 0; t < neighbors.length; t++){
      if(!inClosedCells(neighbors[t], closedCells)){
        closedCells.push(neighbors[t]);
        frontier.push(neighbors[t]);
        if(!inParents(neighbors[t], parents)){
          var family = [frontier[index], neighbors[t]];     //parent then child
          parents.push(family);
        }
      }
    }
    index++;
  }

  //make a path from the area
  var path = findPath(robotPos, targetPos, closedCells, parents);

  //if the path isn't unreachable or empty
  if(path.length != 0 && !arrEq(path[0], [-1,-1])){
    //convert back
    var q = [];
    for(var p=0;p<path.length;p++){
      q.push(path[(path.length-1)-p]);
    }
    robot.pathQueue = q;
  }else{
    story.taskIndex++;
  }

  return;
}

//faces the main character
function faceOpposite(npc, other){
  if(other.dir === "north")
    npc.dir = "south";
  else if(other.dir === "south")
    npc.dir = "north"
  else if(other.dir === "west")
    npc.dir = "east"
  else if(other.dir === "east")
    npc.dir = "west"
}


function followBot(leader, follower, level, size){
  var leaderX;
  var leaderY;
  if(leader.dir === "north" || leader.dir === "west"){
    leaderX = Math.ceil(leader.x / size);
    leaderY = Math.ceil(leader.y / size);
  }else if(leader.dir === "south" || leader.dir === "east"){
    leaderX = Math.floor(leader.x / size);
    leaderY = Math.floor(leader.y / size);
  }

  console.log(leaderX + ", " + leaderY);

  if(leader.dir === "north")
    gotoPos(follower, [leaderX, leaderY+1], level, size);
  else if(leader.dir === "south")
    gotoPos(follower, [leaderX, leaderY-1], level, size);
  else if(leader.dir === "east")
    gotoPos(follower, [leaderX+1, leaderY], level, size);
  else if(leader.dir === "west")
    gotoPos(follower, [leaderX-1, leaderY], level, size);

}


function binMap(level, size, extra=null, exclusions=null){
  var mapStuff = level.map;
  var b_map = [];
  var collSet = mapStuff.collision;

  //get map collisions
  for(var y = 0; y < mapStuff.rows; y++){
    var r = [];
    for(var x = 0; x < mapStuff.cols; x++){
      r.push((inArr(collSet, mapStuff.map[y][x]) ? 1 : 0));
    }
    b_map.push(r);
  }

  //get npc collisions
  var npcCol = [];
  var chars = level.chars;
  for(var n=0;n<chars.length;n++){
    npcCol.push(Math.floor(chars[n].x/size) + ", " + Math.floor(chars[n].y/size));
    //console.log(npcCol[n]);
  }

  for(var y = 0; y < mapStuff.rows; y++){
    for(var x = 0; x < mapStuff.cols; x++){
      if(b_map[y][x] == 0){
        var pos = x + ", " + y;
        b_map[y][x] = (inArr(npcCol, pos) ? 1 : 0);
      }
    }
  }

  //get item collision
  var itemCol = [];
  for(var i=0;i<level.items.length;i++){
    var t = level.items[i];
    var t_ba = t.area;

    if(t.area == null){
      itemCol.push(t.x + ", " + t.y);
      continue;
    }

    //get bounding box area
    for(var a=0;a<t_ba.h;a++){
      for(var b=0;b<t_ba.w;b++){
        itemCol.push((t.x + t_ba.x +b) + ", " + (t.y + t_ba.y + a));
      }
    }
  }

  for(var y = 0; y < mapStuff.rows; y++){
    for(var x = 0; x < mapStuff.cols; x++){
      if(b_map[y][x] == 0){
        var pos = x + ", " + y;

        //if(x % 5 == 0 && y % 5 == 0)
        //console.log(pos + " vs. " + itemCol[1]);
        b_map[y][x] = (inArr(itemCol, pos) ? 1 : 0);
      }
    }
  }  

  //get building collision
  var buildCol = [];
  for(var b=0;b<level.buildings.length;b++){
    var t = level.buildings[b];
    var t_ba = t.area;

    if(t.area == null){
      buildCol.push(t.x + ", " + t.y);
      continue;
    }

    //get bounding box area
    for(var a=0;a<t_ba.h;a++){
      for(var b=0;b<t_ba.w;b++){
        buildCol.push((t.x + b) + ", " + (t.y + a));
      }
    }
  }

  for(var y = 0; y < mapStuff.rows; y++){
    for(var x = 0; x < mapStuff.cols; x++){
      if(b_map[y][x] == 0){
        var pos = x + ", " + y;
        b_map[y][x] = (inArr(buildCol, pos) ? 1 : 0);
      }
    }
  }  

  //get teleport collision
  var telCol = [];
  var teleports = level.teleports
  for(var e=0;e<teleports.length;e++){
    telCol.push(Math.floor(teleports[e].ax) + ", " + Math.floor(teleports[e].ay));
  }



  for(var y = 0; y < mapStuff.rows; y++){
    for(var x = 0; x < mapStuff.cols; x++){
      if(b_map[y][x] == 0){
        var pos = x + ", " + y;
        b_map[y][x] = (inArr(telCol, pos) ? 1 : 0);
      }
    }
  }

  var ashPos = Math.floor(story.ash.x/size) + ", " + Math.floor(story.ash.y/size);
  var natPos = Math.floor(story.nat.x/size) + ", " + Math.floor(story.nat.y/size);

  //get ash and nat
  for(var y = 0; y < mapStuff.rows; y++){
    for(var x = 0; x < mapStuff.cols; x++){
      if(b_map[y][x] == 0){
        var pos = x + ", " + y;
        b_map[y][x] = (pos === ashPos || pos === natPos ? 1 : 0);
      }
    }
  }

  //add any other exclusions or extra
  if(extra !== null){
    for(var y = 0; y < mapStuff.rows; y++){
      for(var x = 0; x < mapStuff.cols; x++){
        if(b_map[y][x] == 0){
          var pos = x + ", " + y;
          b_map[y][x] = (inArr(extra, pos) ? 1 : 0);
        }
      }
    } 
  }

  if(exclusions !== null){
    for(var y = 0; y < mapStuff.rows; y++){
      for(var x = 0; x < mapStuff.cols; x++){
        if(b_map[y][x] == 0){
          var pos = x + ", " + y;
          b_map[y][x] = (inArr(exclusions, pos) ? 0 : 1);
        }
      }
    } 
  }


  return b_map;
}

//get the north, south, east, and west positions of the node from the map
function getMapNeighbors(pos, map){
  var neighbor = [];

  var north = [pos[0], pos[1]-1];
  var east = [pos[0]+1, pos[1]];
  var south = [pos[0], pos[1]+1];
  var west = [pos[0]-1, pos[1]];

  //check if the nodes exist - if so, add them to the neighbor list
  if(((pos[1] - 1) >= 0) && (map[pos[1] - 1][pos[0]] != 1))
    neighbor.push(north);
  if(((pos[0] - 1) >= 0) && (map[pos[1]][pos[0]-1] != 1))
    neighbor.push(west);
  if(((pos[1] + 1) < map.length) && (map[pos[1] + 1][pos[0]] != 1))
    neighbor.push(south);
  if(((pos[0] + 1) < map[0].length) && (map[pos[1]][pos[0]+1] != 1))
    neighbor.push(east);
  
  return neighbor;
}

//checks if node is in the closedCell array
function inClosedCells(pos, cc){
  for(var v = 0; v < cc.length; v++){
    if(arrEq(pos, cc[v]))
      return true;
  }
  return false;
}

//check if node is in the parents array
function inParents(pos, parents){
  for(var v = 0; v < parents.length; v++){
    for(var o = 0; o < parents[v].length; o++){
      if(arrEq(pos, parents[v][o]))
        return true;
    }
  }
  return false;
}

//cc = closedCells, p = parents
function findPath(start, end, cc, p){
  var path = []
  if(inClosedCells(end, cc)){
    while(!arrEq(end, start)){
      path.push(end);
      end = findParents(end, p);
    }
    return path;
  }
  return [[-1,-1]];
}

//finds the original parent of a particular node
function findParents(child, parents){
  for(var y = 0; y < parents.length; y++){
    var dad = parents[y][0];
    var kid = parents[y][1];
    if(arrEq(kid, child)){
      return dad;
    }
  }
  return [-1,-1];
}

//checks if two arrays are equivalent based on the elements
function arrEq(arr1, arr2){
  for(var p = 0; p < arr1.length; p++){
    if(arr1[p] !== arr2[p])
      return false
  }
  return true;
}