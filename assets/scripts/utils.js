class Utils {
	// random
	this.random = (n=0,m=1) => Math.floor(Math.random()*((m&&(m-n+1))||n))+((m&&n)||0);

	// colors
	this.idealTextColor = function(bgColor) {
	   var {R, G, B} = getRGBComponents(bgColor);
	   var bgDelta = R * .299 + G * .587 + B * .114;

	   return 255 - bgDelta < 105 ? "#000000" : "#ffffff";   
	};

	let getRGBComponents = function(color) {
	    var R = parseInt(color.substring(1, 3), 16);
	    var G = parseInt(color.substring(3, 5), 16);
	    var B = parseInt(color.substring(5, 7), 16);
	    return { R, G, B };
	};

	/* tags:
		@badges: badgeinactif/0,badgeactif/1
		color: #rrvvbb
		display-name: UsErNaMe
		emotes:
		mod: 1/0
		subscriber: 1/0
		turbo: 1/0
	*/
	this.parseMessage = function(rawMessage) {
	    var parsedMessage = {
	        message: null,
	        tags: null,
	        command: null,
	        original: rawMessage,
	        channel: null,
	        username: null
	    };

	    if(rawMessage[0] === '@'){
	        var tagIndex = rawMessage.indexOf(' '),
	        userIndex = rawMessage.indexOf(' ', tagIndex + 1),
	        commandIndex = rawMessage.indexOf(' ', userIndex + 1),
	        channelIndex = rawMessage.indexOf(' ', commandIndex + 1),
	        messageIndex = rawMessage.indexOf(':', channelIndex + 1);

	        let rawTags = rawMessage.slice(0, tagIndex);
	        parsedMessage.tags = rawTags.split(';').reduce((tags, rawTag) => {
	        	let [key, value] = rawTag.split('=');
	        	tags[key] = value;
	        	return tags;
	        }, {});

	        parsedMessage.username = rawMessage.slice(tagIndex + 2, rawMessage.indexOf('!'));
	        parsedMessage.command = rawMessage.slice(userIndex + 1, commandIndex);
	        parsedMessage.channel = rawMessage.slice(commandIndex + 1, channelIndex);
	        parsedMessage.message = rawMessage.slice(messageIndex + 1);
	    } else if(rawMessage.startsWith("PING")) {
	        parsedMessage.command = "PING";
	        parsedMessage.message = rawMessage.split(":")[1];
	    }

	    return parsedMessage;
	}
}

export default new Utils();