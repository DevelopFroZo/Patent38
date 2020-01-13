"use strict";

const crypto = require( "crypto" );

function generateSalt( length ){
  let salt;

  salt = "";

  for( let i = 0; i < length; i++ )
    if( ( Math.random() + 0.1 ) <= 0.5 ) salt += Math.floor( Math.random() * 10 );
    else salt += String.fromCharCode( 97 + Math.floor( Math.random() * 26 ) );

  return salt;
}

function saltNHash( password, options ){
  if( options === undefined ) throw "Options must be setted";

  if( options.salt === undefined ){
    if( options.saltLength === undefined ) throw "Salt length must be setted";

    options.salt = generateSalt( options.saltLength );
  }

  if( options.hashAlgorithm === undefined ) throw "Algorithm must be setted";

  const hash = crypto.createHash( options.hashAlgorithm ).update( `${password}${options.salt}` ).digest( "hex" );

  return {
    hash,
    salt: options.salt,
    hashAndSalt: `${hash};${options.salt}`
  };
}

module.exports = saltNHash;
