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

  // #fix add time
  async add( serialNumber, name, description ){
    try{
      await super.query(
        `insert into patents( serial_number, name, description )
        values( $1, $2, $3 )`,
        [ serialNumber, name, description ]
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

  async delete( serialNumbers ){
    try{
      await super.query(
        `delete from patents
        where serial_number = ANY( $1::int[] )`,
        [ serialNumbers ]
      );

      return super.success();
    }
    catch( error ){
      console.log( error );

      return super.error( 1 );
    }
  }

  // #fix обновлять не всё, а только по требованию
  async edit( serialNumber, name, description ){
    try{
      await super.query(
        `update patents
        set name = $1, description = $2
        where serial_number = $3`
      );

      return super.success();
    }
    catch( error ){
      console.log( error );

      return super.error( 1 );
    }
  }
}
