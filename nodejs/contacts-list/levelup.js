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

app.post('/contacts/:number', function(request, response) {
  console.log( 'Adding new contact with primary number', request.params.number );
  console.log('body', request.body);
  db.put(request.params.number, request.body, function(error) {
    if(error) {
      response.writeHead(500, {
        'Content-Type': 'text-plain'
      });
      response.end('Internal Server Error');
      return;
    }
    response.send(request.params.number + ' succesfully inserted');
  });
});

app.del('/contacts/:number', function(request, response) {
  console.log( 'Deleting contact with primary number', request.params.name );
  db.del(request.params.number, function(error) {
    if(error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      response.end('Internal Server Error');
      return;
    }
    response.send(request.params.number + ' succesfully deleted');
  });
});

app.get('/contacts', function(request, response) {
  console.log('Listing all contacts');
  var isFirst = true;
  response.setHeader('content-type', 'application/json');
  db.createReadStream()
  .on('data', function(data) {
    console.log('Readable stream', data.value);
    if(isFirst) response.write('[');
    else response.write(',');
    response.write(JSON.stringify(data.value));
    isFirst = false;
  })
  .on('error', function(error) {
    console.log('Error while reading', error);
  })
  .on('close', function() {
    console.log('Closing db stream');
  })
  .on('end', function() {
    console.log('Db stream closed');
    response.end(']');
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
