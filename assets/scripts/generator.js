export default function(maze) {
	let moves = [];

	maze.on('clean', _ => {
		maze.cells = [];	// contains all maze
		moves = [];	// contains moves to create maze

		maze.cells.forEach(line => line.forEach(cell => {
			cell.allowLeft = cell.allowTop = cell.allowRight = cell.allowBottom = false;
			updateOrCreateCell(cell);
		}));
	});

	maze.on('generate', _ => {
		maze.idMaze++;

		let firstCell = maze.randomPosition();

		updateOrCreateCell(firstCell);
		moves.push(firstCell);

		generateNextCell(firstCell);
	});

	let updateOrCreateCell = function(cell) {
		maze.cells[cell.y] = maze.cells[cell.y] || [];
		cell = Object.assign(maze.cells[cell.y][cell.x] || {}, cell);
		cell.maze = maze.idMaze;

		if(!cell.element)  {
			cell.element = document.createElement('cell');
			cell.element.setAttribute('x', cell.x);
			cell.element.setAttribute('y', cell.y);
			cell.element.style.left = (cell.x * options.cellSize) + 'px';
			cell.element.style.top = (cell.y * options.cellSize) + 'px';

			cell.element.appendChild(document.createElement('paths'));
			cell.element.appendChild(document.createElement('borders'));
			maze.element.appendChild(cell.element);
		}

		if(cell.allowTop) cell.element.classList.add('allow-top');
		if(cell.allowBottom) cell.element.classList.add('allow-bottom');
		if(cell.allowLeft) cell.element.classList.add('allow-left');
		if(cell.allowRight) cell.element.classList.add('allow-right');

		maze.cells[cell.y][cell.x] = cell;
	};

	let existsCell = (x, y) => maze && maze[y] && maze[y][x] && maze[y][x].maze == currentMaze;

	let generateNextCell = function({x, y}) {
		if(moves.length) {
            var possibleDirections = [];

            // Go North
            if(y > 0 && !existsCell(x, y-1)) possibleDirections.push("N");
            // Go South
            if(y < (options.size -1) && !existsCell(x, y+1)) possibleDirections.push("S");
            // Go West
            if(x > 0 && !existsCell(x-1, y)) possibleDirections.push("W");
            // Go East
            if(x < (options.size -1) && !existsCell(x+1, y)) possibleDirections.push("E");

            if(possibleDirections.length) {
                var move = random(possibleDirections.length);
                let nextCell;

                switch (possibleDirections[move]) {
                    case "S": 
                      	updateOrCreateCell({x, y, allowBottom: true});
                      	y += 1;
                      	nextCell = {x, y, allowTop: true};
             		break;
                    case "N": 
                      	updateOrCreateCell({x, y, allowTop: true});
                      	y -= 1;
                      	nextCell = {x, y, allowBottom: true};
             		break;
                    case "W": 
                      	updateOrCreateCell({x, y, allowLeft: true});
                      	x -= 1;
                      	nextCell = {x, y, allowRight: true};
             		break;
                    case "E": 
                      	updateOrCreateCell({x, y, allowRight: true});
                      	x += 1;
                      	nextCell = {x, y, allowLeft: true};
             		break;
                }

              	updateOrCreateCell(nextCell);
              	moves.push(nextCell);
            } else {
                let move = moves.pop();
                x = move.x, y = move.y;
            }

            generateNextCell({x, y});
		}
	}
}