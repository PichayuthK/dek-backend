var mongoose = require('mongoose');

var companySchema = new mongoose.Schema({
    name:{
        type: String,
        trim:true
    },
    img:{
        type: String
    },
    royaltyProgram:{
        type:String,
        required:false
    },
    termAndCondition:{
        type: String,
        trim:true
    },
    id:{
        type: String
    }
});

var Company = mongoose.model('Company', companySchema);

module.exports = {Company};