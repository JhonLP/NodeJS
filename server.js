var express = require('express.io'),
	swig = require('swig'),
	_ = require('underscore'),
	passport = require('passport');

var ex_session = require('express-session');

//var RedisStore = require('connect-redis')(ex_session);	

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
		cookie : { maxAge : 1200000}
	}));

	server.use(passport.initialize());
	server.use(passport.session()); // corre arriba de session
	// por lo que debe declararse despues de express.session

});

passport.serializeUser(function(user,done){
	done(null,user);
});

passport.deserializeUser(function(obj,done){
	done(null,obj);
});


//Controllers
var homeController = require('./app/controllers/home');
var appController = require('./app/controllers/app');

homeController(server,users);
appController(server,users);

//Conexiones
var twitterConnection = require('./app/connections/twitter');
twitterConnection(server);


server.io.route('hello?', function (req) {
	req.io.emit('saludo',{ //se envia a un usuario
		message: 'serverReady'
	});
});

var port_number = process.env.PORT || 3000;
server.listen(port_number);