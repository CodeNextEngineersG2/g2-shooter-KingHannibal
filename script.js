// UI Variables
var canvas;
var canvasWidth;
var canvasHeight;
var gameScreen;
var scoreDisplay;

// Game Variables
var gameRunning;
var shipShooting;
var alienShooting;
var score;

// Ship Variables
var shipDiameter;
var shipX;
var shipY;
var shipSpeed;
var shipColor;

// Bullet Variables
var bulletDiameter;
var bulletX;
var bulletY;
var bulletSpeed;
var BulletColor
// Alien Variables
var alienDiameter;
var alienX;
var alienY;
var alienVelocity;
var alienColor;

// Alien Bullet Variables
var alienBulletDiameter;
var alienBulletX;
var alienBulletY;
var alienBulletColor;

var img;
var healthBar;
var healthBarWidth;
var healthRate;

function preLoad(){
	img=loadImage("king.jpg");
}


/*
 * setup()
 * This function is called once. Sets up the canvas, accesses HTML elements with
 * select(), and adds event listeners to those elements. Sets initial values of
 * variables by calling resetGame().
 */
  function setup(){
  	canvasWidth=500;
  	canvasHeight=400;
	canvas=createCanvas(canvasWidth,canvasHeight);
		
	background(100);
	gameScreen = select('#game-screen');
	canvas.parent("game-screen");
	scoreDisplay = select ("#score-display");
	resetGame();
	healthRate=10;
	
 }


function healthBar (){
	fill(201,122,47);
	rect(alienX,5,healthBarWidth,5);
}





 
 
	
/*
 * gameOver()
 * This function stops the game from running and shows an alert telling the
 * player what their final score is. Finally it resets the game by calling
 * resetGame()
 */
function gameOver(){
	gameRunning=false;
	alert("gameOver");
	resetGame();

	}



/*
 * resetGame()
 * This function "resets the game" by initializing ship, alien, and game
 * variables.
 */
function resetGame(){
	shipX=250;
	shipY=350;
	shipSpeed=10;
	shipDiameter=80;
	bulletX=shipX;
	bulletY=shipY;
	bulletSpeed=10;
	bulletDiameter=20;
	shipShooting= false;
	alienX=25;
	alienY=25;
	alienDiameter=50;
	alienVelocity=10;
	alienBulletDiameter=20;
	alienShooting= false;
	alienBulletX= alienX;
	alienBulletY=alienY;
	shipColor= color(129,23,194);
	alienColor=color(60,130,33);
	BulletColor=color(231,31,245);
	alienBulletColor=color(31,245,245);
	score=0; 
	scoreDisplay.html(score);
	gameRunning= true;
	healthBarWidth=50;
	
}

/*
 * draw()
 * This function animates the ship, alien, and both kinds of bullets, but only
 * if the game is running.
 */
function draw(){
	if(gameRunning==true){
	background(10);
	drawShip();
	
		if(shipShooting==true){
		drawBullet();
		}
		drawAlien(); 

			if(alienShooting==true){
				drawAlienBullet();
			}

	}

	if (healthBarWidth<=0){
		alert("good job! you have completed your first level");
		resetAlien();
	}
}

/*
 * drawShip()
 * This function draws the player's ship. It also controls the ship's
 * x value by checking if the player is holding down the left or right keys.
 */
function drawShip(){
	fill(shipColor);
	ellipse(shipX,shipY,shipDiameter,shipDiameter);

	if(keyIsDown(LEFT_ARROW)&&shipX>40){
		shipX-=shipSpeed;
	}
	else if (keyIsDown(RIGHT_ARROW)&&shipX<460){
	  	shipX+=shipSpeed;
	}

}

/*
 * keyPressed()
 * This function runs automatically when the player presses the spacebar
 * (keyCode === 32). If they do, and a bullet is not currently being fired
 * ("shipShooting" variable is false), it positions the bullet relative to the
 * ship. Then it sets the "shipShooting" variable to "true", indicating a ship
 * bullet is currently being fired.
 */
function keyPressed(){
	if(keyCode===32 && shipShooting==false&&gameRunning){
		bulletX=shipX;
		bulletY=shipY;
   		//bulletY-=bulletSpeed;
   		shipShooting=true;
   		
	}
	

}

/*
 * drawBullet()
 * This function draws a bullet. It also checks to see if the bullet has hit
 * the alien. If it has, the alien is reset to the top-left of the screen
 * and the player earns a point. The alien aslo becomes faster (i.e., harder
 * to hit) each time it is hit by a bullet.
 */
function drawBullet(){
	fill(BulletColor);
	var hitAlien= checkCollision(alienX,alienY,alienDiameter,bulletX,bulletY,bulletDiameter);
	 if(bulletY>0&&!hitAlien){
	 	ellipse(bulletX,bulletY,bulletDiameter,bulletDiameter);
		bulletY-=bulletSpeed;
	 }
	 else if(hitAlien){
	 	
	 	//alienVelocity++;
	 	shipShooting=false;
	 	score++;
	 	scoreDisplay.html(score);
	 	healthBarWidth-=healthRate;

	 }

	 else{
	 	shipShooting = false;
	 }
  	
}

/*
 * drawAlien()
 * This function draws an alien. It also checks to see if the alien has touched
 * the player's ship. If it has, the function calls gameOver().
 */
function drawAlien(){
	 fill(alienColor);
 	ellipse(alienX,alienY,alienDiameter,alienDiameter)
 	alienX+=alienVelocity;
 	if(alienX>=width-alienDiameter/2||alienX<=25){
 		alienVelocity*=-1;
 	}
 	if(random(4)<1 && !alienShooting){
		alienBulletX=alienX
		alienBulletY=alienY;
		alienShooting=true;
	} 
	healthBar();
	
 }

/*
 * drawAlienBullet()
 * This function behaves much like drawBullet(), only it fires from the alien
 * and not the player's ship. If the bullet hits the player, it's game over.
 */
function drawAlienBullet (){
	var hitShip = checkCollision(alienBulletX,alienBulletY,alienBulletDiameter,shipX,shipY,shipDiameter);
		
	fill(alienBulletColor);
	if(alienBulletY<canvasHeight && hitShip == false ){
		ellipse(alienBulletX,alienBulletY,alienBulletDiameter,alienBulletDiameter);
		alienBulletY+=10;
	}
	else if(hitShip== true){
		gameOver();
	}
	else{
		alienShooting=false;
	}

	

 }

/*
 * resetAlien()
 * This function sets the alien to its original position at the top-left of
 * the screen. It also sets its velocity to its absolute value (so, if the
 * velocity was negative when it died, it becomes positive upon reset, making
 * it always start by moving to the right).
 */
function resetAlien(){
	alienX=alienDiameter/2;
	alienY=alienDiameter/2;
  alienVelocity=abs(alienVelocity);
}

/*
 * checkCollision(aX, aY, aD, bX, bY, bD)
 * This function first calculates the distance between two circles based on
 * their X and Y values. Based on the distance value, the function returns
 * "true" if the circles are touching, and false otherwise.
 * Circles are considered touching if
 * (distance <= (circle1Diameter + circle2Diameter) / 2)
 */
function checkCollision(aX, aY,aD,bX,bY,bD){
 var distance= dist(aX,aY,bX,bY);

	 if( distance<= aD/2 + bD/2){
	 	return true;
	}
	else{
		return false;
	}


}






