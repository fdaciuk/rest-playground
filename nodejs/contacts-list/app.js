var express = require('express');
var routes = require('./routes');
var contactsRouter = require( './routes/contacts' );
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.use( require('cors')() );
app.use(routes.index);
app.get('/contacts', contactsRouter.index);
app.get('/contacts/groups', contactsRouter.groups);
app.get('/contacts/groups/:name', contactsRouter.getGroupByName);
app.get('/contacts/:number', contactsRouter.getByNumber);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
