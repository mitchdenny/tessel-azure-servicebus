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
var crypto = require('crypto');

function QueueClient(namespace, sharedAccessKeyName, sharedAccessKey)
{
	var that = this;
	that.namespace = namespace;
	that.sharedAccessKeyName = sharedAccessKeyName;
	that.sharedAccessKey = sharedAccessKey;

	that.getHttpsRequestOptions = function(method, namespace, path, sharedAccessKeyName, sharedAccessKey) {
		var url = that.getUrlFromNamespaceAndPath(namespace, path);
		var token = that.generateSasToken(url, sharedAccessKeyName, sharedAccessKey);

		var options = {
			hostname: util.format('%s.servicebus.windows.net', namespace),
			path: util.format('/%s', path),
			port: 443,
			method: method,
			headers: {
				'Authorization': token,
				'Content-Type': 'application/atom+xml;type=entry;charset=utf-8'
			}
		};

		return options;
	};

	that.getUrlFromNamespaceAndPath = function (namespace, path) {
		var url = util.format('https://%s.servicebus.windows.net/%s', namespace, path);
		return url;
	};

	that.generateSasToken = function(url, sharedAccessKeyName, sharedAccessKey)
	{
		var epoch = new Date().getTime();
		var expiry = epoch + 3600;

		var data = util.format('%s\n%s', url, epoch);
		
		var algorithm = crypto.createHmac('sha256', sharedAccessKey);
		algorithm.update(data);
		var signature = algorithm.digest('base64');
		
		var token = util.format(
			'SharedAccessSignature sr=%s&sig=%s&se=%s&skn=%s',
			encodeURIComponent(url),
			encodeURIComponent(signature),
			encodeURIComponent(expiry),
			encodeURIComponent(sharedAccessKeyName)
			);

		return token;
	};

	return {

		getNamespace: function() {
			return that.namespace;
		},

		getSharedAccessKeyName: function() {
			return that.sharedAccessKeyName;
		},

		getSharedAccessKey: function() {
			return that.sharedAccessKey;
		},

		createQueue: function(path, callback) {
			var options = that.getHttpsRequestOptions(
				'PUT',
				namespace,
				path,
				that.sharedAccessKeyName,
				that.sharedAccessKey
				);
			
			var request = https.request(options, function (response) {
				var result = {
					response: response
				};

				callback(result);
			}).on('error', function (error) {
				var result = {
					error: error
				};

				callback(result);
			});

			request.end();
		},

		deleteQueue: function(path, callback) {
			var options = that.getHttpsRequestOptions('DELETE', that.namespace, path, that.sharedAccessKeyName, that.sharedAccessKey);
			callback(null);
		},

		getQueue: function(path, callback) {
			var options = that.getDefaultHttpsRequestOptions('GET', that.namespace, path, that.sharedAccessKeyName, that.sharedAccessKey);
			callback(null);
		},

		listQueues: function(callback) {
			var options = that.getDefaultHttpsRequestOptions('GET', that.namespace, '', that.sharedAccessKeyName, that.sharedAccessKey);
			callback(null);
		}
	};
}

module.exports.createQueueClient = function(namespace, sharedAccessKeyName, sharedAccessKey) {
	var queueClient = new QueueClient(namespace, sharedAccessKeyName, sharedAccessKey);
	return queueClient;
};
		