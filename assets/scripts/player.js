class Player {
	let player = this;

	player.element = null;
	player.tags = {};
	player.npc = false;
	player.animatinf = false;

	constructor(infos = {}, npc = false) {
		this.npc = npc;

		this.tags = infos.tags;
		this.color = this.originalColor = this.tags.color;
		
		// Random color if no color for player
		if(!this.color && !this.npc)
			this.color = this.originalColor = '#' + Math.round(0xffffff * Math.random()).toString(16).padStart(6, 0);

		this.element = document.createElement('player');

		let nameTag = document.createElement('name');
		nameTag.innerText = this.tags['display-name'];
		this.element.appendChild(nameTag);

		this.element.appendChild(document.createElement('shadow'));
		this.element.appendChild(document.createElement('sheep'));

		this.element.addEventListener('click', _ => {
			if(selectedPlayer) {
				selectedPlayer.color = selectedPlayer.originalColor;
				update(selectedPlayer);
			}

			if(selectedPlayer != this) {
				selectedPlayer = this;
				selectedPlayer.color = 'pink';
				this.update();
			} else {
				selectedPlayer = null;
			}
		});

		Events(playthiser);
	}

	player.show = function() {
		Maze.element.appendChild(player.element);

		if(player.npc) {
			player.animating = false;
			player.x = Maze.centerPosition.x;
			player.y = Maze.centerPosition.y;
			player.update();

			return;
		}

		player.animating = true;
		let playerPosition = Maze.randomPosition();
		let fromPosition = {...playerPosition};
		let direction;

		if(Utils.random()) {
			player.element.style.setProperty('--distance-x', '1s');
			player.element.style.setProperty('--distance-y', '0s');

			if(Utils.random()) {
				direction = 'from-left';
				playerPosition.x = 0
				fromPosition.x = -2;
				player.element.classList.add('face-right');
			} else {
				direction = 'from-right';
				playerPosition.x = options.size - 1;
				fromPosition.x = options.size + 1;
			}
		} else {
			player.element.style.setProperty('--distance-x', '0s');
			player.element.style.setProperty('--distance-y', '1s');

			if(Utils.random()) {
				direction = 'from-top';
				playerPosition.y = 0
				fromPosition.y = -2;
			} else {
				direction = 'from-bottom';
				playerPosition.y = options.size - 1;
				fromPosition.y = options.size + 1;
			}
		}
		
		player.x = fromPosition.x;
		player.y = fromPosition.y;
		player.update();

		player.element.classList.add(direction);
		player.element.classList.add('walk');

		Animate.after(1, _ => {
			player.x = playerPosition.x;
			player.y = playerPosition.y;
			player.update();
		});

		Animate.after(1000, _ => {
			player.animating = false;
			player.element.classList.remove(direction);
			player.element.classList.remove('walk');
		});

	}

	player.goDirection = direction => {
		if(!player.animating && !Maze.ended) {
			let currentCell = Maze[player.y][player.x];

			if(currentCell.allowLeft && direction == LEFT) player.jump('left');

			if(currentCell.allowRight && direction == RIGHT) player.jump('right');

			if(currentCell.allowTop && direction == UP) player.jump('up');

			if(currentCell.allowBottom && direction == DOWN) player.jump('down');
		}
	}

	let jump = direction => {
		if(player.animating) return;

		player.animating = true;

		player.element.classList.remove('left');
		player.element.classList.remove('right');
		player.element.classList.remove('up');
		player.element.classList.remove('down');
		player.element.classList.add(direction);

		if(direction == 'left') {
			player.element.classList.remove('face-right');
			player.element.classList.add('face-left');
		}
		if(direction == 'right') {
			player.element.classList.remove('face-left');
			player.element.classList.add('face-right');
		} 

		if(direction == 'left') player.x -= 1;
		if(direction == 'right') player.x += 1;
		if(direction == 'up') player.y -= 1;
		if(direction == 'down') player.y += 1;

		player.element.classList.add('jump');

		/* wait animation */
		Animate.after(500, _ => stopJump(player, direction))
	};

	let stopJump = (player, direction) => {
		player.element.classList.remove('jump');
		player.update();

		if(Maze.checkPosition(player)) player.animating = false;
	};

	player.update = _ => {
		player.element.style.left = (player.x * Maze.options.cellSize) + 'px';
		player.element.style.top = (player.y * Maze.options.cellSize) + 'px';
		updateColor(player);
	};

	player.updateColor = _ => {
		player.element.style.setProperty('--player-color', player.color);
		player.element.style.setProperty('--contrast-color', Utils.idealTextColor(player.color));
	};

}