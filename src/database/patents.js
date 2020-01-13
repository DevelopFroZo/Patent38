"use strict";

const Foundation = require( "./helpers/foundation" );

module.exports = class extends Foundation{
  constructor( modules ){
    super( modules, "Patents" );
  }

  async checkPatent( serialNumber ){
    let data;

    data = ( await super.query(
      `select 1
      from patents
      where
        id = $1`,
      [ serialNumber ]
    ) ).rowCount;

    if( data === 1 ) return super.error( 4 );

    return super.success( 2 );
  }
}
