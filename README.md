# MapLoader
Map Backup/Restore for Xiaomi Vacuum and Roborock

## Init.d Startup Script for Autostart
Init.d Startupscript

copy the _maploader_ file from the initscript directory to _/etc/init.d/_ on your robo. 
Then make the file executable and start it:

```
chmod 755 /etc/init.d/maploader
update-rc.d maploader defaults
/etc/init.d/maploader start
```
