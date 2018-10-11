# AlfaBoard.Daemon

## API

| Operation                 | URL                   | Example request  | Example response   |
| ------------------------- | --------------------- | ---------------- |------------------ |
| Set value by IO name      | `/{ioName}`                   | /door-sensor     | 1 |
| Set value by IO name      | `/{ioName}/{value}`           | /main-light/123  | *none* |
| Read value by addr        | `/get/{addr}`                 | /get/4           | 12 |
| Set value by addr         | `/set/{addr}/{value}`         | /set/2/1         | *none* |
| Set IO name  **[TODO]**             | `/{ioName}/name/{newName}`    |
| Set IO event **[TODO]**             | `/{ioName}/{eventName}/{action}`    | /light-sensor/onRising/GET:http://localhost:3001/set/4/4????
| Read IO info **[TODO]**             | `/{ioName}/info`              | /fan/info         | { "name": "fan", "value": 123, "minValue": 0, ... }
| All IO info **[TODO]**              | `/ioinfo`
| Reset config **[TODO]**


## IO Config

`io.config.json`

