const fs = require( "fs" );
const express = require( "express" );
const crypto = require( "crypto" );
const multer = require( "multer" );

const isLogged = require( "./helpers/isLogged" );

const router = express.Router();
const upload = multer();

function writeFile( path, data ){
  return new Promise( ( res, rej ) => {
    fs.writeFile( path, data, err => {
      if( err ) rej( err );
      else res();
    } );
  } );
}

function unlink( path ){
  return new Promise( ( res, rej ) => {
    fs.unlink( path, err => {
      if( err ) rej( err );
      else res();
    } );
  } );
}

// #fix перенести проверку check в метод add
router.post(
  "/upload",
  isLogged( true ),
  upload.single( "image" ),
  async ( req, res ) => {
    const serialNumber = parseInt( req.body.serialNumber );
    let errorCode = false;
    let categoryId = parseInt( req.body.categoryId );

    if( req.file === undefined ) errorCode = 4;
    else if( isNaN( serialNumber ) || typeof serialNumber !== "number" ) errorCode = 5;

    if( !errorCode ) await req.database.patents.check( serialNumber ) ? errorCode = 6 : null;

    // #fix add check types of image & size

    if( errorCode ){
      res.error( errorCode );

      return;
    }

    const ext = req.file.originalname.substring( req.file.originalname.lastIndexOf( "." ) + 1 );

    try{
      await writeFile( `static/assets/img/patents/${serialNumber}.${ext}`, req.file.buffer );
    }
    catch( err ){
      res.error( 7 );
    }

    if( !categoryId ) categoryId = null;

    res.json( await req.database.patents.add(
      serialNumber,
      ext,
      req.body.name,
      req.body.description,
      categoryId
    ) );
  }
);

router.get( "/", async ( req, res ) => {
  let count;
  let offset;
  let categoryIds;

  if( req.query.count ) count = parseInt( req.query.count );
  if( req.query.offset ) offset = parseInt( req.query.offset );

  if( isNaN( count ) || typeof count !== "number" ) count = -1;
  if( isNaN( offset ) || typeof offset !== "number" ) offset = 0;

  if( req.query.categoryIds ) categoryIds = req.query.categoryIds.split( "," );
  else categoryIds = null;

  // #fix переделать req.query
  let data = ( await req.database.patents.get(
    count,
    offset,
    req.query.search,
    categoryIds
  ) ).data;
  let allCount = 0;

  if( data.length > 0 ){
    allCount = data[0].count;

    data.forEach( item => {
      delete item.count;
    } );
  }

  res.success( 0, {
    patents: data,
    count: allCount
  } );
} );

// #fix добавить проверки
router.delete(
  "/",
  isLogged( true ),
  async ( req, res ) => {
    const response = await req.database.patents.delete( req.body.serialNumber );

    if( !response.ok )
      return res.error( 8 );

    try{
      await unlink( `static/assets/img/patents/${req.body.serialNumber}.${response.data}` );

      res.success();
    }
    catch( error ){
      res.error( 7 );
    }
  }
);

router.put(
  "/:serialNumber",
  isLogged( true ),
  upload.single( "image" ),
  async ( req, res ) => {
    const serialNumber = parseInt( req.params.serialNumber );
    let errorCode = false;
    let ext;
    let categoryId = parseInt( req.body.categoryId );

    if( isNaN( serialNumber ) || typeof serialNumber !== "number" ) return res.error( 5 );
    if( !( await req.database.patents.check( serialNumber ) ) ) return res.error( 6 );

    // #fix add check types of image & size

    if( req.file !== undefined ){
      ext = req.file.originalname.substring( req.file.originalname.lastIndexOf( "." ) + 1 );

      try{
        await writeFile( `static/assets/img/patents/${serialNumber}.${ext}`, req.file.buffer );
      }
      catch( err ){
        return res.error( 7 );
      }
    }

    if( !categoryId ) categoryId = null;

    res.json( await req.database.patents.edit(
      serialNumber,
      ext,
      req.body.name,
      req.body.description,
      categoryId
    ) );
  }
);

// #fix проверить на пустые поля
// #fix ограничить по времени
router.post( "/buy/:serialNumber", ( req, res ) => {
  req.mail.send( "", "Покупка патента", `
    Запрос на покупку патента ${req.params.serialNumber}
    Контакты:
    - Имя: ${req.body.name}
    - email: ${req.body.email}
    - телефон: ${req.body.phone}
  ` );
  res.success();
} );

module.exports = router;
