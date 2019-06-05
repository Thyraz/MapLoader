# MapLoader
Map Backup/Restore for Xiaomi Vacuum and Roborock

## Description
MapLoader is a NodeJS based service, running on the robo that listens to MQTT commands.
available topics:
* rockrobo/map/load
* rockrobo/map/save

The message payload is a name for the map you want to save or load.\
For example _DefaultMap_, _Groundfloor_, or _UpperFloor_

## Requirements
Just a rooted device with SSH access.\
DustCloud or Valetudo are not needed, works with devices using the original Xiaomi Cloud and App.

## Init.d Startup Script for Autostart
Init.d Startupscript

copy the _maploader_ file from the initscript directory to _/etc/init.d/_ on your robo. 
Then make the file executable and start it:

```
chmod 755 /etc/init.d/maploader
update-rc.d maploader defaults
/etc/init.d/maploader start
```
