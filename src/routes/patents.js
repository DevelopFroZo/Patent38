const express = require( "express" );
const crypto = require( "crypto" );
const multer = require( "multer" );

const isLogged = require( "./helpers/isLogged" );

const router = express.Router();
const uploadStorage = multer.diskStorage( {
  destination: ( req, file, cb ) => cb( null, "static/patents" ),
  // #fix
  filename: ( req, file, cb ) => cb( null, file.fieldname + "-" + Date.now() )
} );
const upload = multer( {
  storage: uploadStorage
} );
const uploadSchema = upload.single( "image" );

// #fix
router.post( "/upload", async ( req, res ) => {
  res.error();
} );

module.exports = router;
