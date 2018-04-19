import Maze from 'maze';

class Interactions {
	// MANUAL
	const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
	window.addEventListener('keydown', event => Maze.selectedPlayer && Maze.selectedPlayer.goDirection(event.keyCode));

	// TWITCH
    let webSocket = new WebSocket('wss://irc-ws.chat.twitch.tv:443/', 'irc');

    webSocket.onerror = message => console.log('Erreur: ', message);

	webSocket.onopen = _ => {
	    if (webSocket !== null && webSocket.readyState === 1) {
	        webSocket.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
	        webSocket.send('PASS ' + Maze.options.socket.oauth);
	        webSocket.send('NICK ' + Maze.options.socket.nick);
	        webSocket.send('JOIN #chatrooms:' + Maze.options.socket.channelId + ':' + Maze.options.socket.roomId);
	    }
	};

    webSocket.onmessage = message => {
	    if(message != null) {
	        var parsed = parseMessage(message.data);
	        if(parsed != null) {
	            if(parsed.command === "PRIVMSG") {

	            	let msg = parsed.message.split(/\s/)[0].toLowerCase()[0];

					if(!Maze.players[parsed.username]) {
						if(['j', 'jouer'].indexOf(msg) != -1) {
							let player = new Player(Maze, parsed, false);
							players[parsed.username] = player;
						}
					} else {
		            	if(['d', 'm', '6'].indexOf(msg) != -1) players[parsed.username].goDirection(RIGHT);
		            	else if(['q', 'k', '4'].indexOf(msg) != -1) players[parsed.username].goDirection(LEFT);
		            	else if(['z', 'o', '8'].indexOf(msg) != -1) players[parsed.username].goDirection(UP);
		            	else if(['s', 'l', '5'].indexOf(msg) != -1) players[parsed.username].goDirection(DOWN);
		            }

		        } else if(parsed.command === "PING") {
	                webSocket.send("PONG :" + parsed.message);
	            }
	        }
	    }
    };
}

export default new Interactions();