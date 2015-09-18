// Changes the console foreground to red
var redCode = '\x1b[31m';

// Resets the console foreground
var clearCode = '\x1b[39m';

module.exports.debug = function () {
	var args = new Array(arguments.length + 2);
	args[0]=redCode; // insert as first item
	for(var i = 0; i < arguments.length; ++i) {
                //i is always valid index in the arguments object
        args[i+1] = arguments[i];
    }
	args[i+1] = clearCode; // insert as last item
	console.log.apply(this, args);
};