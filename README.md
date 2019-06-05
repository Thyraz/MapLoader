# MapLoader
Map Backup/Restore for Xiaomi Vacuum and Roborock

## Description
MapLoader is a NodeJS based service, running on the robo that listens to MQTT commands.
available topics:
* rockrobo/map/load
* rockrobo/map/save

The message payload is a name for the map you want to save or load.\
For example _DefaultMap_, _Groundfloor_, or _UpperFloor_

The map bundles are saved to _/mnt/data/maploader/maps/..._

## Requirements
Just a rooted device with SSH access.\
DustCloud or Valetudo are not needed, works with devices using the original Xiaomi Cloud and App.

## Installation
**1. Root the device and log in as root per SSH**\

**2. Install needed packages**
```
apt-get update
apt-get install nano wget xz-utils
```
**3. Install NodeJS to /mnt/data (don't use apt to install, as we don't have enough free space on the root partition)**
```
mkdir /mnt/data/node
cd /mnt/data/node
```
Get the link for the current NodeJS ARM7 binary package from here: https://nodejs.org/en/download/ \
Download and extract (replace <version> and <distro> with the content of the file you downloaded):
```
wget <link from above>
sudo tar -xJvf node-<version>-<distro>.tar.xz -C /mnt/data/node/
rm node-<version>-<distro>.tar.xz
```
Add the NodeJS path to the profile of the root user:
```
nano ~/.profile
```
Append this line at the end of the file (replace <version> and <distro> to match the path of your node installation):
```
export PATH=/mnt/data/node/node-<version>-<distro>/bin:$PATH
```
**4. Test your node installation**
```
node -v
```
Output should be the version and not a _command not found_ error
  
**5. Install the Node MQTT module (replace <version> and <distro> to match the path of your node installation)**
```
cd /mnt/data/node/node-<version>-<distro>/lib
npm install mqtt --save
```
**6. Install MapLoader**\
Download the content of this GIT and copy _maploader.js_ and the _maps_ subfolder to _/mnt/data/maploader/_ on the robo.\
Edit /mnt/data/maploader/ and change the IP adress in line 3 to the IP of your robo.

## Manual Start for Testing
```
cd /mnt/data/maploader
node maploader.js
```
When you publish MQTT messages to the topics _rockrobo/map/save_ and _rockrobo/map/load_ on your broker,
you should see console messages about the copied files. 

## Init.d Startup Script for Autostart
Init.d Startupscript

copy the _maploader_ file from the initscript directory to _/etc/init.d/_ on your robo. 
Then make the file executable and start it:

```
chmod 755 /etc/init.d/maploader
update-rc.d maploader defaults
/etc/init.d/maploader start
```
