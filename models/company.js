var mongoose = require('mongoose');

var Company = mongoose.model('Company', {
    name:{
        type: String,
        trim:true
    },
    img:{
        type: String
    },
    termAndCondition:{
        type: String,
        trim:true
    },
    id:{
        type: String
    }
});

module.exports = {Company};