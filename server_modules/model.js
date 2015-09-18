var config = require('../config');
var mongoose = require('mongoose');
var eventEmitter = require('./events.js').emitter

console.debug('Connecting to MongoDB')

mongoose.connect(config.mongoDbConnectionURL);
var database = mongoose.connection;

database.on('error', function (reason) { 
	console.error('Failed to connect to MongoDB', reason);
	console.trace();
});

database.once('open', function callback() {
	// Connected!
	console.debug('Connected to MongoDB')
	exports.itemsCollection = database.collection('items');
	console.debug('exports.itemsCollection', exports.itemsCollection);
	
	// Emit mongoConnected event
	eventEmitter.emit('mongoConnected');
});

// Define an item schema
var TodoItemSchema = new mongoose.Schema({ _id: 'string', details: 'string' });
// Compile it into a model
var TodoItem = mongoose.model('TodoItem', TodoItemSchema);

exports.findAllItems = function() {
	TodoItem
	.find({ city: 'LA' })
	.where('name.last').equals('Ghost')
	.where('age').gt(17).lt(66)
	.limit(10)
	.exec(callback);
}

