"use strict";

const pg = require( "pg" );
const config = require( "../configs/database" );
const codes = require( "./codes" );

const Auth = require( "./auth" );
const Patents = require( "./patents" );
const Categories = require( "./categories" );

const dev = process.env.NODE_ENV === "development";
const modules = {};

// Main pool
modules.pool = new pg.Pool( !dev ? config.production : config.development );

// Controllers
modules.auth = new Auth( modules );
modules.patents = new Patents( modules );
modules.categories = new Categories( modules );

// Success & error functions
modules.success = ( code, data ) => {
  if( data === undefined ) data = null;
  if( code === undefined ) code = 0;

  return {
    ok : true,
    code,
    message : codes.successes[ code ],
    data
  };
};
modules.error = code => {
  if( code === undefined ) code = 0;

  return {
    ok : false,
    code,
    message : codes.errors[ code ]
  };
};

module.exports = modules;
