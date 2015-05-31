var User = require('../models/user'),
	Post = require('../models/post'),
	_ = require('underscore'),
	passport = require('passport');

var appController = function (server,users) {

	var isntLoggedIn = function (req,res,next) {
		if (!req.session.passport.user) {
			res.redirect('/');
			return;
		}
		next();
	};

	var getUser = function (req,res,next) {
		User.findOne({ username: req.session.passport.user.username }, function(err,user){
			req.user = user;
			next();
		});
	};

	server.get('/app', isntLoggedIn, function (req,res) {
		Post.find({})
		.populate('user')
		.exec(function(err, posts){
			
			var postsAsJson = _.map(posts,function(post){
				return post.toJSON();
			}); 

			res.render('app', {
				user : req.session.passport.user,
				users : users,
				posts : posts
			});
		});

	});

	server.post('/app/create-post', isntLoggedIn, getUser, function(req,res){

		var post = new Post({
			content : req.body.content,
			user : req.user
		});

		post.save(function(err){
			if(err){
				res.send(500, err);
			}

		server.io.broadcast('post', {
			content : post.content,
			user : req.user.toJSON()
		});

		res.redirect('/app');
		});

	});
};

module.exports= appController;