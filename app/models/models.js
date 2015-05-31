var mongoose = require('mongoose');

mongoose.connect('mongodb://test:test@ds043012.mongolab.com:43012/test');



module.exports = mongoose;