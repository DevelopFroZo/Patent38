"use strict";

// Libs
const express = require( "express" );
const helmet = require( "helmet" );
const bodyParser = require( "body-parser" );
const session = require( "express-session" );
const pgStoreConnect = require( "connect-pg-simple" );
const compression = require( "compression" );
const sirv = require( "sirv" );
const nodemailer = require( "nodemailer" );

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
      secure: !dev && process.env.SESSION_COOKIE_SECURE === "true"
    },
    name: !dev ? process.env.SESSION_NAME : null,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    secret: !dev ? process.env.SESSION_SECRET : "secret",
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

  // #fix вынести в helper
  if( dev ){
    req.mail = nodemailer.createTransport( {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE,
      auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS
      }
    } );
    req.mail.send = ( to, subject, text, html ) => req.mail.sendMail( {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html
    } );
  }

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
