# AlfaBoard.Daemon

This program sets up server (receiving commands)

./alfaboarddaemon --port <PORT> --socket <PORT> [--onChange <CMD>] [--info]

--onChange "./core --driver {driver} --port {port} --io-addr {addr} --io-value {value}"

config
{ 
    "input1": {
        "name": "door-sensor"
    }
}


## Internally

GET ip:port/:addr/:value
