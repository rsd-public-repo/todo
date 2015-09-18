var express = require('express');
var bodyParser = require('body-parser');

var mongo = require('./mongo.js');
//var mongo = require('./model.js');
console.debug('mongo.itemsCollection first', mongo.itemsCollection);

//Create a router that can accept JSON
var router = express.Router();
router.use(bodyParser.json());

// Setup the collection routes
router.route('/')
.get(function (req, res, next) {
	console.debug('Getting items list');
	console.debug('mongo.itemsCollection get', mongo.itemsCollection);
	
	mongo.findAllTodoItems()
		.then(function (docs) {
			console.log('Found items', docs);
			res.send({
				status: 'Items found',
				items: docs
			});
		})
		.catch(function(err) {
			console.error(err);
		})
})
.post(function (req, res, next) {
	var item = req.body;
	console.debug('Received new item', item);
	mongo.insertNewItem(item)
		.then(function (item) {
			console.log('Inserted item', item);
			res.send({
				status: 'Item added',
				itemId: item._id
			});
		})
		.catch(function(err) {
			console.error(err);
		})
})

// Setup the item routes
router.route('/:id').delete(function (req, res, next) {
	var id = req.params['id'];
	console.debug('Removing item', id);
	mongo.deleteItem(id)
	.then(function (item) {
		console.log('Deleted item', id);
		res.send({ status: 'Item cleared' });
	})
	.catch(function(err) {
		console.error(err);
	})
});

exports.connectedRouter = router;

/*module.exports.__defineGetter__('connectedRouter', function () {
	console.debug('constructing connectedRouter');
	
	return router;
});*/