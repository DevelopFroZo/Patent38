"use strict";

module.exports = class{
  constructor( modules, className ){
    this.modules = modules;
    this.className = className;
  }

  async query( sql, data ){
    // #fix
    const method = ".";

    try{
      const queryData = await this.modules.pool.query( sql, data );

      return queryData;
    }
    catch( error ){
      error.trace = `${this.className}/${method}`;
      error.context = "Query error";

      throw error;
    }
  }

  // transaction( path ){
  //   return new Transaction( this.modules.db, `${this.path}.${path}` );
  // }

  success( code, data ){
    return this.modules.success( code, data );
  }

  error( code ){
    return this.modules.error( code );
  }
}
