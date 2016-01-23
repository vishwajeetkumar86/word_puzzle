
/**
 * Module dependencies.
 */
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var methodoverride = require('method-override');
var express = require('express')
	, routes = require('./routes')
	, mongoose = require('mongoose')
	, stylus = require('stylus')
	, nib = require('nib');

var app = module.exports = express();

// Mongo

var Schema = mongoose.Schema;

var BoardSchema = new Schema({
	type  : { type: Number },
	value : { type: String },
	x     : { type: Number },
	y     : { type: Number }
});

var db = mongoose.connect('mongodb://localhost/blackboard')
	, model = mongoose.model('Data', BoardSchema)
	, Data = mongoose.model('Data');

// Configuration

//app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(bodyParser());
	app.use(methodoverride());
	app.use(cookieParser());
	app.use(stylus.middleware({ 
		src: __dirname + '/stylus',
		dest: __dirname + '/public',
		compile: function (str, path) {
			return stylus(str)
				.set('filename', path)
				.set('compress', true)
				.use(nib())
				.import('nib');
			}
	}));	
	
	app.use(express.static(__dirname + '/public'));
//});

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
	app.use(errorHandler({ dumpExceptions: true, showStack: true })); 
}

var env = process.env.NODE_ENV || 'production';
if ('production' == env) {
	app.use(errorHandler()); 
}

// IO
var http = require('http');
var server = http.createServer(app);

var users = {};
var io = require('socket.io').listen(server);
//server.listen(80);
io.set('log level', 1);

io.sockets.on('connection', function (socket) {
	socket.on('adduser', function(user){
		if(users[user]==user)
			socket.emit('sign', {state: 0});
		else {
			socket.user = user;
			users[user] = user;
			socket.emit('sign', {state: 1});
			// Send objects to new client
			Data.find({}, function(err, docs) {
				if(err) { throw err; }
				socket.emit('objects', docs);
			});
			io.sockets.emit('update', users);
		}
	});

	socket.on('handle', function (data) {
		Data.findById(data.obj[0], function(err, p) {
			p.x=data.obj[1];
			p.y=data.obj[2];
			p.save();
		});
		socket.broadcast.emit('handle', data);
	});

	socket.on('disconnect', function(){
		//mongoose.disconnect();
		delete users[socket.user];
		io.sockets.emit('update', users);
	});

});

// Routes
app.get('/', routes.index);


server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
