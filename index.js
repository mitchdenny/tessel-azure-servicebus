var https = require('https');
var util = require('util');
var crypto = require('crypto');

function SecurityHelper()
{
	var self = this;

	return {
		generateSasToken: function(url, sharedAccessKeyName, sharedAccessKey) {
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
		}
	};
}

function EventHubClient(namespace, eventHubPath, deviceId, sharedAccessKeyName, sharedAccessKey)
{
	var self = this;
	self.securityHelper = new SecurityHelper();
	self.namespace = namespace;
	self.eventHubPath = eventHubPath;
	self.deviceId = deviceId;
	self.sharedAccessKeyName = sharedAccessKeyName;
	self.sharedAccessKey = sharedAccessKey;

	self.getPathFromEventHubPathAndDeviceId = function (eventHubPath, deviceId) {
		var path = util.format('%s/publishers/%s/messages', eventHubPath, deviceId);
		return path;
	};

	self.getUrlFromNamespaceAndPath = function (namespace, path) {
		var url = util.format('https://%s.servicebus.windows.net/%s', namespace, path);
		return url;
	};

	self.getHttpsRequestOptions = function(method, namespace, path, contentLength, sharedAccessKeyName, sharedAccessKey) {
		var url = self.getUrlFromNamespaceAndPath(namespace, path);
		var token = self.securityHelper.generateSasToken(url, sharedAccessKeyName, sharedAccessKey);

		var options = {
			hostname: util.format('%s.servicebus.windows.net', namespace),
			path: util.format('/%s', path),
			port: 443,
			method: method,
			headers: {
				'Authorization': token,
				'Content-Type': 'application/atom+xml;type=entry;charset=utf-8',
				'Content-Length': contentLength,
			}
		};

		return options;
	};

	return {
		sendEvent: function (event, callback) {
			var path = self.getPathFromEventHubPathAndDeviceId(
				self.eventHubPath,
				self.deviceId
			);

			var options = self.getHttpsRequestOptions(
				'POST',
				self.namespace,
				path,
				0,
				self.sharedAccessKeyName,
				self.sharedAccessKey
			);

			console.log(options);

			callback(null);
		}
	};
}

module.exports.createEventHubClient = function(namespace, eventHubPath, deviceId, sharedAccessKeyName, sharedAccessKey) {
	var eventHubClient = new EventHubClient(namespace, eventHubPath, deviceId, sharedAccessKeyName, sharedAccessKey);
	return eventHubClient;
};
