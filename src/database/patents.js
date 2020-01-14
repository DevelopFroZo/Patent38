"use strict";

const Foundation = require( "./helpers/foundation" );

module.exports = class extends Foundation{
  constructor( modules ){
    super( modules, "Patents" );
  }

  async check( serialNumber ){
    let data;

    data = ( await super.query(
      `select 1
      from patents
      where
        serial_number = $1`,
      [ serialNumber ]
    ) ).rowCount;

    if( data === 1 ) return true;

    return false;
  }

  async add( serialNumber, name, description ){
    try{
      await super.query(
        `insert into patents( serial_number, name, description )
        values( $1, $2, $3 )`,
        [ serialNumber, name, description ]
      );

      return super.success( 3 );
    }
    catch( error ){
      console.log( error );

      return super.error( 1 );
    }
  }

  async get( count ){
    try{
      const data = ( await super.query(
        `select *
        from patents
        ${count > -1 ? "limit " + count : ""}`
      ) ).rows;

      return super.success( 0, data );
    }
    catch( error ){
      console.log( error );

      return super.error( 1 );
    }
  }
}
