const fs = require('fs');
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://172.17.2.86');

// Subscribe Topics
client.on('connect', () => {
	console.log("Connected");
	client.subscribe('rockrobo/map/load');
	client.subscribe('rockrobo/map/save');
});

// Incoming MQTT message (payload is the desired 'map bundle' name -> /mnt/data/maploader/maps/<name>)
client.on('message', (topic, message) => {
	if(topic === 'rockrobo/map/load') {
		var source = '/mnt/data/maploader/maps/' + message + '/';
		var destination = '/mnt/data/rockrobo/';

		console.log("Received Load Request: " + message);
		copyFiles(source, destination);
	}

	if(topic === 'rockrobo/map/save') {
		var source = '/mnt/data/rockrobo/';
		var destination = '/mnt/data/maploader/maps/' + message + '/';

		console.log("Received Save Request: " + message);
		copyFiles(source, destination);
	}
});

// Backup or restore map files
function copyFiles(source, destination) {
	const files = ['user_map0', 'last_map', 'PersistData_1.data', 'PersistData_2.data'];

	if (!fs.existsSync(destination)){
		fs.mkdirSync(destination);
		console.log('Created directory: ' + destination);
	}

	for (i = 0; i < files.length; i++) {
		if (fs.existsSync(source + files[i]) {
			fs.copyFileSync(source + files[i], destination + files[i]);
			console.log('Copied ' + files[i] + ' from ' + source + ' to ' + destination);
		}
	}
}
