var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://mongo/Dek');

module.exports = {
    mongoose
};