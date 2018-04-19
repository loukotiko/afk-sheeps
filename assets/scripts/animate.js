class Animate {
	let animations = [];

	this.after = (time, cb) => animations.push(setTimeout(cb, time));
	this.clearAllAnimations = _ => animations.forEach(animation => clearTimeout(animation));
}

export default new Animate();