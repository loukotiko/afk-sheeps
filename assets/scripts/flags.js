class Flags {
	let flags = {};

	maze.on('init', _ => {
		placeFlags();
	});

	let addFlag = (name, position) => {
		position = position || maze.randomPosition();
		
		while(Object.values(flags).some(flag => flag.x == position.x && flag.y == position.y)) {
			position = randomPosition();
		}

		let flag = document.createElement('flag');
		flag.className = name;
		flag.style.left = (position.x * maze.options.cellSize) + 'px';
		flag.style.top = (position.y * maze.options.cellSize) + 'px';
		flag.e[name] = { element: flag, ...position };
		maze.element.appendChild(flag);
	}

	let placeFlags = _ => {
		let nbOfHoles = random(maze.options.holes.min, maze.options.holes.max);

		mazeElement.querySelectorAll('flag').forEach(flag => mazeElement.removeChild(flag));

		Array.from(Array(nbOfHoles)).forEach((_,i) => addFlag('hole-' + i));

		addFlag('grow');
	}

	let playerOn = (player, name) => {
		return player.x == flags[name].x && player.y == flags[name].y;
	}
}
export default new Flags();