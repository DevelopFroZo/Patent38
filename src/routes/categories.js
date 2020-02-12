const express = require( "express" );

const isLogged = require( "./helpers/isLogged" );

const router = express.Router();

router.post( "/", isLogged( true ), async ( req, res ) => {
  res.json( await req.database.categories.create( req.body.name ) );
} );

router.get( "/", async ( req, res ) => {
  res.json( await req.database.categories.get() );
} );

router.put( "/:id", isLogged( true ), async ( req, res ) => {
  res.json( await req.database.categories.update(
    req.params.id,
    req.body.name
  ) );
} );

router.delete( "/:id", isLogged( true ), async ( req, res ) => {
  res.json( await req.database.categories.delete( req.params.id ) );
} );

module.exports = router;
