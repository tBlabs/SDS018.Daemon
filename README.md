# AlfaBoard.Driver

## TODO

- make actuators values readable
- handling for query params (?foo=bar) // hidden in req.query

## API

| Operation                    | URL                           | Example request  | Example response   |
| ---------------------------- | ----------------------------- | ---------------- |------------------ |
| Get IO value by IO name      | /`ioName`                     | /door-sensor     | 1 |
| Set IO value by IO name      | /`ioName`/`value`             | /main-light/123  | *HTTP 202* |
| Get IO value by IO addr      | /get/`addr`                   | /get/4           | 12 |
| Set IO value by IO addr      | /set/`addr`/`value`           | /set/2/1         | *HTTP 202* |
| Board info                   | /boardInfo | /boardinfo | *HTTP 200* |
| IO config                    | /ioConfig | /ioconfig | *HTTP 200* |
| IO rename                    | /`ioName`/rename/`newName` | /adc1/rename/light-sensor | *HTTP 200* |
| Edit or Add IO event         | /`ioName`/`eventName`/`newName` | /adc1/onChange/{pwmUpdate} | *HTTP 200* |
| Read config variable              | /config/`varName`     |  |
| Add or update config variable     | /config/`varName`/`value`        | host/http://localhost:5000 | *HTTP 200*  |
| Remove config variable            | /config/`varName`/     |   |
| Use config variable               |                   | /door-sensor/onChange/{lightsDriver}/on  |   |

## Variables resolving order

User variables (from `user.config.json`) are resolved first. They may contain `{this.x}` placeholders.

## Config files

| File | Use | Structure |
| --- | --- | --- |
| `io.config.json` | IO Configuration | Json array |
| `user.config.json` | User variables | Key-value pairs as json object |
| `app.config.json` | Place for `httpPort`, `usbPort` etc | Key-value pairs as json object |

## IO Config

`io.config.json`

Single IO config example:
```
{
    "addr": 0,
    "name": "input1",
    "events": {
        "onChange": "http://localhost:3000/9/1",
        "onRising": "{action_defined_in_user.config.json}",
        "onFalling": "{host}/{this.name}/{this.event}/{this.value}",
        "onPress": "GET:{another_action}"
    }
}
```

By default every command is `HTTP GET` action. `GET:` prefix can be added to emphasize that.
There can be other prefixes used in future (like `BASH` etc).

| Prefix | Action |
| --- | --- |
| GET   | HTTP GET |
| *none*  | HTTP GET |

Available commands symbols:

| Symbol                    | Meaning                   |
| ------------------------- | ------------------------- |
| {this.value}              | Value of calling IO       |
| {this.previousValue}      | Old value                 |
| {this.name}               | IO name                   |
| {this.event}              | Event name                |
| {this.addr}               | Board Addr of IO          |
| {this.timestamp}          | Current value timestamp   |
| {this.previousTimestamp}  | Previous value timestamp  |

Example:
`"onFalling": "GET:{host}/{this.name}/{this.event}/{this.value}"`
will hit `http://myhost:1234/input1/onFalling/4` endpoint with GET HTTP method

BASH:{takePicture}|BASH:{sendPicture}


# Why this is builded this way
Such code construction has few advantages:
- driver can work on any platform supporting node.js (PC, Raspberry Pi etc)
- it's easy to test because board is a USB device (not builded in some platform)

## Deploy on Raspberry Pi Zero
- install `git`, `node.js v9+`, `npm`
- `git clone {this repo}`
- `npm i`
- configure `app.config.json`
- connect driver to USB
- add privileges for USB if required
- `npm run run`
