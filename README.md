## TODO
- add operation timeouts (config set etc)
- remove `fluent parser`. import that package instead 

# SDS010.Daemon (PM10 and PM25 air pollution sensor)

(Serial/USB) Driver and HTTP host (REST+Socket) for **SDS018 air pollution sensor**.  

## Install 

- `cd {dir}`
- `npm i`
- `sudo chmod +x run.sh`

## Start (production mode)

- `cd {dir}`
- modify `run.sh` (set `port`, `serial` and `log`)
- `./run.sh`

| Param     | Usage                                           |
| --------- | ----------------------------------------------- |
| port      | HTTP port for REST calls and socket connections |
| serial    | USB or UART "BluePill" is connected to          |
| log       | Let it talk                                     |

## Development

`npm run serve`  
You can change startup params in `autorun` script (in `package.json` > `scripts` section). 
Remember to always restart `serve` tool after any changes in `package.json`.

## Stop

`Ctrl+C`, `Ctrl+Z` sometimes

# Client API

There are two options to "talk" to sensor: via HTTP (REST API) or TCP (Socket).

## HTTP

| Action            | Method  | Request url     | Example response | Side effects    |
| ----------------- | ------- | --------------- | ---------------- | --------------- |
| Get PM10 value    | GET     | /pm10           | 123              | *none*          |
| Get PM25 value    | GET     | /pm25           | 123              | *none*          |
| Connection test   | GET     | /ping           | pong             | *none*          |

## SOCKET

### Client --> Host

| Action       | Event  | Args      | Example               | Side effects     |
| ------------ | ------ | --------- | --------------------- | -----------------|
| Get values   | `get`  | *none*    | socket.emit('get')    | *none*           |

### Host --> Client

| Event           | Args          |
| --------------- | ------------- |
| `update`        | pm10, pm25    |

`update` is send to every connected client at every sensor update (every one second).

# Signals  
  
## SIGINT  
  
Press `Ctrl+C` to kill server and driver.

# Testing on PC

- Connect sensor to USB (via FTDI converter or something)
- Run `run.sh` script (check it's args first)
- Open browser and hit `http://localhost:3000/pm10`. You should see value of pm10 particles in the air.

# Troubleshuting

In case of `npm i` problems on Windows:  
https://github.com/nodejs/node-gyp
`npm config set msvs_version 2012 --global`  
`npm install --global --production windows-build-tools` (in Powershell as Admin)  
