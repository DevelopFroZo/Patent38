"use strict";

const isLogged = require( "./helpers/isLogged" );

const auth = require( "./auth" );
const patents = require( "./patents" );
const categories = require( "./categories" );

module.exports = server => {
  server.get( "/assets/img/patents/*", ( req, res ) => {
    res.sendFile( req.path, {
      root: "./static"
    } );
  } );

  server.get( "/login", isLogged( false, "/" ) );
  server.get( "/logout", ( req, res ) => {
    if( req.session.isLogged ) req.session.isLogged = false;

    res.redirect( "/" );
  } );
  server.get( "/upload", isLogged( true, "/login" ) );

  server.use( "/api/auth", auth );
  server.use( "/api/patents", patents );
  server.use( "/api/categories", categories );
};
