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
var data2xml = require('data2xml');

function BrokeredMessage()
{
	var that = this;

	return {
	};
}

function SecurityHelper()
{
	var that = this;

	return {
	};
}

function Queue(path, queueClient)
{
	var that = this;
	that.path = path;
	that.queueClient = queueClient;

	return {
		getPath: function() {
			return that.path;
		},

		getQueueClient: function() {
			return that.queueClient;
		},

		sendMessage: function(message, callback) {
			callback();
		},

		sendMessageBatch: function(messages, callback) {
			callback();
		},

		receiveMessage: function(callback) {
			callback();
		},

		peekMessage: function(callback)	{
			callback();
		},

		unlockMessage: function(messageId, sequenceNumber, lockToken, callback)	{
			callback();
		},

		deleteMessage: function(messageId, sequenceNumber, lockToken, callback)	{
			callback();
		},

		renewMessageLock: function(messageId, sequenceNumber, lockToken, callback) {
			callback();
		}
	};
}

function QueueClient(namespace, sharedAccessKeyName, sharedAccessKey)
{
	var that = this;
	that.namespace = namespace;
	that.sharedAccessKeyName = sharedAccessKeyName;
	that.sharedAccessKey = sharedAccessKey;

	that.getHttpsRequestOptions = function(method, namespace, path, contentLength, sharedAccessKeyName, sharedAccessKey) {
		var url = that.getUrlFromNamespaceAndPath(namespace, path);
		var token = that.generateSasToken(url, sharedAccessKeyName, sharedAccessKey);

		var options = {
			hostname: util.format('%s.servicebus.windows.net', namespace),
			path: util.format('/%s', path),
			port: 443,
			method: method,
			headers: {
				'Authorization': token,
				'Content-Type': 'application/atom+xml;type=entry;charset=utf-8',
				'Content-Length': contentLength,
				'x-ms-version': '2014-05'
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
		var epochTime = new Date().getTime();
		var expiryTime = epochTime + 3600;

		var data = util.format('%s\n%s', encodeURIComponent(url), expiryTime);
		
		var algorithm = crypto.createHmac('sha256', sharedAccessKey);
		algorithm.update(data);
		var signature = algorithm.digest('base64');
		
		var token = util.format(
			'SharedAccessSignature sr=%s&sig=%s&se=%s&skn=%s',
			encodeURIComponent(url),
			encodeURIComponent(signature),
			encodeURIComponent(expiryTime),
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
			var queueDescriptionEntry = {
				_attr: {
					'xmlns': 'http://www.w3.org/2005/Atom'
				},
				'content': {
					_attr: {
						'type': 'application/xml'
					},
					'QueueDescription': {
						_attr: {
							'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
							'xmlns': 'http://schemas.microsoft.com/netservices/2010/10/servicebus/connect'
						}
					}
				}
			};

			var converter = data2xml();
			var content = converter('entry', queueDescriptionEntry);
			var contentLength = Buffer.byteLength(content, 'utf8');

			var options = that.getHttpsRequestOptions(
				'PUT',
				namespace,
				path,
				contentLength,
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

			request.end(content, 'utf8');
		},

		deleteQueue: function(path, callback) {
			var options = that.getHttpsRequestOptions(
				'DELETE', 
				that.namespace, 
				path, 0, 
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

		getQueue: function(path, callback) {
			var options = that.getDefaultHttpsRequestOptions(
				'GET',
				that.namespace,
				path,
				0,
				that.sharedAccessKeyName,
				that.sharedAccessKey
				);

			callback(null);
		},

		listQueues: function(callback) {
			var options = that.getDefaultHttpsRequestOptions(
				'GET',
				that.namespace,
				'',
				0, 
				that.sharedAccessKeyName, 
				that.sharedAccessKey);
			callback(null);
		}
	};
}

module.exports.QueueClient = QueueClient;
module.exports.SecurityHelper = SecurityHelper;
module.exports.Queue = Queue;
module.exports.BrokeredMessage = BrokeredMessage;

module.exports.createQueueClient = function(namespace, sharedAccessKeyName, sharedAccessKey) {
	var queueClient = new QueueClient(namespace, sharedAccessKeyName, sharedAccessKey);
	return queueClient;
};
		