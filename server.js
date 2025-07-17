const express = require('express'),
      server = express(),
      bodyParser = require('body-parser'),
      session = require("express-session"),
      passport = require("passport");

//Routers
const itemsRouter = require('./routes/itemsRoutes.js'),
      accountRouter = require('./routes/accountRouter.js'),
      cartRouter = require('./routes/cartRouter.js'),
      ordersRouter = require('./routes/ordersRouter.js');

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

//Routers

server.use('/', accountRouter);
server.use('/items', itemsRouter);
server.use('/cart', cartRouter);
server.use('/orders', ordersRouter);

server.listen(3000,()=>{
 console.log('Express server started at port 3000');
});