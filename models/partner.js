var mongoose = require('mongoose');

var Partner = mongoose.model('Partner', {
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
    }
    
});



module.exports = {Partner}