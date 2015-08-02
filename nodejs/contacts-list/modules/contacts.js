var fs = require( 'fs' );

exports.list = function() {
  return JSON.parse( readJsonFile() );
};

exports.query = function( number ) {
  var jsonResult = JSON.parse( readJsonFile() );
  return jsonResult.filter(function( contact ) {
    return contact.primarycontactnumber === number;
  }) || null;
};

exports.queryByArg = function( arg, value ) {
  var jsonResult = JSON.parse( readJsonFile() );
  return jsonResult.filter(function( contact ) {
    return contact[ arg ] === value;
  }) || null;
};

exports.listGroups = function() {
  var jsonResult = JSON.parse( readJsonFile() );
  var arrResult = [];
  jsonResult.forEach(function( item ) {
    arrResult = item.groups.map(function( newItem ) {
      return newItem;
    });
  });
  return arrResult;
};

exports.getMembers = function( groupName ) {
  var jsonResult = JSON.parse( readJsonFile() );
  console.log(jsonResult, groupName);
  var resultArray = [];
  return jsonResult.filter(function( item ) {
    return item.groups.map(function( group ) {
      return group.toLowerCase();
    }).indexOf( groupName.toLowerCase() ) > -1;
  });
}

function readJsonFile() {
  var file = './data/contacts.json';
  return fs.readFileSync( file );
}
