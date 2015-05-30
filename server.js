var express = require('express.io'),
	swig = require('swig'),
	_ = require('underscore');

var ex_session = require('express-session');

var RedisStore = require('connect-redis')(ex_session);	

var server = express();
server.http().io();

var users = [];

//configuracion para renderizar vistas
server.engine('html', swig.renderFile);
server.set('view engine', 'html');
server.set('views', './app/views');

//Cargar archivos staticos
server.use(express.static('./public'));

// Agregamos post. cookies y sessiones
server.configure(function () {
	server.use(express.logger());
	server.use(express.cookieParser());
	server.use(express.bodyParser());

	server.use(express.session({
		secret : "lolcatz",
		store : new RedisStore({})
		//store : new RedisStore({
		//	host : conf.redis.host,
		//	port : conf.redis.port,
		//	user : conf.redis.user,
		//	pass : conf.redis.pass
		//});

	}));

});

//Controllers
var homeController = require('./app/controllers/home');
var appController = require('./app/controllers/app');

homeController(server,users);
appController(server,users);


server.io.route('hello?', function (req) {
	req.io.emit('saludo',{ //se envia a un usuario
		message: 'serverReady'
	});
});

server.listen(3000);