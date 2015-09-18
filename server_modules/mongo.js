var mongodb = require('mongodb');
var Q = require('q');

var config = require('../config');
//var config = require('../config_bad');

var MongoClient = mongodb.MongoClient;
var todoItemsDatabase = null;

//Connect to MongoDB
console.debug('Connecting to MongoDB')
var mongoConnectAsync = Q.nbind(MongoClient.connect);
var eventEmitter = require('./events.js').emitter

//TODO: Promise timeout
mongoConnectAsync(config.mongoDbConnectionURL)
.then(function (database) {
	// Connected!
	console.debug('Connected to MongoDB')
	todoItemsDatabase = database;
	// Emit mongoConnected event
	eventEmitter.emit('mongoConnected');
})
.catch(function (reason) {
	console.error('Failed to connect to MongoDB', reason);
	console.trace();
});

exports.findAllTodoItems = function() {	
	if (!todoItemsDatabase ) {
		return Q.reject(new Error('Not connected to MongoDB'));
	}
	
	var deferred = Q.defer();
	todoItemsDatabase.collection(config.todoItemsColection).find().toArray(function (err, docs) {
		console.debug('Mongo find callback is called', err, docs);
		if (err) {
			console.error('Mongo could not find the items', err);
			deferred.reject(err);
		} else {
			console.log('Mongo found items', docs);
			deferred.resolve(docs);
		}
	});
	
	return deferred.promise;
}

exports.insertNewItem = function (item) {
	if (!todoItemsDatabase ) {
		return Q.reject(new Error('Not connected to MongoDB'));
	}
	
	var deferred = Q.defer();
	todoItemsDatabase.collection(config.todoItemsColection).insert(item, function (err, docs) {
		console.debug('Mongo insert callback is called', err, docs);
		if (err) {
			console.error('Mongo could not insert the item', err);
			deferred.reject(err);
		} else {
			console.log('Mongo inserted the item', docs);
			deferred.resolve(docs);
		}
	});
	
	return deferred.promise;
}

exports.deleteItem = function (id) {
	if (!todoItemsDatabase ) {
		return Q.reject(new Error('Not connected to MongoDB'));
	}
	
	var lookup = { _id: new mongodb.ObjectID(id) };
	console.debug('Removing item by lookup', lookup);
	
	var deferred = Q.defer();
	todoItemsDatabase.collection(config.todoItemsColection).remove(lookup, function (err, docs) {
		console.debug('Mongo remove callback is called', err, docs);
		if (err) {
			console.error('Mongo could not remove the item', err);
			deferred.reject(err);
		} else {
			console.log('Mongo removed the item', docs);
			deferred.resolve(docs);
		}
	});
	
	return deferred.promise;
}
