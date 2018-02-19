var express = require('express');
var bodyParser = require('body-parser');

var userHyperledger = require('./../composer/user/user.js');
var card = require('./../composer/card/card.js');
var point = require('./../composer/point/point.js');
var uuid = require('uuid/v1');
var BusinessNetowrkDefinition = require('composer-client').BusinessNetowrkDefinition;


var {
    Company
} = require('./../models/company.js');
var {
    mongoose
} = require('./../db/mongoose.js');
var {
    Partner
} = require('./../models/partner.js');
var {
    User
} = require('./../models/user.js');


var app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('welcome to Dek');
});

var newCard = ({
    userId: '2',
    issuedCompany: 'PTT',
    point: 999,
    uuid: uuid()
});

app.get('/createCard', (req, res) => {
    card.addNewCard(newCard);
});

app.get('/users/:citizenid', (req,res) => {
    userHyperledger.getUser(req.params.citizenid).then( (u) =>{
        ////var Serializer = BusinessNetowrkDefinition.getSerializer();
       // var stringUser = Serializer.toJSON(u);
        console.log(`return user: ${u}`);

        res.send(u);
    });
});

app.get('/vendors', (req, res) => {
    Company.find().then((c) => {
        res.send(c);
    }, (e) => {
        res.send(e);
    });

});

app.get('/vendors/:id', (req, res) => {
    var id = req.params.id;
    Company.findById(id).then((c) => {
        return res.send(c);
    }, (e) => {
        return res.send(e);
    });
});

// change to accept id
app.get('/cards', (req, res) => {
    var userId = req.params.userId;
    card.getAllCard().then((c) => {
        res.send(c);
    });
});

app.get('/partners/:id', (req, res) => {
    var fromVendor = req.params.id;
    console.log('fromVendorId: ', fromVendor);
    var id = mongoose.Types.ObjectId(fromVendor);
    Partner.find({

    }).then((p) => {
        res.send({
            p
        });
    }, (e) => {
        res.send(e).status(404);
    });
});

app.post('/users', (req, res) => {
    var newUser = new User({
        username: req.body.username,
        password: req.body.password,
        citizenId: req.body.citizenid,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phoneNumber: req.body.phoneNumber
    });
    newUser.save().then((user) => {
        userHyperledger.addNewUser({
            citizenId: req.body.citizenid,
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            uuid: uuid()
        }).then((u) => {
            console.log(`u: ${u}`);
            //var serializer = composerCommon.Serializer.toJson;
            console.log(BusinessNetworkConnection);
            res.send(BusinessNetworkConnection.toJSON(u));
        }).catch( (e) => {
            console.log('Error');
            res.send(e.message).status(404);
        });
    }, (e) => {
        res.status(404).send(e);
    });
});

app.post('/users/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    User.findByCredentials(username, password).then((user) => {
        if (!user) {
            res.send(user);
        }
    }).catch((e) => {
        res.status(400).send();
    });
    // implement get card from hyperledger
});

app.post('/partners', (req, res) => {
    var newPartner = new Partner({
        fromVendorId: mongoose.Types.ObjectId(req.body.fromVendorId),
        toVendorId: mongoose.Types.ObjectId(req.body.toVendorId),
        fromRate: req.body.fromRate,
        toRate: req.body.toRate
    });
    newPartner.save().then((partner) => {
        res.send(partner);
    }, (e) => {
        res.status(404).send(e);
    });
});

app.post('/cards', (req, res) => {
    var newCard = {
        userId: req.body.userId,
        issuedCompany: req.body.vendorName,
        point: req.body.point,
        uuid: uuid()
    };

    card.addNewCard(newCard).then((c) => {
        res.send(c);
    });

});

app.post('/transferPoint', (req, res) => {
    var point = {
        fromCardId: req.body.fromCardId,
        toCardId: req.body.toCardId,
        fromPoint: req.body.fromPoint,
        toPoint: req.body.toPoint
    };

    point.transferPoint = function (info, error) {
        (point).then((c) => {
            res.send(c);
        });
    }
});

app.post('/vendors', (req, res) => {
    console.log(req.body);
    var company = new Company({
        name: req.body.name,
        img: req.body.img,
        id: uuid(),
        termAndCondition: req.body.termAndCondition
    });
    console.log('company: ', company);
    company.save().then((com) => {
        res.send(com);
    }, (e) => {
        res.status(404).send(e);
    });

});

app.delete('/vendor/:id', (req, res) => {
    var id = req.params.id;
    Company.findByIdAndRemove({
        _id: id
    }).then((com) => {
        if (!com) {
            res.status(404).send();
        }
        res.send(com);
    }, (e) => {
        res.status(404).send(e);
    });
});

app.delete('/partner', (req, res) => {
    Partner.remove({}).then((rm) => {
        res.send({
            rm
        });
    }, (e) => {
        res.send(e);
    });
});

app.listen(3333, () => {
    console.log('Started on port 3333');
});