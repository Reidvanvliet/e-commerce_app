const express = require('express'),
      server = express(),
      bodyParser = require('body-parser'),
      router = require('./routes.js')

require('./local_strategy');
	  
server.set('port', process.env.PORT || 3000);

server.use(bodyParser.json());

server.use('/', router);

server.listen(3000,()=>{
 console.log('Express server started at port 3000');
});