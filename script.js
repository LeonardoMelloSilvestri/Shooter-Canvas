var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function menu(){
	ctx.fillStyle = "White";
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	ctx.font = "40px Cursive";
	ctx.fillText("Comandos", 500, 150);
	ctx.font = "30px Cursive";
	ctx.fillText("Mover a nave para cima: ↑", 500, 200);
	ctx.fillText("Mover a nave para baixo: ↓", 500, 240);
	ctx.fillText("Atirar mísseis: Z", 500, 280);
	ctx.font = "40px Cursive";
	ctx.fillText("Objetivo do jogo", 500, 400);
	ctx.font = "30px Cursive";
	ctx.fillText("Impessa que os inimigos(blocos azuis)", 500, 450);
	ctx.fillText("alcancem a margem esquerda da tela", 500, 490);
	ctx.fillText("Se sua vida chegar a 0 você perde", 500, 550);
}

menu();

function startGame(){
	document.getElementById('Play').remove();

	var moveDown = moveUp = shoot = zIsDown = false;
	var enemies = [];
	var bullets = [];

	var player = {
		height: 80,
		width: 40,
		x: 20,
		y: canvas.height / 2 - 25,
		speed: 10,
		color: "White",
		score: 0,
		hp: 10
	}

	function drawPlayer(x, y, height, width, color) {
		ctx.fillStyle = color;
		ctx.fillRect(x, y, width, height);	
	}

	function Enemy(){
		this.height = 40;
		this.width = 40;
		this.x = 960;
		this.y = Math.floor((Math.random() * 550) + 0);
		this.color = "Blue";
		this.speed = 3;
		this.hp = 1;
		this.plusScore = 10;
		this.damage = 1;

		this.draw = function(){
			ctx.fillStyle = this.color;
			this.x -= this.speed;
			ctx.fillRect(this.x, this.y, this.height, this.width);
		}
	}

	function FastEnemy(){
		this.height = 40;
		this.width = 40;
		this.x = 960;
		this.y = Math.floor((Math.random() * 550) + 0);
		this.color = "Yellow";
		this.speed = 5;
		this.hp = 1;
		this.plusScore = 20;
		this.damage = 3;

		this.draw = function(){
			ctx.fillStyle = this.color;
			this.x -= this.speed;
			ctx.fillRect(this.x, this.y, this.height, this.width);
		}
	}

	function TankEnemy(){
		this.height = 50;
		this.width = 50;
		this.x = 960;
		this.y = Math.floor((Math.random() * 540) + 0);
		this.color = "Green";
		this.speed = 2;
		this.hp = 3;
		this.plusScore = 50;
		this.damage = 5;

		this.draw = function(){
			ctx.fillStyle = this.color;
			this.x -= this.speed;
			ctx.fillRect(this.x, this.y, this.height, this.width);
			ctx.fillStyle = "White";
			ctx.fillText(this.hp, this.x + 25, this.y + 25);
		}
	}

	function DiagEnemy(){
		this.height = 40;
		this.width = 40;
		this.x = 960;
		this.y = Math.floor((Math.random() * 550) + 0);
		this.color = "Purple";
		this.speed = 3;
		this.hp = 1;
		this.plusScore = 30;
		this.damage = 2;
		this.directionY = true;

		this.draw = function(){
			ctx.fillStyle = this.color;
			this.x -= this.speed;
			this.y -= this.speed;
			if (this.y <= 0) {
				this.y += 600;
			}
			ctx.fillRect(this.x, this.y, this.height, this.width);
		}
	}

	function CreepyEnemy(){
		this.height = 15;
		this.width = 15;
		this.x = 960;
		this.y = Math.floor((Math.random() * 575) + 0);
		this.color = "Pink";
		this.speed = 2;
		this.hp = 1;
		this.plusScore = 30;
		this.damage = 3;

		this.draw = function(){
			ctx.fillStyle = this.color;
			this.x -= this.speed;
			this.y += this.speed;
			if (this.y + this.height > canvas.height) {
				this.y -= this.speed;
			}
			ctx.fillRect(this.x, this.y, this.height, this.width);
		}
	}

	function Heal(){
		this.height = 50;
		this.width = 50;
		this.x = 960;
		this.y = Math.floor((Math.random() * 540) + 0);
		this.color = "RED";
		this.speed = 2;
		this.hp = 5;
		this.plusScore = 100;
		this.damage = 0;
		this.cure = true;

		this.draw = function(){
			ctx.fillStyle = this.color;
			this.x -= this.speed;
			ctx.fillRect(this.x, this.y, this.height, this.width);
			ctx.fillStyle = "White";
			ctx.fillText(this.hp, this.x + 25, this.y + 25);
		}
	}

	function drawEnemy(){
		for (var i = 0; i < enemies.length; i++) {
			var currentEnemy = enemies[i];
			currentEnemy.draw();
		}
	}

	function loopSpawnEnemy(){
		setInterval(function(){
			var random = Math.floor((Math.random() * 22) + 1);
			if (random >= 1 && random <= 13) {
				enemies.push(new Enemy());
			} else if (random >= 14 && random <= 16) {
				enemies.push(new FastEnemy());
			} else if (random == 17) {
				enemies.push(new TankEnemy());
			} else if (random >= 18 && random <= 19) {
				enemies.push(new DiagEnemy());
			} else if (random >= 20 && random <= 21) {
				enemies.push(new CreepyEnemy());
			} else if (random == 22) {
				enemies.push(new Heal());
			}
		}, 350)
	}

	function Bullet(){
		this.width = 20;
		this.height = 20
		this.x = player.x + 20;
		this.y = player.y + 35;
		this.speed = 25;
		this.color = "Red";

		this.draw = function(){
			ctx.fillStyle = this.color;
			this.x += this.speed;
			ctx.fillRect(this.x, this.y, this.height, this.width);
		}
	}

	function drawBullet(){
		for (var i = 0; i < bullets.length; i++) {
			var currentBullet = bullets[i];
			currentBullet.draw();
		}
	}

	function shootBullet(){
		if (true == shoot) {
			bullets.push(new Bullet());
			shoot = false;
		}
	}

	window.addEventListener('keydown', function keyDownHandler(e){
		var key = e.keyCode;
		switch (key) {
			case 38:
				moveUp = true;
				break;
			case 40:
				moveDown = true;
				break;
			case 90:
			if (!zIsDown) {
					zIsDown = true;
					shoot = true;
				}
					break;
		}
	}, false);

	window.addEventListener('keyup', function keyUpHandler(e){
		var key = e.keyCode;
		switch (key) {
			case 38:
				moveUp = false;
				break;
			case 40:
				moveDown = false;
				break;
			case 90:
				zIsDown = false;
		}
	}, false);

	function movePlayer(){
		if (moveUp == true && player.y > 0) {
			player.y -= player.speed;
		} 

		if (moveDown == true && player.y + player.height < canvas.height) {
			player.y += player.speed;
		}
	}

	function colide(){
		for (var i = 0; i < enemies.length; i++) {
			var currentEnemy = enemies[i];

			if (currentEnemy.x <= 0) {
				player.hp -= currentEnemy.damage;
				enemies.splice(enemies.indexOf(currentEnemy), 1);
				}

			for (var j = 0; j < bullets.length; j++) {
				var currentBullet = bullets[j];

				if (currentBullet.x + currentBullet.width >= canvas.width) {
					bullets.splice(bullets.indexOf(currentBullet), 1);
				}

				if (currentBullet.x + currentBullet.width >= currentEnemy.x &&
					currentBullet.x <= currentEnemy.x + currentEnemy.width &&
					currentBullet.y + currentBullet.height >= currentEnemy.y &&
					currentBullet.y <= currentEnemy.y + currentEnemy.height) {
					if (currentEnemy.hp == 1) {
						enemies.splice(enemies.indexOf(currentEnemy), 1);
						bullets.splice(bullets.indexOf(currentBullet), 1);
						player.score += currentEnemy.plusScore;
						if (currentEnemy.cure == true) {
							if (currentEnemy.hp == 1) {
								player.hp++;
							}
						}
					} else {
						currentEnemy.hp--;
						bullets.splice(bullets.indexOf(currentBullet), 1);
					}
				}
			}
		

			if (currentEnemy.x <= player.x + player.width &&
				currentEnemy.y <= player.y + player.height &&
				currentEnemy.y + currentEnemy.height >= player.y &&
				currentEnemy.x + currentEnemy.width >= player.x) {
				enemies.splice(enemies.indexOf(currentEnemy), 1);
			}

			if (player.x + player.width >= currentEnemy.x &&
				player.y + player.height >= currentEnemy.y &&
				player.y <= currentEnemy.y + currentEnemy.height &&
				player.x <= currentEnemy.x + currentEnemy.width) {
				enemies.splice(enemies.indexOf(currentEnemy), 1);
			}
		}
	}

	function gameOver(){
		if (player.hp <= 0) {
			player.x = 20;
			player.y = canvas.height / 2 - 25;
			player.hp = 10;

			enemies = [];

			alert("Você perdeu, seu lixo! Pontuação " + player.score);
			alert("Clique em OK para jogar novamente");

			player.score = 0;
		}
	}

	function drawGame(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = '30px Cursive';
		ctx.fillStyle = "White";
		ctx.fillText("Vida: " + player.hp, 120, 30);
		ctx.fillText("Pontos: " + player.score, 120, 570);
		drawPlayer(player.x, player.y, player.height, player.width, player.color);
		drawEnemy();
		drawBullet();
	}

	function loop(){
		window.requestAnimationFrame(loop, canvas);
		movePlayer();
		shootBullet();
		colide();
		gameOver();
		drawGame();
	}

	loopSpawnEnemy();
	loop();
}