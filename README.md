#TODO
- add operation timeouts (config set etc)
- remove `fluent parser`, import it's package instead 

# BluePill.Daemon

(Serial/USB) Driver and HTTP host (REST+Socket) for "BluePill" development board.  
Cooperates with [this firmware](https://github.com/tBlabs/BluePill.Firmware)).

## Install 

- `cd {dir}`
- `npm i`
- `sudo chmod +x run.sh`

## Start (production mode)

- `cd {dir}`
- modify `run.sh` (set `port`, `serial` and `log`)
- `./run`

`[]` - optional stuff

| Param     | Usage                                           | Default value    |
| --------- | ----------------------------------------------- | ---------------- |
| port      | HTTP port for REST calls and socket connections | 3000             |
| serial    | USB or UART "BluePill" is connected to          | From `.env` file |
| log       | Let it talk                                     | Off              |

## Development

`npm run serve`  
You can change startup params in `autorun` script (in `package.json` > `scripts` section). Remember to always restart `serve` tool after any changes in `package.json`.

## Stop

`Ctrl+C`

# Client API

## HTTP

| Action       | Method  | Url             | Example request | Example response | Side effects                          |
| ------------ | ------- | --------------- | --------------- | ---------------- | ------------------------------------- |
| Get IO value | GET     | /`addr`         | /4              | 123              | *none*                                |
| Set IO value | GET     | /`addr`/`value` | /4/123          | *HTTP 200 OK*    | Sends `update` to every socket client |

## SOCKET

### Client --> Host

| Action       | Event  | Args                    | Example                      | Side effects               |
| ------------ | ------ | ----------------------- | ---------------------------- | -------------------------- |
| Get IO value | `get`  | addr (address of IO)    | socket.emit('get', 4)        | *none*                     |
| Set IO value | `set`  | addr, value (new value) | socket.emit('set', 4, 123)   | `update` to every client   |

### Host --> Client

| Event           | Args          |
| --------------- | ------------- |
| `update`        |  addr, value  |
| `driver-error`  |  addr, value  |

# Signals

## SIGINT

When user press Ctrl+C in console....

# Testing on PC

- Connect "BluePill" board via USB
- Run `run.sh` script (check it's args first)
- Open browser and hit `http://localhost:3000/12/0` to turn build in led on. Hit `http://localhost:3000/12/1` to turn it off.  
At `http://localhost:3000/11` RTC value can be found. Refresh page few times to see if it's growing.