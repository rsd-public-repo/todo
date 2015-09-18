var express = require('express');
var bodyParser = require('body-parser');

var server_modules = require('./server_modules')
var serverRoutes = server_modules.routes
var eventEmitter = server_modules.events.emitter

// The express app serves static content even when the MongoDB connection is down
var app = express();
app.use(express.static(__dirname + '/public'));
/*app.use('/todo', function (req, res, next) {
	res.status(500).send('MongoDB is not connected');
	next();
});*/
app.listen(3000);
console.log('Listening on port 3000');

var mongoDbConnectedHandler = function () {
	console.log('MongoDB connected handler called');
	
	// Unsubscribe
	//eventEmitter.removeListener('mongoConnected',mongoDbConnectedHandler);
	
	app.use('/todo', serverRoutes.connectedRouter);
};

eventEmitter.on('mongoConnected', mongoDbConnectedHandler);