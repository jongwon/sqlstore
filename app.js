
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.user.list);
app.get('/user/list', routes.user.list);
app.get('/user/listAll.json', routes.user.listAllJson);
app.get('/user/create', routes.user.create);
app.get('/user/update', routes.user.update);
app.get('/user/update.json', routes.user.updateJson);
app.get('/user/remove', routes.user.remove);
app.get('/user/input', routes.user.input);
app.get('/user/list.json', routes.user.listJson);



app.listen(3008, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
