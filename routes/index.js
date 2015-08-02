exports.index = function( request, response, next ){
  response.setHeader( 'content-type', 'application/json' );
  next();
};
