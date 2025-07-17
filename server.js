const express = require('express'),
      server = express(),
      bodyParser = require('body-parser'),
      session = require("express-session"),
      passport = require("passport"),
      swaggerJSDoc = require('swagger-jsdoc'),
      swaggerUi = require('swagger-ui-express');

//Routers
const itemsRouter = require('./routes/itemsRoutes.js'),
      accountRouter = require('./routes/accountRouter.js'),
      cartRouter = require('./routes/cartRouter.js'),
      ordersRouter = require('./routes/ordersRouter.js');

const swaggerDefinition = {
  info: {
    title: 'E-commerce API',
    version: '1.0.0',
    description: 'An API for an E-commerce store practicing in the Codecademy Full-Stack Career Path',
  },
  host: 'localhost:3000',
  basePath: '/',
};

const options = {
  swaggerDefinition: swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

require('./local_strategy');
	  
server.set('port', process.env.PORT || 3000);

server.use(session({
  secret: "19js434f",
  cookie: {maxAge: 1000 * 60 * 60, sameSite: 'none'},
  saveUninitialized: false,
  resave: false,
}));

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.use(passport.initialize());

server.use(passport.session());

server.use(bodyParser.json());

//Swagger documentation route

server.get('/docs.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

//Routers

server.use('/', accountRouter);
server.use('/items', itemsRouter);
server.use('/cart', cartRouter);
server.use('/orders', ordersRouter);

server.listen(3000,()=>{
 console.log('Express server started at port 3000');
});