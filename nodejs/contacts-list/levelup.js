var express = require('express');
var routes = require('./routes');
var contactsRouter = require( './routes/contacts' );
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var loger = require('morgan');
var levelup = require( 'levelup' );
var url = require('url');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(bodyParser.json());
app.use(app.router);

if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

var db = levelup('./contact', { valueEncoding: 'json' });
db.put( '+359777123456', {
  "firstname": "Joe",
  "lastname": "Smith",
  "title": "Mr.",
  "company": "Dev Inc.",
  "jobtitle": "Developer",
  "primarycontactnumber": "+359777123456",
  "othercontactnumbers": [
  "+359777456789",
  "+359777112233"],
  "primaryemailaddress": "joe.smith@xyz.com",
  "emailaddresses": [
  "j.smith@xyz.com"],
  "groups": ["Dev","Family"]
  }
);

app.get('/contacts/:number', function(request, response) {
  console.log(request.url + ' : querying for ' + request.params.number);
  db.get(request.params.number, function(error, data) {
    if( error ) {
      response.writeHead( 404, {
        'content-type' : 'text/plain'
      });
      response.end( 'Not found' );
      return;
    }
    response.setHeader('content-type', 'application/json');
    response.send(data);
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
