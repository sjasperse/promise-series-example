var Q = require('q');
var _ = require('underscore');

// turns a single name into a fake chunk of work, returning a promise
function doWork(name) {
	return function () { 
		var deferrer = Q.defer();

		setTimeout(function () {
			console.log('Task finished: ' + name);
			deferrer.resolve();
		}, 1000);

		return deferrer.promise;
	};
}

// creathing the list of tasks I want to execute
var items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var tasks = _.map(items, function (item) {
	return doWork(item);
});

// function to chain tasks together, returning the final promise
function callInOrder(list) {
	function callRecursive(head, tail) {
		var headPromise = head();

		if (tail.length > 0) {
			return headPromise.then(function () {
				return callRecursive(tail[0], _.rest(tail));
			});
		} else {
			return headPromise;
		}
	}	

	return callRecursive(list[0], _.rest(list));
}

// test it. should see each task finish in order, with a noticable delay between, and a 'Finished' message at the end.
console.log('Starting tasks...');
callInOrder(tasks)
	.then(function () {
		console.log('Finished');
	});



