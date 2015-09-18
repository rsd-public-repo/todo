var server_modules = require('../server_modules/index')
var assert= require('assert')

var assert = require("assert");
describe('our test suite', function() {
	it('should pass this test', function() {
		console.debug('test1','test2','test3');
	});
	it('should fail this test', function() {
		assert.notEqual(0,1);
	});
});


