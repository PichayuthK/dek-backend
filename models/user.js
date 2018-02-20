var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    citizenId: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String,
        required: false,
        default: null
    },
    phoneNumber: {
        type: String,
        required: false,
        default: null
    }
});

UserSchema.statics.findByCredentials = function (username, password) {
    console.log(`username: ${username}`);
    console.log(`password: ${password}`);
    var User = this;
    return User.findOne({
        'username':username
    }).then((user) => {
        if (!user) {
            return Promise.reject(); //throw new Error("can't find a user with username :",username)
        }
        return new Promise((resolve, reject) => {
            if (user.password == password) {
                resolve(user);
            } else {
                reject();//throw new Error("wrong passwrod");
            }
        })
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = {
    User
};