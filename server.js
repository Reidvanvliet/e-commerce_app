const express = require('express'),
      server = express(),
	  fs = require('fs');
	  
server.set('port', process.env.PORT || 3000);

server.listen(3000,()=>{
 console.log('Express server started at port 3000');
});