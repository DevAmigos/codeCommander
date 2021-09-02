// Arcade Shooter game

// Get a reference to the canvas DOM element
var canvas = document.getElementById('canvas');
// Get the canvas drawing context
var context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const kirbyimg = new Image();
kirbyimg.src = '../images/kirbyspritesheet.png';

const dragonimg = new Image();
dragonimg.src = '../images/dragon_sprite.png';

const bulletimg = new Image();
bulletimg.src = '/images/bullet.gif';

const forestimg = new Image();
forestimg.src = '/images/background-forest.gif';

let x = 20;
let y = 30;
let sx = 0;
let sy = 0;
let swidth = kirbyimg.width / 4;
let sheight = kirbyimg.height;
let frames = 0;
let speed = 10;

// Background//
function makeForest(x, y, width, height) {
	return {
		x: x,
		y: y,
		w: width,
		h: height,
		draw: function() {
			// context.fillRect(this.x, this.y, this.l, this.l);
			context.drawImage(forestimg, this.x, this.y, this.w, this.h);
		}
	};
}
// Create an object representing a Kirby on the canvas
function makeKirby(x, y, length, speed) {
	return {
		x: x,
		y: y,
		l: length,
		s: speed,
		draw: function() {
			//ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
			context.drawImage(kirbyimg, sx, sy, swidth, sheight, this.x, this.y, this.l, this.l);
		}
	};
}

let dwidth = dragonimg.width / 4.1;
let dheight = dragonimg.height;
// Create an object representing a Dragon on the canvas
function makeDragon(x, y, length, speed) {
	return {
		x: x,
		y: y,
		l: length,
		s: speed,
		draw: function() {
			// context.fillRect(this.x, this.y, this.l, this.l);
			context.drawImage(dragonimg, sx, sy, dwidth, dheight, this.x, this.y, this.l, this.l);
		}
	};
}
// Create an object representing a Bullet on the canvas
function makeBullet(x, y, length, speed) {
	return {
		x: x,
		y: y,
		l: length,
		s: speed,
		draw: function() {
			// context.fillRect(this.x, this.y, this.l, this.l);
			context.drawImage(bulletimg, this.x, this.y, this.l, this.l);
		}
	};
}

// The ship the user controls
var ship = makeKirby(50, canvas.height / 2 - 25, 100, 8);

// Flags to tracked which keys are pressed
var up = false;
var down = false;
var space = false;
//Background
let background = makeForest(0, 0, canvas.width, canvas.height);
// Is a bullet already on the canvas?
var shooting = false;
// The bulled shot from the ship
var bullet = makeBullet(0, 0, 50, 10);

// An array for enemies (in case there are more than one)
var enemies = [];

// Add an enemy object to the array
var enemyBaseSpeed = 2;
function makeEnemy() {
	var enemyX = canvas.width;
	var enemySize = Math.round(Math.random() * 200) + 150;
	var enemyY = Math.round(Math.random() * (canvas.height - enemySize * 2)) + enemySize;
	var enemySpeed = Math.round(Math.random() * enemyBaseSpeed) + enemyBaseSpeed;
	enemies.push(makeDragon(enemyX, enemyY, enemySize, enemySpeed));
}

// Check if number a is in the range b to c (exclusive)
function isWithin(a, b, c) {
	return a > b && a < c;
}

// Return true if two squares a and b are colliding, false otherwise
// function isColliding(a, b) {
// 	var result = false;
// 	if (isWithin(a.x, b.x, b.x + b.l) || isWithin(a.x + a.l, b.x, b.x + b.l)) {
// 		if (isWithin(a.y, b.y, b.y + b.l) || isWithin(a.y + a.l, b.y, b.y + b.l)) {
// 			result = true;
// 		}
// 	}
// 	return result;
// }

function isColliding(rect1, rect2) {
	if (
		rect1.x < rect2.x + rect2.l &&
		rect1.x + rect1.l > rect2.x &&
		rect1.y < rect2.y + rect2.l &&
		rect1.y + rect1.l > rect2.y
	) {
		// collision detected!
		return true;
	}
	return false;
}

// Track the user's score
var score = 0;
// The delay between enemies (in milliseconds)
var timeBetweenEnemies = 3 * 1000;
// ID to track the spawn timeout
var timeoutId = null;

// Show the game menu and instructions
function menu() {
	erase();
	background.draw();
	context.fillStyle = '#FFFFFF';
	context.font = '36px Menlo';
	context.textAlign = 'center';
	context.fillText('Kirby: The Dragon Slayer', canvas.width / 2, canvas.height / 4);
	context.font = '24px Menlo';
	context.fillText('Click to Start', canvas.width / 2, canvas.height / 2);
	context.font = '18px Menlo';
	context.fillText('Up/Down to move, Space to shoot.', canvas.width / 2, canvas.height / 4 * 3);
	// Start the game on a click
	canvas.addEventListener('click', startGame);
}

// Start the game
function startGame() {
	// Kick off the enemy spawn interval
	timeoutId = setInterval(makeEnemy, timeBetweenEnemies);
	// Make the first enemy
	setTimeout(makeEnemy, 500);
	// Kick off the draw loop
	draw();
	// Stop listening for click events
	canvas.removeEventListener('click', startGame);
}

// Show the end game screen
function endGame() {
	// Stop the spawn interval
	clearInterval(timeoutId);
	// Show the final score

	context.fillStyle = '#FFFFFF';
	context.font = '24px Menlo';
	context.textAlign = 'center';
	context.fillText('Game Over. Final Score: ' + score, canvas.width / 2, canvas.height / 2);
}

// Listen for keydown events
canvas.addEventListener('keydown', function(event) {
	event.preventDefault();
	if (event.keyCode === 38) {
		// UP
		up = true;
	}
	if (event.keyCode === 40) {
		// DOWN
		down = true;
	}
	if (event.keyCode === 32) {
		// SPACE
		shoot();
	}
});

// Listen for keyup events
canvas.addEventListener('keyup', function(event) {
	event.preventDefault();
	if (event.keyCode === 38) {
		// UP
		up = false;
	}
	if (event.keyCode === 40) {
		// DOWN
		down = false;
	}
});

// Clear the canvas
function erase() {
	context.fillStyle = '#FFFFFF';
	context.fillRect(0, 0, 600, 400);
}

// Shoot the bullet (if not already on screen)
function shoot() {
	if (!shooting) {
		shooting = true;
		bullet.x = ship.x + ship.l;
		bullet.y = ship.y + ship.l / 2;
	}
}

// The main draw loop
function draw() {
	erase();
	//Background
	background.draw();

	frames++;

	if (frames % speed === 0) {
		//This is the speed of change of kirby pic
		sx += kirbyimg.width / 4;
		if (sx > kirbyimg.width - kirbyimg.width / 4) {
			sx = 0;
		}
		//ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
	}

	var gameOver = false;
	// Move and draw the enemies
	enemies.forEach(function(enemy) {
		enemy.x -= enemy.s;
		if (enemy.x < 0) {
			gameOver = true;
		}
		context.fillStyle = '#00FF00';
		enemy.draw();
	});
	// Collide the ship with enemies

	enemies.forEach(function(enemy, i) {
		if (isColliding(enemy, ship)) {
			gameOver = true;
		}
	});
	// Move the ship
	if (down) {
		ship.y += ship.s;
	}
	if (up) {
		ship.y -= ship.s;
	}
	// Don't go out of bounds
	if (ship.y < 0) {
		ship.y = 0;
	}
	if (ship.y > canvas.height - ship.l) {
		ship.y = canvas.height - ship.l;
	}
	// Draw the ship
	context.fillStyle = '#FF0000';
	ship.draw();
	// Move and draw the bullet
	if (shooting) {
		// Move the bullet
		bullet.x += bullet.s;
		// Collide the bullet with enemies
		enemies.forEach(function(enemy, i) {
			if (isColliding(bullet, enemy)) {
				enemies.splice(i, 1);
				score++;
				shooting = false;
				// Make the game harder
				if (score % 10 === 0 && timeBetweenEnemies > 1000) {
					clearInterval(timeoutId);
					timeBetweenEnemies -= 1000;
					timeoutId = setInterval(makeEnemy, timeBetweenEnemies);
				} else if (score % 5 === 0) {
					enemyBaseSpeed += 1;
				}
			}
		});
		// Collide with the wall
		if (bullet.x > canvas.width) {
			shooting = false;
		}
		// Draw the bullet
		context.fillStyle = '#0000FF';
		bullet.draw();
	}
	// Draw the score
	context.fillStyle = '#FFFFFF';
	context.font = '24px Menlo';
	context.textAlign = 'left';
	context.fillText('Score: ' + score, 50, 55);

	// End or continue the game
	if (gameOver) {
		endGame();
		//alert('Game over')
		//location.reload()
	} else {
		window.requestAnimationFrame(draw);
	}
}

// Start the game
//menu();
forestimg.onload = menu;
canvas.focus();
