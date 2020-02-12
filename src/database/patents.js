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

  async add( serialNumber, ext, name, description, categoryId ){
    try{
      await super.query(
        `insert into patents( serial_number, ext, name, description, category_id )
        values( $1, $2, $3, $4, $5 )`,
        [ serialNumber, ext, name, description, categoryId ]
      );

      return super.success();
    }
    catch( error ){
      console.log( error );

      return super.error( 1 );
    }
  }

  async get( count, search, categoryIds ){
    try{
      const limit = count > -1 ? "limit " + count : "";
      let filters = [];
      let fc = 1;
      const params = [];

      if( search && search !== "" ){
        filters.push( `to_tsvector(
          serial_number || ' ' ||
          name || ' ' ||
          description
        ) @@ to_tsquery( $${fc++} )` );
        params.push( search );
      }

      if( categoryIds ){
        filters.push( `category_id = ANY( $${fc++}::int[] )` );
        params.push( categoryIds );
      }

      if( filters.length > 0 )
        filters = `where ${filters.join( " and " )}`;
      else
        filters = "";

      const data = ( await super.query(
        `select *
        from patents
        ${filters}
        order by date desc
        ${limit}`,
        params
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

  async edit( serialNumber, ext, name, description, categoryId ){
    try{
      await super.query(
        `update patents
        set
          name = $1,
          description = $2,
          category_id = $3
        where serial_number = $4`,
        [ name, description, categoryId, serialNumber ]
      );

      if( ext ) super.query(
        `update patents
        set
          ext = $1
        where serial_number = $2`,
        [ ext, serialNumber ]
      );

      return super.success();
    }
    catch( error ){
      console.log( error );

      return super.error( 1 );
    }
  }
}
