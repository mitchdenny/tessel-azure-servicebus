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

var https = require('https');
var util = require('util');

function QueueClient(namespace, sharedAccessKeyName, sharedAccessKey)
{
	var that = this;
	that.namespace = namespace;
	that.sharedAccessKeyName = sharedAccessKeyName;
	that.sharedAccessKey = sharedAccessKey;

	that.getDefaultHttpsRequestOptions = function(namespace, path) {
		var options = {
			hostname: util.format('%s.servicebus.windows.net', namespace),
			path: util.format('/%s', path),
			port: 443
		};

		return options;
	};

	return {
		namespace: that.namespace,
		sharedAccessKeyName: that.sharedAccessKeyName,
		sharedAccessKey: that.sharedAccessKey,

		createQueue: function(path, callback) {
			var options = that.getDefaultHttpsRequestOptions(that.namespace, path);
			callback(null);
		},

		deleteQueue: function(path, callback) {
			var options = that.getDefaultHttpsRequestOptions(that.namespace, path);
			callback(null);
		},

		getQueue: function(path, callback) {
			var options = that.getDefaultHttpsRequestOptions(that.namespace, path);
			callback(null);
		},

		listQueues: function(callback) {
			callback(null);
		}
	};
}

module.exports.createQueueClient = function(namespace, sharedAccessKeyName, sharedAccessKey) {
	var queueClient = new QueueClient(namespace, sharedAccessKeyName, sharedAccessKey);
	return queueClient;
};
		