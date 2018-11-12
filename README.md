#TODO
- extend Args class (add Port and USB option)
- add operation timeouts (config set etc)

# BluePill.Daemon

Driver and REST&Socket host for "BluePill"

### Client --> Host

| Event     | Args          | Response                           |
| --------- | ------------- | ---------------------------------- |
| `set`     | addr, value   | `update` to all connected clients  |
| `get`     | addr          | `update` only for sender           |

### Host --> Client

| Event     | Args          |
| --------- | ------------- |
| `update`  |  addr, value  |




This is a HTTP driven "driver" for serial connected (USB or UART) dedicated board called **BluePill** (firmware can be found [here](https://github.com/tBlabs/BluePill.Firmware)).

