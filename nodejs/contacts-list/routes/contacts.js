var url = require( 'url' );
var contacts = require( '../modules/contacts' );

exports.index = function(request, response) {
  var getParams = url.parse( request.url, true ).query;
  response.end( getFinalResponse( getParams ) );
};

exports.getByNumber = function(request, response) {
  response.end( JSON.stringify( contacts.query( request.params.number ) ) );
};

exports.groups = function(request, response) {
  response.end( JSON.stringify( contacts.listGroups() ) );
};

exports.getGroupByName = function(request, response) {
  response.end( JSON.stringify( contacts.getMembers( request.params.name ) ) );
};

function getFinalResponse( params ) {
  if( !Object.keys( params ).length )
    return JSON.stringify( contacts.list() );
  return JSON.stringify( contacts.queryByArg( Object.keys( params )[0], params[ Object.keys( params ) ] ) );
}
