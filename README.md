# BluePill.Driver

This is a HTTP driven "driver" for serial connected (USB or UART) dedicated board called **BluePill** (firmware can be found [here](https://github.com/tBlabs/BluePill.Firmware)).

## How to run it?

Plug IO board, set it's port in `app.config.json` under `usb` section and run this program (`npm start`).  
Now you can play with board with simply calling REST API described below.

## API

| Operation                      | URL                             | Example request             | Example response   |
| ------------------------------ | ------------------------------- | --------------------------- | ------------------ |
| Get IO value by IO name        | /`ioName`                       | /door-sensor                | 1                  |
| Set IO value by IO name        | /`ioName`/`value`               | /main-light/123             | *HTTP 202*         |jjjjj
| Get IO value by IO addr        | /get/`addr`                     | /get/4                      | 12                 |
| Set IO value by IO addr        | /set/`addr`/`value`             | /set/2/1                    | *HTTP 202*         |
| IO rename                      | /`ioName`/rename/`newName`      | /adc1/rename/light-sensor   | *HTTP 200*         |
| Add or update IO event         | /`ioName`/`eventName`/`event`   | /adc1/onChange/{pwmUpdate}  | *HTTP 200*         |
| Delete IO event                | /`ioName`/`eventName`/          | /adc1/onChange/             | *HTTP 200*         |
| Board info                     | /boardInfo                      | /boardinfo                  | (...) *HTTP 200*   |
| IO config                      | /ioConfig                       | /ioconfig                   | (...) *HTTP 200*   |
| Add or update config variable  | /config/`varName`/`value`       | host/foo/bar                | foo=bar            |
| Read config variable           | /config/`varName`               | /config/foo                 | bar                |
| Remove config variable         | /config/`varName`/              | /config/foo/                | *HTTP 200*         |

### Variables resolving order

User variables (from `user.config.json`) are resolved first (two times). They may contain `{this.x}` placeholders and another variables.

# Config files

| File                | Used for                            | Structure                      |
| ------------------- | ----------------------------------- | ------------------------------ |
| `app.config.json`   | Place for `httpPort`, `usbPort` etc | Key-value pairs as json object |
| `io.config.json`    | IO Configuration                    | Json array                     |
| `user.config.json`  | User variables                      | Key-value pairs as json object |

## IO Config

`io.config.json`

Single IO config example:

```
{
    "name": "input1",   
    "events": {
        "onChange": "http://localhost:3000/9/1",
        "onRising": "{action_defined_in_user.config.json}",
        "onFalling": "{host}/{this.name}/{this.event}/{this.value}",
        "onPress": "GET:{another_action}"
    }
}
```
You can rename every IO directly via http by hitting `/{ioName}/rename/{newName}` endpoint.  
Event edit: `/{ioName}/{eventName}/http://1.2.3.4:1234/endpoint/{this.value}`.

By default every command is `HTTP GET` action. `GET:` prefix can be added to emphasize that.  

## Actions types

| Prefix  | Action                |
| ------- | --------------------- |
| GET     | HTTP GET              |
| *none*  | HTTP GET              |
| BASH    | Call script with bash |

## Events

| Name        | Activation                               |
| ----------- | ---------------------------------------- |
| onChange    | When value change                        |
| onRising    | When value will grow up                  |
| onFalling   | On value drop down                       |
| onPress     | Value drop and rise between 20 and 300ms |
| onLongPress | As onPress but between 300 and 2000ms    |
| onZero      | Called when value reach zero             |
| onNonZero   | Opposite of onZero                       |
| onDiff2     | When value will change by at least 2     |
| onDiff3     | When value will change by at least 3     |
| onDiff5     | When value will change by at least 5     |  

## Predefined commands symbols

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

## Events. How to call some action when sensor state change?

Look at the `io.config.json`. In that file we can define few types of events, like: OnChange, OnRising, OnPress etc.
Every command assigned to event should be a HTTP GET call. 
To make life easier we can define things called "variables" and use them in events commands. More in **IO Config** section.

## Deploy
- install `git`, `node.js 9+`, `npm`
- `git clone {this repo}`
- `npm i`
- configure `app.config.json`
- connect driver to USB
- add privileges for USB if required (`sudo usermod -a -G dialout $USER`)
- `npm start` or `npm run run` if rebuild is needed (but it's not because repo contains `js` files)

# Why this is builded this way
Such code construction has few advantages:
- driver can work on any platform supporting node.js (PC, Raspberry Pi etc)
- it's easy to test because board is a USB device (not builded in some platform)

## TODO/Possible improvements

- make actuators values readable (need changes in board firmware)
- handling for query params (?foo=bar) // hidden in req.query
- events disabling (needs changes in io.config structure + new endpoints)
- bash commands interpreter
- parallel commands
- default io.config generation
