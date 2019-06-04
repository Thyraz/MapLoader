const fs = require('fs');
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://172.17.2.86');

client.on('connect', () => {
  console.log("Connected");
  client.subscribe('rockrobo/map/load');
  client.subscribe('rockrobo/map/save');
});

client.on('message', (topic, message) => {
  if(topic === 'rockrobo/map/load') {
    console.log("Received Load Request: " + message);
  }

  if(topic === 'rockrobo/map/save') {
    var dir = '/mnt/data/maploader/maps/' + message + '/';
    console.log("Received Save Request: " + message);

    if (!fs.existsSync(dir)){
        console.log('Created directory: ' + dir);
        fs.mkdirSync(dir);
    }

    fs.copyFile('/mnt/data/rockrobo/user_map0',  dir + '/user_map0', (err) => {
      if (err) throw err;
      console.log('user_map0 was copied to maps/' + message);
    });

    fs.copyFile('/mnt/data/rockrobo/last_map',  dir + '/last_map', (err) => {
      if (err) throw err;
      console.log('last_map was copied to maps/' + message);
    });

    fs.copyFile('/mnt/data/rockrobo/PersistData_1.data',  dir + '/PersistData_1.data', (err) => {
      if (err) throw err;
      console.log('PersistData_1.data was copied to maps/' + message);
    });

    fs.copyFile('/mnt/data/rockrobo/PersistData_2.data',  dir + '/PersistData_2.data', (err) => {
      if (err) throw err;
      console.log('PersistData_2.data was copied to maps/' + message);
    });
  }
});
