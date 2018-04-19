class Maze {
	element = null
	idMaze = 0
	selectedPlayer = null
	ended = false
	players = {}

	options = {};

	constructor(options) {
		options = Object.assign({
			size: 7,
			cellSize: 100,
			holes: {min: 2, max: 5}
		}, options);

		this.options = options;

		Events.bind(this);

		init();
	}

	Maze.attachTo = function(MazeElement) {
		Maze.element = MazeElement;
		Maze.element.setProperty('--grid-size', Maze.options.size + 'px');
		Maze.element.setProperty('--cell-size', Maze.options.cellSize + 'px');
	};

	Maze.start = function() {
		generate();
	};

	// positions
	Maze.randomPosition = _ => {x: Utils.random(Maze.options.size), y: Utils.random(Maze.options.size)};
	Maze.centerPosition = {x: (Maze.options.size - 1) / 2, y: (Maze.options.size - 1) / 2};

	//
	let init = function() {
		// generate all divs?
//		Maze.element.querySelectorAll('cell, flag, player').forEach(flag => MazeElement.removeChild(flag));
		Maze.emit('init');

		// create random sheeps
	    Array.from(Array(5)).forEach((_, i) => {
			let player = new Player(Maze, {end: i==0, tags: {'color': '#fffecc', 'display-name': ''}}, true);
			player.update();
			Maze.players[i] = player;
			setInterval(_ => {
				if(player != Maze.selectedPlayer) {
					player.goDirection(random(37,  40));
				}
			}, random(2000, 10000));
	    });

	}

	let clean = function() {
		Maze.emit('clean');
	}

	let generate = function() {
		Maze.emit('generate');
	}

	Maze.checkPosition = (player, fromHole = false) => {
		if(!player.npc || player == selectedPlayer) {
			// A player jumps on a sheep
			Object.values(Maze.players).filter(player => player.npc).forEach(npc => {
				if(player.x == npc.x && player.y == npc.y) {
					if(npc.end) {
						endGame(player);
					} else {
						npc.color = player.color;
						npc.updateColor();
					}
				}
			});
		} else if(!player.end) {
			// A sheep jumps on a player
			Object.values(Maze.players).filter(player => !player.npc).forEach(pc => {
				if(player.x == pc.x && player.y == pc.y) {
					player.color = pc.color;
					player.updateColor();
				}
			});
		}

		if(!fromHole) {
			let playerOnHole = Array.from(Array(nbOfHoles)).map((_,i)=>i).find(i => playerOn(player, 'hole-'+i));
			if(playerOnHole !== undefined && !player.grown) {
				player.element.classList.add('fall');

				let randomHoleFlag = flags['hole-' + random(nbOfHoles)];
				let playerHoleFlag = flags['hole-' + playerOnHole];

				let distanceBetweenHoles = Math.abs(playerHoleFlag.position[0] - randomHoleFlag.position[0])
										 + Math.abs(playerHoleFlag.position[1] - randomHoleFlag.position[1]);

				Animate.after(distanceBetweenHoles * 500, _ => {
					player.x = randomHoleFlag.position[0];
					player.y = randomHoleFlag.position[1];

					updatePlayer(player);

					player.element.classList.remove('fall');
					player.element.classList.add('unfall');

					Animate.after(500, _ => {
						player.element.classList.remove('unfall');
						checkPosition(player, true);
						player.animating = false;
					});
				});

				return false;
			}
		}

		if(playerOn(player, 'grow')) {
			if(player.grown) {
				player.grown = false;
				player.element.classList.remove('grow');
				player.element.classList.add('ungrow');

				Animate.after(500, _ => {
					player.element.classList.remove('ungrow');
				});
			} else {
				player.grown = true;
				player.element.classList.remove('ungrow');
				player.element.classList.add('grow');
			}

			Animate.after(500, _ => player.animating = false);

			return false;
		} 

		return true;
	};

	Maze.endGame = player => {
		Maze.ended = true;
		// Afficher le texte
		let foundElement = document.createElement('found');
		foundElement.style.setProperty('--player-color', player.color);
		foundElement.style.setProperty('--contrast-color', idealTextColor(player.color));
		foundElement.innerHTML = '<name>' + (player.tags['display-name'] || 'Un mouton') + '</name> a trouvé le mouton avec la cloche !';
		document.body.appendChild(foundElement);

		Animate.after(3000, _ => {
			document.body.removeChild(foundElement);
		});

		// Retirer les barrières
		Maze.element.querySelectorAll('cell:not(.external)').forEach(flag => flag.className = '');
		
		Object.values(Maze.players).forEach(player => player.animating = false);

		Animate.after(1000, _ => {
			Animate.clearAllAnimations();
			let maxTime = 0;

			// Replacer les moutons et les joueurs
			Object.values(Maze.players).forEach(pl => {
				pl.element.classList.add('walk');

				if(pl.grown) {
					pl.grown = false;
					pl.element.classList.remove('grow');
					pl.element.classList.add('ungrow');

					Animate.after(500, _ => {
						pl.element.classList.remove('ungrow');
					});
				} else {
					pl.element.classList.remove('grow');
					pl.element.classList.remove('ungrow');
				}

				pl.element.classList.remove('fall');
				pl.element.classList.remove('unfall');
				pl.element.classList.remove('face-right');
				pl.element.classList.remove('face-left');

				if(selectedPlayer != pl) pl.color = pl.originalColor;

				let backToPosition;
				if(pl.npc) {
					backToPosition = centerPosition;
				} else {
					backToPosition = Maze.randomPosition();
					if(Utils.random()) {
						if(Utils.random()) {
							backToPosition.x = 0
						} else {
							backToPosition.x = options.size - 1;
						}
					} else {
						if(Utils.random()) {
							backToPosition.y = 0
						} else {
							backToPosition.y = options.size - 1;
						}
					}
				}

				let distanceX = Math.abs(pl.x - backToPosition.x);
				let distanceY = Math.abs(pl.y - backToPosition.y);

				if(pl.x < backToPosition.x) pl.element.classList.add('face-right');
				else pl.element.classList.add('face-left');

				pl.element.style.setProperty('--distance-x', distanceX + 's');
				pl.element.style.setProperty('--distance-y', distanceY + 's');
				pl.x = backToPosition.x;
				pl.y = backToPosition.y;

				updatePlayer(pl);

				let time = (distanceX + distanceY) * 1000;
				maxTime = Math.max(maxTime, time);
				Animate.after(time, _ => pl.element.classList.remove('walk'));
			});

			Animate.after(Math.max(1000, maxTime), _ => {
				// Remettre les barrières
				Maze.init();

				Animate.after(1000, _ => {
					Maze.ended = false;
				});
			});
		});
	};
};

Maze = new Maze(Options);