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

  async add( serialNumber, ext, name, description ){
    try{
      await super.query(
        `insert into patents( serial_number, ext, name, description )
        values( $1, $2, $3, $4 )`,
        [ serialNumber, ext, name, description ]
      );

      return super.success();
    }
    catch( error ){
      console.log( error );

      return super.error( 1 );
    }
  }

  async get( count, search ){
    try{
      const limit = count > -1 ? "limit " + count : "";
      let fulltextSearch;

      if( search && search !== "" )
        fulltextSearch = `where to_tsvector(
          serial_number || ' ' ||
          name || ' ' ||
          description
        ) @@ to_tsquery( '${search}' )`;

      const data = ( await super.query(
        `select *
        from patents
        ${fulltextSearch}
        order by date desc
        ${limit}`
      ) ).rows;

      return super.success( 0, data );
    }
    catch( error ){
      console.log( error );

      return super.error( 1 );
    }
  }

  async delete( serialNumber ){
    try{
      const row = ( await super.query(
        `delete from patents
        where serial_number = $1
        returning ext`,
        [ serialNumber ]
      ) ).rows[0];

      if( row === undefined )
        return super.error();

      return super.success( 0, row.ext );
    }
    catch( error ){
      console.log( error );

      return super.error( 1 );
    }
  }

  async edit( serialNumber, ext, name, description ){
    try{
      await super.query(
        `update patents
        set name = $1, ext = $2, description = $3
        where serial_number = $4`,
        [ name, ext, description, serialNumber ]
      );

      return super.success();
    }
    catch( error ){
      console.log( error );

      return super.error( 1 );
    }
  }
}
