const express = require('express'),
      server = express(),
      bodyParser = require('body-parser'),
      router = require('./routes.js'),
      session = require("express-session"),
      passport = require("passport");

require('./local_strategy');
	  
server.set('port', process.env.PORT || 3000);

server.use(session({
  secret: "19js434f",
  cookie: {maxAge: 1000 * 60 * 60, sameSite: 'none'},
  saveUninitialized: false,
  resave: false,
}));

server.use(passport.initialize());

server.use(passport.session());

server.use(bodyParser.json());

server.use('/', router);

server.listen(3000,()=>{
 console.log('Express server started at port 3000');
});