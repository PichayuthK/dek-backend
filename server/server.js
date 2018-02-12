var express = require('express');
var bodyParser = require('body-parser');

var user = require('./../composer/user/user.js');
var card = require('./../composer/card/card.js');
var uuid = require('uuid/v1');
var {Company} = require('./../models/company.js');

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

app.get('/cardlist',(req,res) =>{
    var cardList = [{
        name:'PTT',
        img:'http://www.think.co.th/vr/wp-content/uploads/2016/10/ptt.png'
    },{
        name:'AirAsia',
        img:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/1200px-AirAsia_New_Logo.svg.png'
    },{
        name:'Tesco Lotus',
        img:'https://www.tescolotus.com/assets/common/img/fb-logo.jpg'
    },{
        name:'Big C',
        img: 'http://jobs.manager.co.th/media/logo/BIGC.png'
    },{
        name:'The One Card',
        img:'https://www.aeon.co.th/memberservice/Content/Images/0101500001-1.jpg'
    },{
        name:'AIS',
        img:'http://www.ais.co.th/base_interface/images/ais_menu_logo.png'
    },{
        name:'ESSO',
        img:'https://seeklogo.com/images/E/Esso-logo-073F2C0D97-seeklogo.com.png'
    }];
    res.send(cardList);
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

    card.addNewCard(newCard).then( (c) => {
        res.send(c);
    });

});

app.get('/createCompany', (req,res) => {
    var company = new Company({
        name: 'PEACE',
        img: 'www.google.com',
        id: uuid(),
        termAndCondition: 'this is term and condition'
    });

    company.save().then((com) => {
        res.send(com);
    }, (e) => {
        res.status(404).send(e);
    });

});

app.get('/company', (req,res) => {
    console.log('GET /company');
    Company.find({name:'PEACE'}).then( (com) => {
        res.send(com);
    }, (e) => {
        res.status(404).send(e);
    });
});

app.listen(3333, () => {
    console.log('Started on port 3333');
});