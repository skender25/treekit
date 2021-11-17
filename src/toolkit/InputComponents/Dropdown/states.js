const states = new Map();

states.set('init', 'open');
states.set('open', 'close');
states.set('close', 'open');

export default states;