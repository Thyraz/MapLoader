const fs = require('fs');
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://user:passwd@xxx.xxx.xxx.xxx',{clientId:"rockrobo"});//enter your mqtt-server credentials here

// Subscribe Topics
client.on('connect', () => {
	console.log("Connected");
    	client.publish("rockrobo/map/log", "Connected");//added log via mqtt
	client.subscribe('rockrobo/map/load');
	client.subscribe('rockrobo/map/save');
});

// Incoming MQTT message (payload is the desired 'map bundle' name -> /mnt/data/maploader/maps/<name>)
client.on('message', (topic, message) => {
	if(topic === 'rockrobo/map/load') {
		var source = '/mnt/data/maploader/maps/' + message + '/';
		var destination = '/mnt/data/rockrobo/';

		console.log("Received Load Request: " + message);

        	client.publish("rockrobo/map/log", "Received Load Request: " + message);//added log via mqtt
		copyFiles(source, destination);
	}

	if(topic === 'rockrobo/map/save') {
		var source = '/mnt/data/rockrobo/';
		var destination = '/mnt/data/maploader/maps/' + message + '/';

		console.log("Received Save Request: " + message);
        	client.publish("rockrobo/map/log", "Received Save Request: " + message);//added log via mqtt
		copyFiles(source, destination);
	}
});

// Backup or restore map files
function copyFiles(source, destination) {
	const files = ['user_map0', 'last_map', 'PersistData_1.data', 'PersistData_2.data', 'ChargerPos.data', 'Rotater.cfg', 'StartPos.data'];//added all necessary files for complete transfer, otherwise docking station could be rotated to map which makes created zones useless

	if (!fs.existsSync(destination)){
		fs.mkdirSync(destination);
		console.log('Created directory: ' + destination);
        	client.publish("rockrobo/map/log", 'Created directory: ' + destination);//added log via mqtt
	}

	for (i = 0; i < files.length; i++) {
        if (!fs.existsSync(source + files[i])){//check if files not existing and create error msg
            console.log('Error: ' + source + files[i] + ' not found');
            var options = {retain:true, qos:1};
            client.publish('Error: ' + "rockrobo/map/log", files[i] + ' not found', options);//added log via mqtt
        }
        else{//if file present, copy and create msg
    		fs.copyFileSync(source + files[i], destination + files[i]);
	    	console.log('Copied ' + files[i] + ' from ' + source + ' to ' + destination);
            	client.publish("rockrobo/map/log", 'Copied ' + files[i] + ' from ' + source + ' to ' + destination);//added log via mqtt
        }
	}
}
