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

var app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('welcome to Dek');
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

app.get('/card', (req, res) => {
    var userId = req.params.userId;

    card.getAllCard().then((c) => {
        res.send(c);
    });

});

app.get('/createCard', (req, res) => {
    var newCard = {
        userId: '1',
        issuedCompany: 'PTT',
        point: 999,
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
    Company.findByIdAndRemove({_id: id }).then((com) => {
        if(!com){
            res.status(404).send();
        }
        res.send(com);
    }, (e) => {
        res.status(404).send(e);
    });
});

app.listen(3333, () => {
    console.log('Started on port 3333');
});