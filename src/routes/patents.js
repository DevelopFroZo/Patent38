const fs = require( "fs" );
const express = require( "express" );
const crypto = require( "crypto" );
const multer = require( "multer" );

const isLogged = require( "./helpers/isLogged" );

const router = express.Router();
const upload = multer();
const uploadSchema = upload.single( "image" );

router.post(
  "/upload",
  isLogged( true, "/login" ),
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

    fs.writeFile( `static/assets/img/patents/${serialNumber}.jpg`, req.file.buffer, async ( err ) => {
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

  res.json( await req.database.patents.get( count ) );
} );

module.exports = router;
