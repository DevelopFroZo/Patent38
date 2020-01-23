const fs = require( "fs" );
const express = require( "express" );
const crypto = require( "crypto" );
const multer = require( "multer" );

const isLogged = require( "./helpers/isLogged" );

const router = express.Router();
const upload = multer();

// #fix add time
// #fix перенести проверку check в метод add
// #fix подставлять тип исходного файла
router.post(
  "/upload",
  isLogged( true ),
  upload.single( "image" ),
  async ( req, res, next ) => {
    const serialNumber = parseInt( req.body.serialNumber );
    let errorCode = false;

    if( req.file === undefined ) errorCode = 4;
    else if( isNaN( serialNumber ) || typeof serialNumber !== "number" ) errorCode = 5;

    if( !errorCode ) await req.database.patents.check( serialNumber ) ? errorCode = 6 : null;

    // #fix add check types of image & size

    if( errorCode ){
      res.error( errorCode );

      return;
    }

    // #fix promisify
    fs.writeFile( `static/assets/img/patents/${serialNumber}.jpg`, req.file.buffer, async err => {
      if( err ){
        res.error( 7 );

        return;
      }

      res.json( await req.database.patents.add( serialNumber, req.body.name, req.body.description ) );
    } );
  }
);

router.get( "/get", async ( req, res ) => {
  let count;

  if( req.query.count ) count = parseInt( req.query.count );

  if( isNaN( count) || typeof count !== "number" ) count = -1;

  res.json( await req.database.patents.get(
    count,
    req.query.search
  ) );
} );

// #fix добавить проверки
// #fix подставлять тип исходного файла
// #fix переделать удаление нескольких файлов
router.delete(
  "/delete",
  isLogged( true ),
  async ( req, res ) => {
    const response = await req.database.patents.delete( req.body.serialNumbers );
    let len = req.body.serialNumbers.length;

    if( !response.ok ){
      res.error( 8 );

      return;
    }

    req.body.serialNumbers.forEach( serialNumber => {
      fs.unlink( `static/assets/img/patents/${serialNumber}.jpg`, err => {
        len--;

        if( len === 0 ) res.success();
      } );
    } );
  }
);

// #fix подставлять тип исходного файла
router.put(
  "/put/:serialNumber",
  isLogged( true ),
  upload.single( "image" ),
  async ( req, res ) => {
    const serialNumber = parseInt( req.params.serialNumber );
    let errorCode = false;

    if( isNaN( serialNumber ) || typeof serialNumber !== "number" ) return res.error( 5 );
    if( !( await req.database.patents.check( serialNumber ) ) ) return res.error( 6 );

    // #fix add check types of image & size

    // #fix promisify
    if( req.file !== undefined )
      return fs.writeFile( `static/assets/img/patents/${serialNumber}.jpg`, req.file.buffer, async err => {
        if( err )
          return res.error( 7 );

        res.json( await req.database.patents.edit( serialNumber, req.body.name, req.body.description ) );
      } );

    res.json( await req.database.patents.edit( serialNumber, req.body.name, req.body.description ) );
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
