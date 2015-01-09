q3rcon-bridge
=============

Simple rcon-based bridge/proxy that enables adminisistration for q3 rcon-enabled servers without exposing master password


### How to run:
Install via `npm install q3rcon-bridge -g`.
Then run using the command `q3rconbridge` and specify a configuration file in the command line.


Example:
`q3rconbridge ./sample_config.json`


#### Configuration file
```
{
  "listenHost": "127.0.0.1", // host that the bridge should listen on
  "listenPort": 28962, // port that the bridge should listen on

  "proxyHost": "127.0.0.1", // host that the bridge should proxy requests TO (gameserver's net_ip)
	"proxyPort": 28960, // port that the bridge should proxy requests TO (gameserver's net_port)
	"bindHost": "127.0.0.1", // ip to bind proxy users to, leave 127.0.0.1 if server is on the same computer
	"serverPassword": "pass", // rcon password for the q3-based server (gameserver's rcon_password)

  "authLib": "simple", // type of authentication, only "simple" works for now
  "authSettings": "./bin/auth.txt" // settings for authentication. specific requirements per library ("simple" wants a path to the user file)
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
