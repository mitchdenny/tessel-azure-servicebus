var tasb = require('../index');
var client = tasb.createEventHubClient(
  'namespace',
  'eventHubPath',
  'sharedAccessKeyName',
  'sharedAccessKey'
);

var event = {
  'deviceId': 0,
  'distance': 30
};

client.sentEvent(event, function(err) {
  if (err) {
    console.log(err);
    return;
  }
});
