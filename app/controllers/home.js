var _ = require('underscore');

var homeController = function (server, users) {
	console.log('esta corriendo');

	var isLoggedIn = function (req,res,next) {
		if (req.session.passport.user) {
			res.redirect('/app');
			return;
		}
		next();
	};

	server.get('/', isLoggedIn, function (req,res) {
		res.render('Home');
	});

	server.post('/log-in', function (req,res) {
		users.push(req.body.username);
	    
	    req.session.user = req.body.username;
		server.io.broadcast('log-in', {username : req.session.user}); //notifica a todos en el server

		res.redirect('/app');
	});

	server.get('/log-out', function (req,res) {
		users = _.without(users, req.session.user);

		server.io.broadcast('log-out', {username : req.session.user}); //notifica a todos en el server

		req.session.destroy();
		res.redirect('/');
	});
};

module.exports = homeController;