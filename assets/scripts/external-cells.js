export default function(maze) {
	maze.on('init', _ => {
		createExternalCells();
	});

	let createExternalCells = function() {
		let directions = ['allow-left', 'allow-top', 'allow-right', 'allow-bottom', 'allow-left'];
		let directionIndex = 0;
		let shiftCell = 0;
		let x = -1, y = -1;

		Array.from(Array((maze.options.size + 1) * 4)).forEach((_, i) => {
			let externalCell = document.createElement('cell');
			externalCell.appendChild(document.createElement('paths'));
			externalCell.classList.add('external');
			externalCell.classList.add(directions[directionIndex]);

			if(directionIndex == 4) y -= 1;
			else if(directionIndex == 1) x += 1;
			else if(directionIndex == 2) y += 1;
			else if(directionIndex == 3) x -= 1;
			
			externalCell.style.left = (x * maze.options.cellSize) + 'px';
			externalCell.style.top = (y * maze.options.cellSize) + 'px';

			if(!(i % (maze.options.size + 1))) {
				directionIndex++;
				shiftCell = 0;
				externalCell.classList.add(directions[directionIndex]);
			} else {
				shiftCell++;
			}

			maze.element.appendChild(externalCell);
		});
	}
}