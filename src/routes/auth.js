const express = require( "express" );
const isLogged = require( "./helpers/isLogged" );

const router = express.Router();

router.post( "/signin", isLogged( false ), async ( req, res ) => {
  const result = await req.database.auth.signin(
    req.body.login,
    req.body.password
  );

  if( result.ok ){
    req.session.isLogged = true;
    res.redirect( "/" );
  }
  else res.json( result );
} );

router.get( "/isLogged", ( req, res ) => {
  res.success( 0, req.session.isLogged );
} );

module.exports = router;
