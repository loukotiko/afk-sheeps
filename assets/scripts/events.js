export default function(object) {
	let events = {};

	object.prototype.emit = (event, parameters) => {
		if(events[event]) events[event].forEach(handler => handler(parameters));
	};

	object.prototype.on = (event, handler) => {
		if(!events[event]) events[event] = [];
		events[event].push(handler);
	};
}