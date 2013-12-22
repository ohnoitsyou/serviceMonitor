Service Monitor
===

## TODO:
+ Have each service determine an appropriate port on its own.
  This way it's not required to be hard coded.
  The other option I see is to define a range of ports and it will pick one
  The problem with this is when you want to monitor lots of services on one box

## BUGS?
+ If a service is started before the server, they will never connect.
  I don't know if this is actually the case or not.   

