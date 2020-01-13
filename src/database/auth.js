"use strict";

const Foundation = require( "./helpers/foundation" );
const saltNHash = require(  "./helpers/saltNHash" );

module.exports = class extends Foundation{
  constructor( modules ){
    super( modules, "Auth" );
  }

  async signin( login, password ){
    try{
      let data;

      data = await super.query(
        `select password
        from users
        where
          login = lower( $1 )`,
        [ login ]
      );

      if( data.rowCount === 0 ) return super.error( 2 );

      const password_ = data.rows[0].password.split( ";" );
      const { hash } = saltNHash( password, {
        salt: password_[1],
        hashAlgorithm: process.env.HASH_ALGORITHM
      } );

      if( password_[0] === hash ) return super.success( 1 );

      return super.error( 3 );
    }
    catch( error ){
      console.log( error );

      return super.error( 1 );
    }
  }
}
