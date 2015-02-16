q3rcon-bridge
=============

Simple rcon-based bridge/proxy that enables adminisistration for q3 rcon-enabled servers without exposing master password


### How to run:
Install via `npm install q3rcon-bridge -g`.
Then run using the command `q3rconbridge` and specify a configuration file in the command line.


Example:
`q3rconbridge ./sample_config.json`


#### Sample Configuration file
```
{
  "listenHost": "127.0.0.1",
  "listenPort": 28962,
  "bindHost": "127.0.0.1",
  "servers": {
    "srv1": {
      "host": "127.0.0.1",
      "port": 28960,
      "password": "pass"
    }
  },

  "authLib": "mysql",
  "authSettings": {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "q3rcon-bridge"
  }
}
```




### Authentication modules

##### simple
Simple file-based authentication.
Create a file with user:password pairs, one per each line
```
user:password
admin:pass
test:test
```
Then in `authSettings`, link to the file.


##### echelon

*Not tested, probably doesn't work*
