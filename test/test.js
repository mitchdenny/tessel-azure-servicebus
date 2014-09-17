var tasb = require("../index.js");
var assert = require('assert');
describe('tessel-azure-servicebus', function(){
	describe('#createQueueClient', function() {
		it ('should return a QueueClient with a createQueue function.', function () {
			var queueClient = tasb.createQueueClient('tasbunittest');
			assert(queueClient.createQueue != null, 'QueueClient does not contain a defintiion for createQueue.');
		});
	});
});