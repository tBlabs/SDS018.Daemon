#TODO
- extend Args class (add Port and USB option)
- add operation timeouts (config set etc)

# BluePill.Daemon

(Serial/USB) Driver and HTTP host (REST+Socket) for "BluePill" development board.  
Cooperates with [this firmware](https://github.com/tBlabs/BluePill.Firmware)).

## Install 

`cd {dir}`
`npm i`
`sudo chmod +x run.sh`

## Start

`cd {dir}`
`./run [--port 3000 --serial /dev/ttyUSB0 --verbose]`

`[]` - optional stuff

| Param     | Usage     | Default  |
| --------- | ----------------------------------------------- | ------------- |
| port      | HTTP port for REST calls and socket connections | 3000               |
| serial    | USB or UART "BluePill" is connected to          | *goto ENV section* |
| verbose   | TODO  |

## Stop

## Client --> Host

| Action       | Method    | Event     | Args                   | Example |                           |
| ------------ | --------- | --------- | ---------------------- | ------- | ------ |
| Get IO value | HTTP GET  | /`addr`   | addr = address of IO   | /4      | `update` to all connected clients  |
|              | SOCKET    | `get`     | addr                   | socket.emit('get', 4) | `update` to all connected clients  |
| Set IO value | HTTP GET  |`get`     | addr          | `update` only for sender           |

Where:  
`addr` - address of IO (full list of address can be found in `Addr.ts` file)  
`value` - value of/for IO

## Host --> Client

| Event     | Args          |
| --------- | ------------- |
| `update`  |  addr, value  |
| `driver-error`  |  addr, value  |

# Development

## .env what for?

It's easier to use just `npm run serve` during development without care of `serial` and `port`.

## When board is directly connected to PC via USB

Find out at which port you had connected (probably one of `/dev/ttyUSB?`).  
Start app with param `--serial /dev/ttyUSBx` where `x` is a port number.  
Default value of `serial` is `/dev/ttyUSB0` when `TARGET` is set to `PC` in `.env` file.



