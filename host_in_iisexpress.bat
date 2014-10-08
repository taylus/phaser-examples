:: this file will launch an instance of IIS Express with this file's current directory as the web root
:: by default iisexpress will bind to port 8080
:: if you wish to run multiple instances, use /port:xyz to specify separate ports

iisexpress /path:"%CD%"
pause