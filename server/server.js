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

// var newCard = ({
//     userId: '2',
//     issuedCompany: 'PTT',
//     point: 999,
//     uuid: uuid()
// });

app.get('/users', (req, res) => {
    console.log(`--> GET/users`);
    User.find({}).then((u) => {
        res.send(u);
    });
});

app.get('/createCard', (req, res) => {
    console.log(`--> GET/createCard`);
    card.addNewCard(newCard);
});

app.get('/users/:citizenid', (req, res) => {
    console.log(`--> GET/users/:citizenId`);
    userHyperledger.getUser(req.params.citizenid).then((u) => {
        ////var Serializer = BusinessNetowrkDefinition.getSerializer();
        // var stringUser = Serializer.toJSON(u);
        console.log(`return user: ${u}`);

        res.send(u.toString());
    }).catch((e) => {
        console.log('e :', e);
        res.status(404).send();
    });
});

app.get('/vendors', (req, res) => {
    console.log(`--> GET/vendors`);
    Company.find().then((c) => {
        res.send(c);
    }, (e) => {
        res.send(e);
    });

});

app.get('/vendors/:id', (req, res) => {
    console.log(`--> GET/vendors/:id`);
    var id = req.params.id;
    Company.findById(id).then((c) => {
        return res.send(c);
    }, (e) => {
        return res.send(e);
    });
});

app.post('/cardshistory', (req, res) => {
    console.log(`--> POST/cardshistory`);
    var info = {
        userId: req.body.userId
    };
    card.getCardHistory(info).then((c) => {
        res.send(c);
    });
});

app.get('/cards', (req, res) => {
    card.getCard().then((c) => {
        res.send(c);
    });
});

// change to accept id
app.get('/cards/:id', (req, res) => {
    console.log(`--> GET/cards/:id`);
    var userId = req.params.id;

    card.getAllCard(userId)
        .then((c) => {
            return (c);
        })
        .then((userCard) => {

            Company.find({}).then((c) => {
                var result = [];
                userCard.forEach(e => {
                    var com = c.find((x) => {
                        return x.id == e.issuedCompany
                    });
                    e.detail = com;
                    result.push(e);
                    console.log('e : ', e);
                });
                res.send(result);
            });

        }).catch((e) => {
            res.status(404).send(e.message);
        });
});


app.get('/partners/:fromVendorId', (req, res) => {
    console.log(`--> GET/partners/:fromVendorId/`);
    var fromVendor = req.params.fromVendorId;

    console.log('fromVendorId: ', fromVendor);

    var id = mongoose.Types.ObjectId(fromVendor);

    var temp = Partner.find({
            fromVendorId: fromVendor
        })
        .populate('fromVendorId')
        .populate('toVendorId')
        .then((p) => {
            console.log(`p : ${p}`);
            res.send(p);
        })
        .catch((e) => {
            res.status(404).send();
        });

});

app.get('/transferPoint/:id/:cardId', (req, res) => {
    var userId = req.params.id;
    var cardId = req.params.cardId
    console.log('userId: ', userId);
    console.log('cardId: ', cardId);
    card.getCardHistory(userId, cardId)
        .then((userCard) => {
            Company.find({}).then((c) => {
                var result = [];
                userCard.forEach(e => {
                    var com = c.find((x) => {
                        return x.id == e.fromCompany
                    });
                    e.fromComapnyDetail = com;
                    var toCom = c.find((x) => {
                        return x.id == e.toCompany
                    });
                    e.toComapnyDetail = toCom;
                    result.push(e);
                    console.log('e : ', e);
                });
                res.send(result);
            });

        }).catch((e) => {
            console.log(e);
            res.status(404).send(e);
        });
});

app.get('/transferPoint/:id', (req, res) => {
    var userId = req.params.id;

    console.log('userId: ', userId);

    card.getAllCardHistory(userId)
        .then((userCard) => {
            Company.find({}).then((c) => {
                var result = [];
                userCard.forEach(e => {
                    var com = c.find((x) => {
                        return x.id == e.fromCompany
                    });
                    e.fromComapnyDetail = com;
                    var toCom = c.find((x) => {
                        return x.id == e.toCompany
                    });
                    e.toComapnyDetail = toCom;
                    result.push(e);
                    console.log('e : ', e);
                });
                res.send(result);
            });

        }).catch((e) => {
            console.log(e);
            res.status(404).send(e);
        });
});

app.get('/partners/:fromVendorId/:toVendorId/:userId', (req, res) => {
    console.log(`--> GET/partners/:fromVendorId/:toVendorId/:userId`);
    var fromVendor = req.params.fromVendorId;
    var toVendor = req.params.toVendorId;
    var userId = req.params.userId;
    console.log('fromVendorId: ', fromVendor);
    console.log('toVendorId ', toVendor);
    console.log('userId ', userId);
    // var partnerList = [];

    // var temp = Partner.find({})
    //     .populate('fromVendorId')
    //     .populate('toVendorId')
    //     .then((p) => {
    //         console.log(`p : ${p}`);
    //         partnerList.push(p);
    //         return p;
    //     })
    //     .catch((e) => {
    //         res.status(404).send();
    //     });
    // console.log(`temp: ${temp}`);
    // partnerList.push(temp);

    //     if (!partnerList) {
    //         res.status(404).send();
    //     }
    // console.log(`partnerList: ${partnerList}`);
    card.getAllCard(userId)
        .then((c) => {
            return (c);
        })
        .then((userCard) => {
            var result = [];
            Partner.find({
                    fromVendorId: fromVendor,
                    toVendorId: toVendor
                })
                .populate('fromVendorId')
                .populate('toVendorId')
                .then((c) => {
                    userCard.forEach(e => {
                        var com = c.find((x) => {
                            console.log(`c : ${c}`);
                            console.log(`x : ${x}`);
                            console.log(`x.toVendorId ${x.toVendorId}`);
                            return x.toVendorId.id == e.issuedCompany
                        });
                        if (com) {
                            e.detail = com;
                            result.push(e);
                            console.log('e : ', e);
                        }
                    });
                    res.send(result);
                });
        }, (e) => {
            res.status(404).send();
        });
});

app.post('/users', (req, res) => {
    console.log(`--> POST/users`);
    var newUser = new User({
        username: req.body.username,
        password: req.body.password,
        citizenId: req.body.citizenid,
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        phoneNumber: req.body.phoneNumber
    });
    console.log(`${newUser}`);
    User.find({
            citizenId: (req.body.citizenid).toString()
        })
        .then((u) => {
            console.log('u1: ',u);
            if (u != null && u.length > 0) {
                return userHyperledger.addNewUser({
                    citizenId: req.body.citizenid,
                    firstName: req.body.firstname,
                    lastName: req.body.lastname,
                    uuid: uuid()
                }).then((x)=>{
                    return res.send(u);
                });                
            }
            return u;
        })
        .then((u) => {
            if (u.length < 1) {
                return newUser.save().then((user) => {
                    console.log('end userHyperledger');
                    return userHyperledger.addNewUser({
                        citizenId: req.body.citizenid,
                        firstName: req.body.firstname,
                        lastName: req.body.lastname,
                        uuid: uuid()
                    });
                })
            }
        })
        .then((u) => {
            console.log(`u: ${u}`);
            res.send(newUser);
        })
        .catch((e) => {
            res.status(404).send();
        });

    // newUser.save().then((user) => {
    //     userHyperledger.addNewUser({
    //         citizenId: req.body.citizenid,
    //         firstName: req.body.firstname,
    //         lastName: req.body.lastname,
    //         uuid: uuid()
    //     }).then((u) => {
    //         console.log(`u: ${u}`);
    //        // res.send(u);
    //     }).catch((e) => {
    //         console.log('Error');
    //         res.send(e.message).status(404);
    //     });
    // })
    // .catch((e)=>{
    //     console.log(e);
    //     res.status(404).send();
    // });
});

app.post('/users/login', (req, res) => {
    console.log(`--> POST/users/login`);
    var username = req.body.username;
    var password = req.body.password;

    User.findByCredentials(username, password).then((user) => {
        if (user) {
            res.send(user);
        }
        res.status(400).send();
    }).catch((e) => {
        res.status(400).send();
    });
    // implement get card from hyperledger
});

app.post('/partners', (req, res) => {
    console.log(`--> POST/partners`);
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
    console.log('POST/cards');
    var newCard = {
        userId: req.body.userId,
        issuedCompany: req.body.vendorid,
        cardNumber: req.body.cardNumber,
        point: parseInt(req.body.point),
        uuid: uuid()
    };

    card.addNewCard(newCard).then((c) => {
        res.send(c);
    });

});

app.post('/transferPoint', (req, res) => {
    console.log(`--> POST/transferPoint`);
    console.log(`userId : ${req.body.userId}`);
    var myPoint = {
        fromCardId: req.body.fromCardId,
        toCardId: req.body.toCardId,
        fromPoint: req.body.fromPoint,
        toPoint: req.body.toPoint,
        userId: req.body.userId
    };
    console.log(myPoint);
    point.transferPoint(myPoint)
        .then((c) => {
            console.log(c);
            res.send(c);
        }).catch((e) => {
            res.status(404).send();
        });

});

app.post('/vendors', (req, res) => {
    console.log(`--> POST/vendors`);
    console.log(req.body);
    var company = new Company({
        name: req.body.name,
        img: req.body.img,
        termAndCondition: req.body.termAndCondition
    });
    console.log('company: ', company);
    company.save().then((com) => {
        res.send(com);
    }, (e) => {
        res.status(404).send(e);
    });

});

app.delete('/users', (req, res) => {
    console.log(`--> DELETE/users`);
    var code = req.body.code;
    if (code != 'killemall') {
        res.send('wrong code').status(404);
    }
    User.remove({}).then((rm) => {
        res.send({
            rm
        });
    });
});

app.delete('/vendors/:id', (req, res) => {
    console.log(`--> DELETE/vendors/:id`);
    var id = req.params.id;
    var code = req.body.code;
    if (code != 'killemall') {
        res.send('wrong code').status(404);
    }
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

app.delete('/partners', (req, res) => {
    console.log(`--> DELETE/partners`);
    var code = req.body.code;
    if (code != 'killemall') {
        res.send('wrong code').status(404);
    }
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