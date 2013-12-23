Service Monitor
===
A nodejs and socket.io based service monitor

## TODO:
+ Have each service determine an appropriate port on its own.
  This way it's not required to be hard coded.
  The other option I see is to define a range of ports and it will pick one
  The problem with this is when you want to monitor lots of services on one box

## BUGS?
+ If a service is started before the server, they will never connect.
  I don't know if this is actually the case or not.   
+ Can't monitor apache (aka httpd) not sure why... I'm looking into it
+ Although the server is polling the services every 10 seconds, the service is not actually doing an update. Tried to add an interval callback but it's not working... investigating.
