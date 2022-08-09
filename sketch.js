var grid = [] //not needed
var gridSize; // the size of a 'spot' or gap between lines
var lines = [];
var b;
var X;
var Y;
function setup() {
  
  squareCanvas();
  gridSize = width/30
  var l = 0;
  for (var i = 0; i < width; i+=gridSize/2)
  {
    grid.push([])
    for (var o = 0; o < width; o+=gridSize/2)
    {
      grid[l].push(0);
    }
    l++;
  }
  
  b = createButton('pathFind');
  b.position(width-width/10,0)
  b.mousePressed(pf)
}

function draw() {
  background(0);
  
  
  //set up drawing state
  noLoop();
  noFill();
  stroke(255)
  strokeWeight(2)
  rect(0,0,width,height)
  //
 //fix(); 
  sqr(createVector(0,0),createVector(width/gridSize,width/gridSize),true,1)
  fix(); 
  /*
  for (var i = 0; i < grid.length; i++)
  {
    for (var o = 0; o < grid[i].length; o++)
    {
      if (grid[i][o]==0)
         stroke(0,0)
      else if (grid[i][o]==2)
      {
        stroke('green')
      }
      else
       stroke('red')
      strokeWeight(2)
      point(i*gridSize/2,o*gridSize/2)
    }
  }*/
  X = grid.length-2;
  Y = grid.length-2
}


//function for a square or room
// p1 and p2 are opposing corners (vector .x, .y)
//dir is direction of wall either vertical or horizontal (true or false)
//a is just a recursive counter to make sure it doesnt keep going
function sqr(p1,p2,dir,a)
{
  var c = [true,false]//not needed
  
  if (a>100)//only do 100 iterations
  {
    return;
  }
  
  
  //if area of box is too small
  if (abs(p1.x-p2.x)<2||abs(p1.y-p2.y)<2)
  {
    return;
  }
  
  
  
  
  //for vertical walls
  if (dir)
  {
    
    //random wall
    var xCoord = floor(random(p1.x+1,p2.x))
    
    //make new wall(line)
    var div = new Line(xCoord,p1.y,xCoord,p2.y,dir)
    div.draw();
   
    //recursive
    sqr(createVector(p1.x,p1.y),createVector(div.x2,div.y2),!dir,a+1)
    sqr(createVector(div.x1,div.y1),createVector(p2.x,p2.y),!dir,a+1)

    
    stroke(255)
    //line(p1.x*gridSize,p1.y*gridSize,div.gap*gridSize,p2.y*gridSize)
  }else
  {
    //random horizontal wall
    var yCoord = floor(random(p1.y+1,p2.y))
    //make wall (line)
    var div = new Line(p1.x,yCoord,p2.x,yCoord,dir)
    div.draw();
    
    
    //recursive
    sqr(createVector(p1.x,p1.y),createVector(div.x2,div.y2),!dir,a+1)
    sqr(createVector(div.x1,div.y1),createVector(p2.x,p2.y),!dir,a+1)
  }
  
}

//line class
//resposible for keeping track of gap and coords
class Line
{
  constructor(x1,y1,x2,y2,dir)
  {
    //corner1
    this.x1 = x1;
    this.x2 = x2;
    
    //corner2
    this.y1 = y1;
    this.y2 = y2;
    
    //direction
    this.dir = dir;
    
    //place gap
    if (dir){
      this.gap = floor(random(y1,y2))
    }
    else
    {
      this.gap = floor(random(x1,x2))
    }
    lines.push(this);
  }
  
  
  //method for drawing a line
  //draws 2 lines, one up to the gap and one from the gap to the end
  draw()
  {
    push();
    stroke(255)
    strokeWeight(2)
    //line(this.x1*gridSize,this.y1*gridSize,this.x2*gridSize,this.y2*gridSize);
    
    if (this.dir){
      
      
      line(this.x1*gridSize,this.y1*gridSize,this.x1*gridSize,(this.gap)*gridSize)
      line(this.x2*gridSize,this.y2*gridSize,this.x1*gridSize,(this.gap+1)*gridSize)
    
      grid[this.x1*2][(this.gap)*2+1] = 2;
      
    }
    else
    {
     
      line(this.x1*gridSize,this.y1*gridSize,(this.gap)*gridSize,this.y1*gridSize);
      line((this.gap+1)*gridSize,this.y1*gridSize,this.x2*gridSize,this.y2*gridSize);
      
      grid[(this.gap)*2+1][this.y1*2]=2
    }
    pop();
  }
}
  
function fix()
{
  
  //make point not 0 if line is there
  for (var i = 0; i < lines.length; i++)
  {
    for (var y = 0; y < grid.length; y++)
    {
      for (var x = 0; x < grid[y].length; x++)
      {
        if (collidePointLine(y*gridSize/2,x*gridSize/2,lines[i].x1*gridSize,lines[i].y1*gridSize,lines[i].x2*gridSize,lines[i].y2*gridSize))
        {
          if (grid[y][x]!=2)
            grid[y][x]=1
        }
      }
    }
  }
  
  //make edges all not 0;
  for (var y = 0; y < grid.length; y++)
  {
    for (var x = 0; x < grid[y].length; x++)
    {
      if (y==0||x==0||y==grid.length||x==grid[y].length)
      {
        grid[y][x]=1;
      }
      if (grid[y][x]==2)
      {
        grid[y][x]=0
      }
    }
  }
}
var r = 0;
function pf()
{
  r++;
  if (r >= 2)
  {
    X = 1;
    stroke(255,0,0,255/2)
  }else
  {
    stroke(47,157,226,255)
  }
  curveTightness(0.6)
  console.time("Pf")
  var g = new PF.Grid(grid);
  var finder = new PF.AStarFinder();
  var path = finder.findPath(1, 1, X,Y, g);
  var newPath = PF.Util.compressPath(path);
  //var newPath = PF.Util.smoothenPath(g, path);
  noFill();
  strokeWeight(4)
  
  beginShape();
  vertex(newPath[0][1]*gridSize/2,newPath[0][0]*gridSize/2)
  for (var i = 0; i < newPath.length; i++)
  {
    curveVertex(newPath[i][1]*gridSize/2,newPath[i][0]*gridSize/2)
  }
  vertex(newPath[newPath.length-1][1]*gridSize/2,newPath[newPath.length-1][0]*gridSize/2)
  endShape();
  console.timeEnd("Pf")
  
}

