var models = require('./models'),
	Schema = models.Schema;

var userSchema = Schema({
	username : 'string',
	twitter : Schema.Types.Mixed
});

var User = models.model('user', userSchema); //le decimos que la tabla usuario tiene cierto Schema

module.exports = User;