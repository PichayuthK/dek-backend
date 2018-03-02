var mongoose = require('mongoose');

var partnerSchema =  new mongoose.Schema({
    fromVendorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    toVendorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }, 
    fromRate:{
        type: Number
    },
    toRate:{
        type: Number
    },
    minimum:{
        type:Number
    },
    maximum:{
        type:Number
    }
    
});

var Partner = mongoose.model('Partner', partnerSchema);

module.exports = {Partner}