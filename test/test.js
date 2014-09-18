// Copyright 2014 Mitch Denny
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var tasb = require("../index.js");
var assert = require('assert');

describe('tessel-azure-servicebus', function(){
	describe('#createQueueClient(namespace)', function() {
		it('should return a QueueClient with a createQueue function.', function () {
			var queueClient = tasb.createQueueClient('tessel-azure-servicebus');
			assert(queueClient.createQueue != null, 'QueueClient does not contain a defintiion for createQueue.');
		});
	});

	describe('ServiceBusQueueClient', function() {
		describe('#createQueue(path)', function() {
			it('should create a queue on the configured namespace.', function() {
				var queueClient = tasb.createQueueClient('tessel-azure-servicebus');
				var result = queueClient.createQueue('helloworld');
				// TODO: Add assertion.
			});
		});
	});
});