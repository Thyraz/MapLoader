# MapLoader
Map Backup/Restore for Xiaomi Vacuum and Roborock

## Description
MapLoader is a NodeJS based service, running on the robot that listens to MQTT commands.\
Available topics:
* rockrobo/map/load
* rockrobo/map/save

The message payload is the name you want to give the map backup or the name of the backup you want to restore.\
For example _DefaultMap_, _Groundfloor_, or _UpperFloor_

The map bundles are saved to _/mnt/data/maploader/maps/..._

Messages to the _save_ topic will create or overwrite a backup of the current map to a folder with the given name.\
Messages to the _load_ topic will copy a map backup back to the working directory of the robot.

**Example usage:**
* Restore the map after the robot damaged/lost it
* Load different maps for different floors in your house (you might need a charging dock on each floor to get that working)
* Reset your map to the _master map_ where all doors are open. (Helpful for room-based zone cleaning, which sometimes fails because a door was closed on the last cleaning cycle and the robot has no idea how to enter the room now.)

**Attention:** \
To get a loaded map to become visible in the Xiaomi Home app, start a full clean of the robot.\
You can cancel the full clean after 1-2s, the map will be loaded now.\
The robot shouldn't start to move in this short time, it just starts the vacuum motor.\

In combination with a smart home solution like FHEM/iobroker/HomeAssistant that already support the vacuum robots,\
you can automate the process of restoring -> start cleaning -> cancel cleaning even further.

## Requirements
Just a rooted device with SSH access.\
DustCloud or Valetudo are not needed, works with devices using the original Xiaomi Cloud and App.

## Installation
**1. Root the device and log in as root per SSH**

**2. Install needed packages**
```
apt-get update
apt-get install nano wget xz-utils
```
**3. Install NodeJS to /mnt/data/node/ (don't use apt to install, as we don't have enough free space on the root partition)**
```
mkdir /mnt/data/node
cd /mnt/data/node
```
Get the link for the current NodeJS ARM7 binary package from here: https://nodejs.org/en/download/ \
Download and extract (replace `<version>` and `<distro>` with the content of the file you downloaded):
```
wget <link from above>
sudo tar -xJvf node-<version>-<distro>.tar.xz -C /mnt/data/node/
rm node-<version>-<distro>.tar.xz
```
Add the NodeJS path to the profile of the root user:
```
nano /etc/environment
```
Add _/mnt/data/node/node-`<version>`-`<distro>`/bin_ to the PATH variable.\
Example:
```
PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/mnt/data/node/node-v10.16.0-linux-armv7l/bin"
```
Append this line at the end of the file (replace `<version>` and `<distro>` to match the path of your node installation):
```
NODE_PATH="/mnt/data/node/node-<version>-<distro>/lib/node_modules"
```
**4. Test your node installation**\
Log out of SSH and login again to load the new environment variables
```
node -v
```
Output should be the version and not a _command not found_ error

**5. Create Symlinks**\
```
sudo ln -s /mnt/data/node/node-<version>-<distro>/bin/node /usr/bin/node
sudo ln -s /mnt/data/node/node-<version>-<distro>/bin/npm /usr/bin/npm
sudo ln -s /mnt/data/node/node-<version>-<distro>/bin/npx /usr/bin/npx
```

**6. Install the Node MQTT module (replace `<version>` and `<distro>` to match the path of your node installation)**
```
cd /mnt/data/node/node-<version>-<distro>/lib
npm install mqtt --save
```
**7. Install MapLoader**\
Download the content of this GIT and copy _maploader.js_ and the _maps_ subfolder to _/mnt/data/maploader/_ on the robo.\
Edit _maploader.js_ and change the IP adress in line 3 to the IP of your MQTT Broker.
```
nano /mnt/data/maploader/maploader.js
```

## Manual Start for Testing
```
cd /mnt/data/maploader
node maploader.js
```
When you publish MQTT messages to the topics _rockrobo/map/save_ and _rockrobo/map/load_ on your broker,
you should see console messages about the copied files.

## Autostart
Install the Node module _Forever_ (replace `<version>` and `<distro>` to match the path of your node installation)** \
Forever monitors started node scripts and ensure that they are getting restarted, in case they exit in case of errors.
```
cd /mnt/data/node/node-<version>-<distro>/lib
npm install forever -g
```

Autostart the node script through forever at boot time:
```
crontab -e
```
Add the following line at the end of the file (replace `<version>` and `<distro>` to match the path of your node installation):
```
@reboot until [ -d /mnt/data/maploader ]; do sleep 1; done; /mnt/data/node/node-<version>-<distro>/bin/forever start /mnt/data/maploader/maploader.js
```
