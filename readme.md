Service Monitor
===
A nodejs and socket.io based service monitor

Run npm install in both the server and service directory to install all the node modules.

Run the server:
>  node server/app.js
  
Run the service (after creating a profile):
>  node service/app.js &lt;service name&gt;
  
Read service/readme.md to see the config.json options

## TODO:
+ Have each service determine an appropriate port on its own.
  This way it's not required to be hard coded.
  The other option I see is to define a range of ports and it will pick one
  The problem with this is when you want to monitor lots of services on one box
+ Add flexible containers to output

## BUGS?
+ If a service is started before the server, they will never connect.
  I don't know if this is actually the case or not or if it is just a timing issue.
