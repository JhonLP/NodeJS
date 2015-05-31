var passport = require('passport'),
	TwitterStrategy = require('passport-twitter').Strategy;

var User = require('../models/user');

var twitterConnection = function (server) {

	passport.use(new TwitterStrategy({
		consumerKey: 'mEVqZK5M5vELB8jpZsgkoMVA6',
		consumerSecret: 'xan19paUkHFNW71Sw33GrqEMp5W42Jw7xfKGM2RKNQsmtYVGH2',
		callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
	}, function (token,tokenSecret, profile, done){

		var user = new User({
			username : profile.username,
			twitter : profile
		});

		user.save(function(err){
			if(err){
				done(err,null);
				return;
			}

		done(null, profile);

		})


	}));

	server.get('/auth/twitter', 
         passport.authenticate('twitter'),
         function(req, res) {}); 

	server.get('/auth/twitter/callback', 
         passport.authenticate('twitter', { 
                                successRedirect: '/app',
                                failureRedirect: '/' }),
         function(req, res) {}); 
};
module.exports = twitterConnection;
