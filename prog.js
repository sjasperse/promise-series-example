var Q = require('q');
var _ = require('underscore');

function doWork(name) {
	return function () { 
		var deferrer = Q.defer();

		setTimeout(function () {
			deferrer.resolve();
			console.log('Task finished: ' + name);
		}, 1000);

		return deferrer.promise;
	};
}

var items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var tasks = _.map(items, function (item) {
	return doWork(item);
});

function callInOrder(list) {
	function callRecursivee(head, tail) {
		var headPromise = head();

		if (tail.length > 0) {
			return headPromise.then(function () {
				return callRecursivee(tail[0], _.rest(tail));
			});
		} else {
			return headPromise;
		}
	}	

	return callRecursivee(list[0], _.rest(list));
}

console.log('Starting tasks...');
callInOrder(tasks)
	.then(function () {
		console.log('Finished');
	});



