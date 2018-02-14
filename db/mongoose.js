var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.bdName = 'mongodb://localhost:27017/Dek';
mongoose.connect('mongodb://localhost:27017/Dek');

module.exports = {
    mongoose
};