"use strict";

// Libs
const express = require( "express" );
const helmet = require( "helmet" );
const bodyParser = require( "body-parser" );
const session = require( "express-session" );
const pgStoreConnect = require( "connect-pg-simple" );
const compression = require( "compression" );
const sirv = require( "sirv" );

// Configs
require( "./configs/env" );
const database = require( "./database" );

// Consts
const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

const routes = require( "./routes" );
const pgStore = pgStoreConnect( session );
const server = express();

// Settings
server.use(
  helmet(),
  bodyParser.json(),
  bodyParser.urlencoded( {
    extended: true
  } ),
  session( {
    cookie: {
      httpOnly: true,
      maxAge: !dev ? parseInt( process.env.SESSION_COOKIE_MAXAGE ) : null,
      secure: !dev
    },
    name: !dev ? process.env.SESSION_COOKIE_NAME : null,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    secret: !dev ? process.env.SESSION_COOKIE_SECRET : "secret",
    store: new pgStore( {
      pool: database.pool,
      tableName: process.env.SESSION_TABLE_NAME
    } )
  } ),
	compression( {
    threshold: 0
  } )
);

// Some upgrade
server.use( ( req, res, next ) => {
  req.database = database;
  res.success = ( code, data ) => res.json( database.success( code, data ) );
  res.error = code => res.json( database.error( code ) );

  if( !req.session.isLogged ) req.session.isLogged = false;

  next();
} );

// Add routes
routes( server );

// Run
server
  .use( sirv( "static", {
    dev
  } ) )
  .listen( PORT, err => {
  	if( err ) console.log( "error", err );
    else console.log( `Server runned on port ${PORT}` );
  } );
