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
var config = require('./config.json');

describe('tessel-azure-servicebus', function (){
	describe('#createQueueClient(namespace)', function () {
		it('should return a QueueClient with a createQueue function.', function (done) {
			var queueClient = tasb.createQueueClient(
				config.namespace,
				config.sharedAccessKeyName,
				config.sharedAccessKey
				);

			assert(queueClient.createQueue != null, 'QueueClient does not contain a defintiion for createQueue.');
			done();
		});

		it('should have a namespace that is set according to config.', function (done) {
			var queueClient = tasb.createQueueClient(
				config.namespace,
				config.sharedAccessKeyName,
				config.sharedAccessKey
				);

			assert.equal(queueClient.getNamespace(), config.namespace);
			done();
		});

		it('should have a sharedAccessKey that is set according to config.', function (done) {
			var queueClient = tasb.createQueueClient(
				config.namespace,
				config.sharedAccessKeyName,
				config.sharedAccessKey
				);

			assert.equal(queueClient.getSharedAccessKey(), config.sharedAccessKey);
			done();
		});

		it('should have a sharedAccessKeyName that is set according to config.', function (done) {
			var queueClient = tasb.createQueueClient(
				config.namespace,
				config.sharedAccessKeyName,
				config.sharedAccessKey
				);

			assert.equal(queueClient.getSharedAccessKeyName(), config.sharedAccessKeyName);
			done();
		});
	});

	describe('ServiceBusQueueClient', function () {
		describe('#createQueue(path)', function () {
			it('should create a queue on the configured namespace.', function (done) {
				var queueClient = tasb.createQueueClient(
					config.namespace,
					config.sharedAccessKeyName,
					config.sharedAccessKey
					);

				queueClient.createQueue('helloworld', function (result) {
					done();
				});
			});
		});
	});
});