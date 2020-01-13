module.exports = ( mustLoged, redirectUrl ) => {
  if( mustLoged === undefined ) mustLoged = true;

  return ( req, res, next ) => {
    if( req.session.isLogged === mustLoged ) next();
    else if( redirectUrl ) res.redirect( redirectUrl );
    else res.error();
  };
};
