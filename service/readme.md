Service Monitor - Service
===

== Config.json
>Configuration example
>{
>  "apache" : {
>    "webserverPort" : 3001, 
>    "serviceName"   : "apache",
>    "statusCommand" : "service apache status | grep Active",
>  }
>}
> 
>webserverPort: The port that the node monitor will listen on
>serviceName: User defined name of the service being watched
>statusCommand: The command line call to get the status of the service
>  On Fedora, adding "| grep Active" will only give state of the service
>    Leaving this off will include the whole service report


