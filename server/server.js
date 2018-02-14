var express = require('express');
var bodyParser = require('body-parser');

var user = require('./../composer/user/user.js');
var card = require('./../composer/card/card.js');
var uuid = require('uuid/v1');

var {
    Company
} = require('./../models/company.js');
var {
    mongoose
} = require('./../db/mongoose.js');
var {
    Partner
} = require('./../models/partner.js');

var app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('welcome to Dek');
});

var newCard = ({
    userId: '2',
    issuedCompany: 'PTT',
    point: 999,
    uuid:uuid()
});

app.get('/createCard', (req,res) => {
    card.addNewCard(newCard);
});

app.get('/user', (req, res) => {
    var username = req.params.username;
    var password = req.params.password;
    user.getUser(1).then((u) => {
        res.send(u);
    });
});

app.get('/vendor', (req, res) => {
    Company.find().then((c) => {
        res.send(c);
    }, (e) => {
        res.send(e);
    });

});

app.get('/vendor/:id', (req, res) => {
    var id = req.params.id;
    Company.findById(id).then((c) => {
        return res.send(c);
    }, (e) => {
        return res.send(e);
    });
});

// change to accept id
app.get('/card', (req, res) => {
    var userId = req.params.userId;
    card.getAllCard().then((c) => {
        res.send(c);
    });
});

app.get('/partner/:id', (req,res) => {
    var fromVendor = req.params.id;
    console.log('fromVendorId: ', fromVendor);
    var id = mongoose.Types.ObjectId(fromVendor);
    Partner.find({
       
    }).then( (p) => {
        res.send({ p });
    }, (e) => {
        res.send(e).status(404);
    });
});

app.post('/partner', (req, res) => {
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

app.post('/card', (req, res) => {
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

app.post('/vendor', (req, res) => {
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

app.delete('/partner', (req,res) => {
    Partner.remove({}).then( (rm) =>{
        res.send({rm});
    }, (e) => {
        res.send(e);
    });
});

app.listen(3333, () => {
    console.log('Started on port 3333');
});