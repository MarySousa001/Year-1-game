
//Global variables
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlumeting;

var game_score;
var flagpole;
var lives;

var canyon;
var collectable;

var sun;
var building;
var _trees;
var mountain;
var platforms;
var enemies;
var clouds;

var mus_3;

function preload()
{
//    preload images
    trees = loadImage("tree.png");
    heart = loadImage("heart.png");
    
    soundFormats('mp3','wav');
    mus_2 = loadSound('assets/jump.wav');
    mus_2.setVolume(0.1);
    mus_1 = loadSound('assets/sound1.mp3');
    mus_1.setVolume(0.1);
    mus_3 = loadSound('assets/sound3.mp3');
    mus_3.setVolume(0.1);
}
function setup()
{
    createCanvas(1024, 676);
    floorPos_y = height * 3/3.5;
    lives = 4;
    startGame();
}
function startGame()
{
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
	scrollPos = 0;    
	gameChar_world_x = gameChar_x - scrollPos;

	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlumeting = false;

        canyon=[
        {x_pos: 100, width: 100},
        {x_pos: 800, width: 105},
        {x_pos: 1500, width: 110}
           ];
    
        collectable = [
        { x_pos : 100, y_pos : 320, size: 1.0, isFound: false},
        { x_pos : 900, y_pos : 320, size: 1.0, isFound: false},
        { x_pos : 1200, y_pos : 320, size: 1.0, isFound: false},
        { x_pos : 1700, y_pos : 320, size: 1.0, isFound: false}
                  ];
    
    flagpole ={x_pos: 2800, isReached: false};
     
    game_score = 0;
    lives -=1;    
    sun={x:100, y:350};
    building = [];
    _trees = [];
    platforms = [];
    mountain = [];
    enemies = [];
    clouds = [];
    
//    building 
    building.push( new Building(0,floorPos_y - 345,180,300));
    building.push( new Building(700,floorPos_y - 345,180,300));
    building.push( new Building(1400,floorPos_y - 345,180,300));
    
//    trees
    _trees.push( new drawTrees(450, floorPos_y-85, 160,220));
    _trees.push( new drawTrees(550, floorPos_y-85, 160,220));
    _trees.push( new drawTrees(1150, floorPos_y-45, 160,180));
    _trees.push( new drawTrees(1250, floorPos_y-45, 160,180));
    _trees.push( new drawTrees(1900, floorPos_y-45, 160,180));
    _trees.push( new drawTrees(2050, floorPos_y-45, 160,180));
    _trees.push( new drawTrees(2250, floorPos_y-45, 160,180));
    
//    Platform
    platforms.push(new Platform(180,floorPos_y - 90,70));
    platforms.push(new Platform(210,floorPos_y - 180,70));
    platforms.push(new Platform(880,floorPos_y - 90,70));
    platforms.push(new Platform(950,floorPos_y - 160,70));
    platforms.push(new Platform(1030,floorPos_y - 200,100));
    platforms.push(new Platform(1610,floorPos_y - 90,70));
    platforms.push(new Platform(1530,floorPos_y - 160,100));
    
//    mountain
    mountain.push(new Mountain(-400,floorPos_y-43));
    mountain.push(new Mountain(2000,floorPos_y-43));
    mountain.push(new Mountain(2400,floorPos_y-43));
    
//    enemies
    enemies.push(new Enemy(0,floorPos_y, 100));
    enemies.push(new Enemy(650,floorPos_y, 140));
    enemies.push(new Enemy(1010,floorPos_y, 180));
    enemies.push(new Enemy(1600,floorPos_y, 220));
    enemies.push(new Enemy(2000,floorPos_y, 250));
    
//    clouds
    clouds.push(new Cloud(120,80));
    clouds.push(new Cloud(420,110));
    clouds.push(new Cloud(920,90));
    clouds.push(new Cloud(1320,50));
    clouds.push(new Cloud(1820,100));
    clouds.push(new Cloud(2420,80));
}
    
function draw()
{
    background(100, 155, 255);
    noStroke();
	fill(128,128,128);
	rect(0, floorPos_y, width, height/4);
    stroke(0);
    fill(40,40,40);
    rect(0,floorPos_y-40,width,40);    
    
    drawSun(); // this is for drawing the sun
    
    push();
    translate(scrollPos,0);
    drawFloor(); // this is for drawing the floor
    
    for(var i=0; i<mountain.length; i++)
        {
            mountain[i].display();
        }
    for (var i=0; i<building.length; i++)
        {
            building[i].display();
        }
    for (var i=0; i<_trees.length; i++)
        {
            _trees[i].display();
        }
    for(var i = 0; i < canyon.length; i++)
        {
            drawCanyon(canyon[i]);
            checkCanyon(canyon[i]);
        }
    if(isPlumeting == true)
        {   
            gameChar_y += 3;
            isLeft = false;
            isRight = false;
            mus_3.play();
        }
        else{
            isPlumeting = false;
            }
    for(var i=0 ; i< collectable.length; i++)
        { 
            if(collectable[i].isFound== false)
            {
            drawCollectable(collectable[i]);
            checkCollectable(collectable[i]); 
            }    
         }
    for(var i=0; i<platforms.length; i++)
        {
            platforms[i].draw();
        }
    for(var i=0; i<clouds.length; i++)
        {
            clouds[i].display();
        }
        
    
    
    renderflagpole();

    if(gameChar_y > height && lives > 0)
            {
                startGame();
            }
    for(var i=0; i<enemies.length; i++)
        {
            enemies[i].update();
            enemies[i].draw();
            if(enemies[i].isContacted(gameChar_world_x,gameChar_y))
                {
                    mus_3.play();
                    startGame();
                    break;
                }            
        }

    pop();
    noStroke();

    drawGameChar();
    
        push();
        fill(255);
        stroke(0);
        strokeWeight(3);
        textSize(25);
        text("Score:  "  + game_score,5,40);
        pop();

    if(isLeft)
    {
        if(gameChar_x > width * 0.2)
        {
            gameChar_x -= 5;
        }
        else
        {
            scrollPos += 5;
        }
    }
    if(isRight)
    {
        if(gameChar_x < width * 0.8)
        {
            gameChar_x  += 5;
        }
        else
        {
            scrollPos -= 5; 
        }
    }
    if (gameChar_y < floorPos_y)
    {
        isContact=false;
    for(var i=0; i<platforms.length; i++)
        {
            if(platforms[i].checkPlatform(gameChar_world_x,gameChar_y) == true)
            {
                    isContact = true;
                    break;
            }
            }
            if(isContact == false)
                {
                    isFalling=true;
                    gameChar_y +=2;
                }
            else
            {
                isFalling = false;
            }        
        }
    else{
        isFalling = false;
        }
    if(flagpole.isReached != true)
    {
        checkFlagpole();
    }
    if(lives<1)
    {
        push();
        fill(255,0,0);
	    rect(0,220 , width, 200);
        stroke(0);
        strokeWeight(3);;
        fill(255);
        textSize(70);
        text("Game Over", width/2 - 140, 320);
        stroke(0);
        strokeWeight(3);
        fill(255);
        textSize (30);
        text("Press space to continue", width/2 - 120, 360);
        pop();
    }
    if(flagpole.isReached == true)
    {
            push();
            fill(255,0,0);
            rect(width/3-25,240,500,200,80);
            stroke(0);
            strokeWeight(3);;
            fill(255);
            textSize(60);
            text("Level Complete", width/3, height/3+120);
            stroke(0);
            strokeWeight(3);
            fill(255);
            textSize (30);
            text("Press space to continue", width/2 - 120, height/3 +160);
            mus_1.play();
            pop();
             
    }
    
    
gameChar_world_x = gameChar_x - scrollPos;

for(var i=0; i<lives; i++)
    {
        image(heart,5+38*i,50,30,30);
    }      
}
function keyPressed()
{
    console.log(keyCode);
    if(flagpole.isReached && key == ' ')
    {
        nextLevel();
        return
    }
    else if(lives == 0 && key == ' ')
    {
        returnToStart();
        return
    }
	console.log("press" + keyCode);
	console.log("press" + key);
    
    if(keyCode == 37)
    {
        isLeft = true;
        console.log("isLeft:" + isLeft);
    }
    if(keyCode == 39)
    {
        isRight = true;
        console.log("isRight:" + isRight);
    }
    if((gameChar_y == floorPos_y || isContact ==true) && (keyCode == 32) )
    {
          gameChar_y -=100;
    }
    else{
        return;
    }
}
function keyReleased()
{
     if(keyCode == 37)
    {
        isLeft = false;
        console.log("isLeft:" + isLeft);
    }
    if(keyCode == 39)
    {
        isRight = false;
        console.log("isRight:" + isRight);
    }
    console.log("release" + keyCode);
	console.log("release" + key);
}
function drawGameChar()
{
	//  game character
    if(isLeft && isFalling)
	{
		//  jumping-left code
    stroke(0);
    fill(255);
    rect(gameChar_x-7,gameChar_y-75,42,60,20);
    noStroke();
    fill(255, 69, 0);
    rect(gameChar_x,gameChar_y-60,30,40);
    ellipse(gameChar_x-6,gameChar_y-20,5);
    fill(0);
    rect(gameChar_x+2,gameChar_y-55,11,11);
    fill(255);
    stroke(0);
    rect(gameChar_x+2,gameChar_y-55,8,8);
    noStroke();
    fill(148,0,211);
    beginShape();
    vertex(gameChar_x-9, gameChar_y-25);
    vertex(gameChar_x+38, gameChar_y-25);
    vertex(gameChar_x+45, gameChar_y-8);
    vertex(gameChar_x-15, gameChar_y-8);
    endShape(CLOSE);
    fill(255);
    ellipse(gameChar_x-6,gameChar_y-12,4);
    ellipse(gameChar_x+14,gameChar_y-12,4);
    ellipse(gameChar_x+34,gameChar_y-12,4);
    rect(gameChar_x-10,gameChar_y-20,50,2,80);
    stroke(255);
    line(gameChar_x-27,gameChar_y-8,gameChar_x-2,gameChar_y-8);
    line(gameChar_x+14,gameChar_y-8,gameChar_x+19,gameChar_y-2);
    line(gameChar_x+30,gameChar_y-8,gameChar_x+60,gameChar_y-8);
    line(gameChar_x+60,gameChar_y-70,gameChar_x+40,gameChar_y-20);
    noStroke();
    fill(255);
    ellipse(gameChar_x-27,gameChar_y-8,5);
    ellipse(gameChar_x+19,gameChar_y,5);
    ellipse(gameChar_x+60,gameChar_y-8,5);
    fill(255,0,0);
    ellipse(gameChar_x+60,gameChar_y-70,6);
	}
	else if(isRight && isFalling)
	{
//  jumping-right code
    stroke(0);
    fill(255);
    rect(gameChar_x-7,gameChar_y-75,42,60,20);
    noStroke();
    fill(255, 69, 0);
    rect(gameChar_x,gameChar_y-60,30,40);
    ellipse(gameChar_x-6,gameChar_y-20,5);
    fill(0);
    rect(gameChar_x+16,gameChar_y-55,11,11);
    fill(255);
    stroke(0);
    rect(gameChar_x+18,gameChar_y-55,8,8);
    noStroke();
    fill(148,0,211);
    beginShape();
    vertex(gameChar_x-9, gameChar_y-25);
    vertex(gameChar_x+38, gameChar_y-25);
    vertex(gameChar_x+45, gameChar_y-8);
    vertex(gameChar_x-15, gameChar_y-8);
    endShape(CLOSE);
    fill(255);
    ellipse(gameChar_x-6,gameChar_y-12,4);
    ellipse(gameChar_x+14,gameChar_y-12,4);
    ellipse(gameChar_x+34,gameChar_y-12,4);
    rect(gameChar_x-10,gameChar_y-20,50,2,80);
    stroke(255);
    line(gameChar_x-27,gameChar_y-8,gameChar_x-11,gameChar_y-8);
    line(gameChar_x+14,gameChar_y-8,gameChar_x+9,gameChar_y);
    line(gameChar_x+50,gameChar_y-8,gameChar_x+30,gameChar_y-8);
    line(gameChar_x-27,gameChar_y-70,gameChar_x-11,gameChar_y-20);
    noStroke();
    fill(255);
    ellipse(gameChar_x-27,gameChar_y-8,5);
    ellipse(gameChar_x+9,gameChar_y,5);
    ellipse(gameChar_x+50,gameChar_y-8,5);
    fill(255,0,0);
    ellipse(gameChar_x-27,gameChar_y-70,6);
	}
	else if(isLeft)
	{
//  walking left code
    stroke(0);
    fill(255);
    rect(gameChar_x-7,gameChar_y-75,42,60,20);
    noStroke();
    fill(255, 69, 0);
    rect(gameChar_x,gameChar_y-60,30,40);
    ellipse(gameChar_x-6,gameChar_y-20,5);
    fill(0);
    rect(gameChar_x+2,gameChar_y-55,11,11);
    fill(255);
    stroke(0);
    rect(gameChar_x+2,gameChar_y-55,8,8);
    noStroke();
    fill(148,0,211);
    beginShape();
    vertex(gameChar_x-9, gameChar_y-25);
    vertex(gameChar_x+38, gameChar_y-25);
    vertex(gameChar_x+45, gameChar_y-8);
    vertex(gameChar_x-15, gameChar_y-8);
    endShape(CLOSE);
    fill(255);
    ellipse(gameChar_x-6,gameChar_y-12,4);
    ellipse(gameChar_x+14,gameChar_y-12,4);
    ellipse(gameChar_x+34,gameChar_y-12,4);
    rect(gameChar_x-10,gameChar_y-20,50,2,80);
    stroke(255);
    line(gameChar_x-7,gameChar_y-8,gameChar_x-2,gameChar_y+8);
    line(gameChar_x+14,gameChar_y-8,gameChar_x+19,gameChar_y+8);
    line(gameChar_x+35,gameChar_y-8,gameChar_x+40,gameChar_y+8);
    line(gameChar_x+40,gameChar_y-70,gameChar_x+40,gameChar_y-20);
    noStroke();
    fill(255);
    ellipse(gameChar_x-2,gameChar_y+8,5);
    ellipse(gameChar_x+19,gameChar_y+8,5);
    ellipse(gameChar_x+40,gameChar_y+8,5);
    fill(255,0,0);
    ellipse(gameChar_x+40,gameChar_y-70,6);
	}
	else if(isRight)
	{
// walking right code
    stroke(0);
    fill(255);
    rect(gameChar_x-7,gameChar_y-75,42,60,20);
    noStroke();
    fill(255, 69, 0);
    rect(gameChar_x,gameChar_y-60,30,40);
    ellipse(gameChar_x-6,gameChar_y-20,5);
    fill(0);
    rect(gameChar_x+16,gameChar_y-55,11,11);
    fill(255);
    stroke(0);
    rect(gameChar_x+18,gameChar_y-55,8,8);
    noStroke();
    fill(148,0,211);
    beginShape();
    vertex(gameChar_x-9, gameChar_y-25);
    vertex(gameChar_x+38, gameChar_y-25);
    vertex(gameChar_x+45, gameChar_y-8);
    vertex(gameChar_x-15, gameChar_y-8);
    endShape(CLOSE);
    fill(255);
    ellipse(gameChar_x-6,gameChar_y-12,4);
    ellipse(gameChar_x+14,gameChar_y-12,4);
    ellipse(gameChar_x+34,gameChar_y-12,4);
    rect(gameChar_x-10,gameChar_y-20,50,2,80);
    stroke(255);
    line(gameChar_x-7,gameChar_y-8,gameChar_x-11,gameChar_y+8);
    line(gameChar_x+14,gameChar_y-8,gameChar_x+9,gameChar_y+8);
    line(gameChar_x+35,gameChar_y-8,gameChar_x+30,gameChar_y+8);
    line(gameChar_x-11,gameChar_y-70,gameChar_x-11,gameChar_y-20);
    noStroke();
    fill(255);
    ellipse(gameChar_x-11,gameChar_y+8,5);
    ellipse(gameChar_x+9,gameChar_y+8,5);
    ellipse(gameChar_x+30,gameChar_y+8,5);
    fill(255,0,0);
    ellipse(gameChar_x-11,gameChar_y-70,6);
	}
	else if(isFalling || isPlumeting)
	{
// jumping facing forwards code
    stroke(0);
    fill(255);
    rect(gameChar_x-7,gameChar_y-75,42,60,20);
    noStroke();
    fill(255, 69, 0);
    rect(gameChar_x,gameChar_y-60,30,40);
    ellipse(gameChar_x-6,gameChar_y-20,5);
    fill(0);
    rect(gameChar_x+2,gameChar_y-55,11,11);
    rect(gameChar_x+16,gameChar_y-55,11,11);
    fill(255);
    stroke(0);
    rect(gameChar_x+4,gameChar_y-55,3,8);
    rect(gameChar_x+18,gameChar_y-55,3,8);
    noStroke();
    fill(148,0,211);
    beginShape();
    vertex(gameChar_x-9, gameChar_y-25);
    vertex(gameChar_x+38, gameChar_y-25);
    vertex(gameChar_x+45, gameChar_y-8);
    vertex(gameChar_x-15, gameChar_y-8);
    endShape(CLOSE);
    fill(255);
    ellipse(gameChar_x-6,gameChar_y-12,4);
    ellipse(gameChar_x+14,gameChar_y-12,4);
    ellipse(gameChar_x+34,gameChar_y-12,4);
    rect(gameChar_x-10,gameChar_y-20,50,2,80);
    stroke(255);
    line(gameChar_x-7,gameChar_y-8,gameChar_x-20,gameChar_y-30);
    line(gameChar_x+14,gameChar_y-8,gameChar_x+14,gameChar_y-30);
    line(gameChar_x+35,gameChar_y-8,gameChar_x+50,gameChar_y-30);
    noStroke();
    fill(255);
    ellipse(gameChar_x-20,gameChar_y-30,5);
    ellipse(gameChar_x+14,gameChar_y-30,5);
    ellipse(gameChar_x+50,gameChar_y-30,5);
	}
	else
	{
// standing front facing code
    stroke(0);
    fill(255);
    rect(gameChar_x-7,gameChar_y-75,42,60,20);
    noStroke();
    fill(255, 69, 0);
    rect(gameChar_x,gameChar_y-60,30,40);
    ellipse(gameChar_x-6,gameChar_y-20,5);
    fill(0);
    rect(gameChar_x+2,gameChar_y-55,11,11);
    rect(gameChar_x+16,gameChar_y-55,11,11);
    fill(255);
    stroke(0);
    rect(gameChar_x+4,gameChar_y-55,8,8);
    rect(gameChar_x+18,gameChar_y-55,8,8);
    noStroke();
    fill(148,0,211);
    beginShape();
    vertex(gameChar_x-9, gameChar_y-25);
    vertex(gameChar_x+38, gameChar_y-25);
    vertex(gameChar_x+45, gameChar_y-8);
    vertex(gameChar_x-15, gameChar_y-8);
    endShape(CLOSE);
    fill(255);
    ellipse(gameChar_x-6,gameChar_y-12,4);
    ellipse(gameChar_x+14,gameChar_y-12,4);
    ellipse(gameChar_x+34,gameChar_y-12,4);
    rect(gameChar_x-10,gameChar_y-20,50,2,80);
    stroke(255);
    line(gameChar_x-7,gameChar_y-8,gameChar_x-7,gameChar_y+8);
    line(gameChar_x+14,gameChar_y-8,gameChar_x+14,gameChar_y+8);
    line(gameChar_x+35,gameChar_y-8,gameChar_x+35,gameChar_y+8);
    noStroke();
    fill(255);
    ellipse(gameChar_x-7,gameChar_y+8,5);
    ellipse(gameChar_x+14,gameChar_y+8,5);
    ellipse(gameChar_x+35,gameChar_y+8,5);
	}
}
function drawFloor()
{
    for (var i=0; i<90; i++)
        {
            stroke(0);
            fill(47,79,79);
            rect(74 *i-600,floorPos_y-45,70,10);
        }
    for (var i=0; i<90;i++)
        {
            for(var j=0; j<3; j++)
                {
                    stroke(0);
                    fill(128,128,128);
	                rect(40*i-600,floorPos_y+40*j+2, 40,18,15);
                }
        }
    for (var i=0; i<90;i++)
        {
            for(var j=0; j<2; j++)
                {
                    stroke(0);
                    fill(128,128,128);
	                rect(40*i-580,floorPos_y+40*j+22, 40,18,15);
                }
        }
} 
function drawSun()
{
    noStroke();
    fill(255,215, 0);
    ellipse(sun.x,sun.y,150);
    
    if(sun.y <= 350 && sun.y >=80)
        {
            sun.x = sun.x + 1.7;
            sun.y = sun.y - 1;
        }
}
function Building(x,y,sizeW,sizeH)
{
    this.x = x,
    this.y = y,
    this.sizeW = sizeW,
    this.sizeH = sizeH,
    this.display =function()
        {
            fill(220, 220, 220);
            noStroke();
            rect(this.x+10,this.y,this.sizeW,this.sizeH);
            stroke(0);
            rect(this.x,this.y-20,this.sizeW + 20, this.sizeH-280);
            fill(0);
            for(var i=0; i<3; i++)
                {
                    for(var j=0; j<4; j++)
                        {
                            fill(192,192,192);
                            stroke(0);
                            rect(this.x + 50 * i +30,this.y+60 * j +20, this.sizeW-145, this.sizeH-260);
                        }
                }
            fill(60,60,60);
            noStroke();   
            rect(this.x + 191,this.y + 120, this.sizeW - 120, this.sizeH -120);
            fill(0, 0, 80);
            noStroke();   
            rect(this.x + 251,this.y + 79, this.sizeW - 140, this.sizeH -80);
            fill(255,0,0);
            noStroke();
            rect(this.x+292,this.y+120,this.sizeW,this.sizeH-120);
            stroke(0);
            fill(80,80,80)
            rect(this.x+292,this.y+115,this.sizeW, this.sizeH-290);
            for(var i=0; i<3; i++)
                {
                    noStroke();
                    fill(80,80,80);
                    rect(this.x+70*i+292,this.y+100, this.sizeW-140,this.sizeH - 280);
                }
            fill(0);
            for(var i=0; i<2; i++)
                {
                    for(var j=0; j<2; j++)
                        {
                            fill(192,192,192);
                            stroke(0);
                            rect(this.x + 70 * i +325,this.y+70 * j +160, this.sizeW-125, this.sizeH-260);
                        }
                } 
        }
}
function Cloud (x,y)
{
    this.x = x;
    this.y = y;
    this.display = function()
    {
        noStroke();    
        fill(255,255,255,170);
        rect(this.x + 100,this.y + 20,40,3);
        rect(this.x + 70,this.y + 23,100,3);
        rect(this.x + 50,this.y + 26,160,3);
        rect(this.x + 30,this.y + 29,190,3);
        rect(this.x + 10,this.y + 32,220,3);
        rect(this.x + 20,this.y + 35,290,3);
        rect(this.x + 40,this.y + 38,260,3);
        rect(this.x + 20,this.y + 41,290,3);
        rect(this.x,this.y + 44,260,3);
        rect(this.x - 10,this.y + 47,290,3);
        rect(this.x - 30,this.y + 50,320,3);
        rect(this.x - 20,this.y + 53,290,3);
        rect(this.x ,this.y + 56,250,3);
        rect(this.x + 20,this.y + 59,170,3);
    }
}
function drawTrees(x,y,sizeW,sizeH)
{   
        this.x = x,
        this.y = y,
        this.sizeW = sizeW,
        this.sizeH = sizeH
        this.display = function()
       {
            image(trees,this.x+20,this.y-179,sizeW,sizeH);
            image(trees,this.x,this.y-139,sizeW-40,sizeH-40);
        }
}
function Mountain(x,y)
{
    this.x=x,
    this.y=y,
    this.display = function()
    {
        fill(102,51,0)
            triangle(this.x + 100, this.y, this.x + 240,this.y - 200,this.x + 400,this.y);
            fill(139,69,19);
            triangle(this.x - 100,this.y, this.x + 100,this.y - 280,this.x + 300,this.y);
            fill(255);
            beginShape();
                vertex(this.x + 100, this.y - 280);
                vertex(this.x + 155, this.y - 200);
                vertex(this.x + 120, this.y -220);
                vertex(this.x + 95, this.y - 200);
                vertex(this.x + 80, this.y -240);
                vertex(this.x + 40, this.y -200);
                endShape(CLOSE);

            beginShape();
                vertex(this.x + 240, this.y -200);
                vertex(this.x + 280, this.y -150);
                vertex(this.x + 250, this.y - 170)
                vertex(this.x + 240, this.y -160);
                vertex(this.x + 220, this.y -170);
                vertex(this.x + 205, this.y -150);
                endShape(CLOSE);
    }
}
function drawCanyon(t_canyon)
{
    noStroke(0);
        fill(0);
        rect(t_canyon.x_pos, floorPos_y, t_canyon.width, 152);
        fill(255,0,0);
        beginShape()
            vertex(t_canyon.x_pos, floorPos_y + 103);
            vertex(t_canyon.x_pos + t_canyon.width - 80, floorPos_y + 58);
            vertex(t_canyon.x_pos + t_canyon.width - 70, floorPos_y + 103);
            vertex(t_canyon.x_pos + t_canyon.width - 60, floorPos_y + 58);
            vertex(t_canyon.x_pos + t_canyon.width - 50, floorPos_y + 103);
            vertex(t_canyon.x_pos + t_canyon.width - 40, floorPos_y + 58);
            vertex(t_canyon.x_pos + t_canyon.width - 30, floorPos_y + 103);
            vertex(t_canyon.x_pos + t_canyon.width - 20, floorPos_y + 58);
           vertex(t_canyon.x_pos + t_canyon.width, floorPos_y + 103);
        endShape(CLOSE);  
}
function checkCanyon(t_canyon)
{
     if(gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos + t_canyon.width && gameChar_y == floorPos_y)
        {
            isPlumeting = true;
        }
}
function drawCollectable(t_collectable)
{
    stroke(255,255,0); 
    strokeWeight(4);
    fill(0,0,255);
    ellipseMode(CENTER);
    ellipse(t_collectable.x_pos * t_collectable.size, t_collectable.y_pos + 15, 50 * t_collectable.size);
    fill(255,0,0);
    ellipse(t_collectable.x_pos * t_collectable.size, t_collectable.y_pos , 20 * t_collectable.size);
}
function checkCollectable(t_collectable)
{
     if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 70)
        {
            t_collectable.isFound = true;
            game_score +=t_collectable.size;
            mus_2.play();
            
            
            console.log(game_score);
        }
}
function renderflagpole()
{
        push();
     if(flagpole.isReached == false)
        {
            fill(128,128,128);
            stroke(0);
            ellipse(flagpole.x_pos +123,130,100,110);
            noStroke();
            fill(60,60,60);
            rect(flagpole.x_pos+40,150,170,40,50);
            stroke(0);
            line(flagpole.x_pos + 60,190,flagpole.x_pos + 60,220);
            line(flagpole.x_pos + 125,190,flagpole.x_pos + 125,220);
            line(flagpole.x_pos + 190,190,flagpole.x_pos + 190,220);
            noStroke();
            fill(random(0,255),0,random(0,255));
            ellipse(flagpole.x_pos + 60,165,10);
            ellipse(flagpole.x_pos + 100,165,10);
            ellipse(flagpole.x_pos + 140,165,10);
            ellipse(flagpole.x_pos + 180,165,10);
            fill(155,255,0,100);
            beginShape();
                vertex(flagpole.x_pos + 110, 200);
                vertex(flagpole.x_pos + 130, 200);
                vertex(flagpole.x_pos + 240, floorPos_y)
                vertex(flagpole.x_pos + 20, floorPos_y);
                endShape(CLOSE);
        }
    if(flagpole.isReached)
        {
            fill(128,128,128);
            stroke(0);
            ellipse(flagpole.x_pos +123,130,100,110);
            noStroke();
            fill(60,60,60);
            rect(flagpole.x_pos+40,150,170,40,50);
            stroke(0);
            line(flagpole.x_pos + 60,190,flagpole.x_pos + 60,220);
            line(flagpole.x_pos + 125,190,flagpole.x_pos + 125,220);
            line(flagpole.x_pos + 190,190,flagpole.x_pos + 190,220);
            noStroke();
            fill(random(0,255),0,random(0,255));
            ellipse(flagpole.x_pos + 60,165,10);
            ellipse(flagpole.x_pos + 100,165,10);
            ellipse(flagpole.x_pos + 140,165,10);
            ellipse(flagpole.x_pos + 180,165,10);
            fill(155,255,0,80);
            beginShape();
                vertex(flagpole.x_pos + 110, 200);
                vertex(flagpole.x_pos + 130, 200);
                vertex(flagpole.x_pos + 250, floorPos_y)
                vertex(flagpole.x_pos + 10, floorPos_y);
                endShape(CLOSE);
            if(gameChar_y > 200)
            {
              gameChar_y -=4; 
              gameChar_world_x +=1;
              isLeft = false;
              isRight = false;
            }           
    }
        pop();
    
}
function checkFlagpole()
{
     if(gameChar_world_x > flagpole.x_pos && gameChar_world_x < flagpole.x_pos + 120)
        {
            flagpole.isReached = true;
        }
}
function Platform(x,y,length)
{
    var p={
        x:x,
        y:y,
        length:length,
        draw: function()
        {
        fill(255,255,0);
        noStroke();
        rect(this.x,this.y,this.length,10);
        },
    checkPlatform: function(gc_x,gc_y)
    {
        if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if(d>=0 && d<5)
                    {
                        return true;
                    }
            }
            return false;
        }
    }
    return p
}
function Enemy(x,y,range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.current_x = x;
    this.incr = 1;
    this.draw = function()
    {
        fill(255, 165, 0);
        rect(this.current_x,this.y-25,50,20);
        ellipse(this.current_x+25,this.y-35,50);
        fill(0);
        ellipse(this.current_x+15,this.y-40,15);
        ellipse(this.current_x+35,this.y-40,15);
        rect(this.current_x,this.y-15,10,10);
        rect(this.current_x+20,this.y-15,10,10);
        rect(this.current_x+40,this.y-15,10,10);
        fill(255,165,0);
        triangle(this.current_x + 10, this.y -50,
                 this.current_x + 40, this.y -50,
                 this.current_x + 25, this.y -30);
    }
    this.update = function()
    {
        this.current_x += this.incr;
        if(this.current_x < this.x)
                {
                    this.incr = 2;
                }
            else if(this.current_x > this.x + this.range)
                {
                    this.incr = - 2;
                }
    }
    this.isContacted = function(gc_x,gc_y)
    {
        var d= dist(gc_x,gc_y,this.current_x,this.y)
        if(d<25)
            {
                return true;
            }
        return false;
    }
}


