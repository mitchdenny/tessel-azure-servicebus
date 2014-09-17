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

function QueueClient(namespace)
{
	return {
		createQueue: function(path) {
			console.error('createQueue(path) has not been implemented yet.');
			return {};
		},
		deleteQueue: function(path) {
			console.error('deleteQueue(path) has not been implemented yet.')
			return {};
		},
		getQueue: function(path) {
			console.error('getQueue(path) has not been implemented yet.');
			return {};
		},
		listQueues: function() {
			console.error('listQueues() has not been implemented yet.');
			return {};
		}
	};
}

module.exports.createQueueClient = function(namespace) {
	var queueClient = new QueueClient(namespace);
	return queueClient;
};
		