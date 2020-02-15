"use strict";

const Foundation = require( "./helpers/foundation" );

module.exports = class extends Foundation{
  constructor( modules ){
    super( modules, "Categories" );
  }

  async create( name ){
    const id = ( await super.query(
      `insert into categories( name )
      values( $1 )
      returning id`,
      [ name ]
    ) ).rows[0].id;

    return super.success( 0, id );
  }

  async get(){
    const rows = ( await super.query(
      `select *
      from categories
      order by id`
    ) ).rows;

    return super.success( 0, rows );
  }

  async update( id, name ){
    await super.query(
      `update categories
      set name = $1
      where id = $2`,
      [ name, id ]
    );

    return super.success();
  }

  async delete( id ){
    await super.query(
      `delete from categories
      where id = $1`,
      [ id ]
    );

    return super.success();
  }
}
