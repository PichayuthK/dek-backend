const config = require('./../../config/config.js');
const bnUtil = require('./../admin-connection');
const uuid = require('uuid/v1');
const _ = require('lodash');
const moment = require('moment');

var cardStore = require('composer-common').FileSystemCardStore;
var BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

const namespace = config.namespace;
const transactionType = config.transactionAddNewCard;
var cardName = config.cardName;
const myCardStore = new cardStore();
var connection = new BusinessNetworkConnection({
    cardStore: myCardStore
});
// bnUtil.connect(addNewCard);

// addNewCard({
//     participantId: '1',
//     issuedCompany: 'PTT',
//     point: 999,
//     uuid:uuid()
// });

var addNewCard = function (newCard) {
    console.log('Invoke addNewCard function');
    console.log(newCard);

    var temp = checkCardExisting(newCard.cardNumber)
        .then((x) => {
            if (x != 99) {
                console.log(`check existing card: ${x}`)
                return x[0];
            }
            console.log('b4 connect');
            console.log(cardName);
            return connection.connect(cardName).then(function () {

                let bnDef = connection.getBusinessNetwork();

                console.log("Received Definition from Runtime: ",
                    bnDef.getName(), "  ", bnDef.getVersion());

                let factory = bnDef.getFactory();

                let transaction = factory.newTransaction(namespace, transactionType);

                transaction.setPropertyValue('userId', newCard.userId);
                transaction.setPropertyValue('issuedCompany', newCard.issuedCompany);
                transaction.setPropertyValue('point', newCard.point);
                transaction.setPropertyValue('uuid', newCard.uuid);
                transaction.setPropertyValue('cardNumber', newCard.cardNumber);

                return connection.submitTransaction(transaction).then(() => {
                    console.log("Transaction Submitted/Processed Successfully!!")

                    connection.disconnect();
                    return ('completed');

                });
            }).catch((error) => {
                console.log(error);

                connection.disconnect();
                return (error);
            });
        });
    return temp;
}


var getCard = function () {

    return connection.connect(cardName).then(function () {

        var statement = 'SELECT  org.dek.network.Card ';

        // #3 Build the query object
        var query = connection.buildQuery(statement);

        // #4 Execute the query
        return connection.query(query) //,{id:'CRAFT01'});
            .then((result) => {
                var reUser = [];
                console.log('Received card count:', result.length);
                if (result.length > 0) {
                    result.forEach((u) => {
                        reUser.push(u);
                    });
                }
                connection.disconnect();
                console.log(reUser);
                return reUser;
            }).catch((error) => {
                console.log(error);
                connection.disconnect();
                return (error);
            });
    });
}

var checkCardExisting = function (cardNumber) {

    return connection.connect(cardName).then(function () {

        var statement = 'SELECT  org.dek.network.Card WHERE (cardNumber == _$cardNumber)';
        // #3 Build the query object
        console.log('call query');
        return connection.buildQuery(statement);

        // #4 Execute the query
    }).then((qry) => {
        console.log('execute query');
        return connection.query(qry, {
            cardNumber: cardNumber
        });
    }).then((result) => {
        console.log('Received user count:', result.length);
        if (!result) {
            throw new Error('User not found with cardNumber: ', cardNumber);
        }
        // console.log(`result: ${result}`);
        if (result.length < 1) {
            console.log('no user');
            return 99;
        }
        var cardList = [];
        result.forEach((x) => {
            console.log(`${x.cardId} | ${x.userId} | ${x.issuedCompany} | ${x.point}`);
            cardList.push({
                cardId: x.cardId,
                userId: x.userId,
                issuedCompany: x.issuedCompany,
                point: x.point,
                cardNumber: x.cardNumber
            });
        });

        connection.disconnect();
        return cardList;
    }).catch((e) => {
        connection.disconnect();
        return e.message;
    });
}

var getAllCard = function (userId) {

    return connection.connect(cardName).then(function () {

        var statement = 'SELECT  org.dek.network.Card WHERE (userId == _$id)';
        // #3 Build the query object
        console.log('call query');
        return connection.buildQuery(statement);

        // #4 Execute the query
    }).then((qry) => {
        console.log('execute query');
        return connection.query(qry, {
            id: userId
        });
    }).then((result) => {
        console.log('Received user count:', result.length);
        if (!result) {
            throw new Error('User not found with citizenId: ', citizenId);
        }
        // console.log(`result: ${result}`);
        var cardList = [];
        result.forEach((x) => {
            console.log(`${x.cardId} | ${x.userId} | ${x.issuedCompany} | ${x.point}`);
            cardList.push({
                cardId: x.cardId,
                userId: x.userId,
                issuedCompany: x.issuedCompany,
                point: x.point,
                cardNumber: x.cardNumber
            });
        });
        // var serializer = connection.getSerializer();
        // var userString = serializer.toJSON(result);

        connection.disconnect();
        return cardList;
    }).catch((e) => {
        connection.disconnect();
        return e.message;
    });
}

function getCardHistory(myUserId, oldCardId) {
    return connection.connect(cardName).then(function () {
        var statement = "SELECT org.hyperledger.composer.system.HistorianRecord WHERE (transactionType == 'org.dek.network.TransferPoint')"; // ORDER BY transactionTimestamp DESC";
        //'resource:org.hyperledger.composer.system.AssetRegistry#org.dek.network.Card'
        return connection.buildQuery(statement)
    }).then((qry) => {
        return connection.query(qry);
    }).then((result) => {
        var temp = [];
        result.forEach((x) => {
            var item = x['eventsEmitted'][0];
            // console.log(item);
            if (item != null) {
                temp.push({
                    userId: item['userId'],
                    oldCardId: item['oldCardId'],
                    updateCardId: item['updateCardId'],
                    fromPoint: item['oldPoint'],
                    toPoint: item['updatePoint'],
                    dateTime: new moment(item['dateTime']).format('YYYY-MM-DD HH:mm:ss'),
                    fromCompany: item['fromCompany'],
                    toCompany: item['toCompany']
                });
            }
            // temp.push(item);
        });
        console.log('before filter: ', temp);
        temp = temp.filter((x) => {
            // console.log(x);
            return x.userId == myUserId && x.oldCardId == oldCardId;
        });

        // var sortTemp = _.sortBy(temp, function (x) {
        //     var tempTime = x.dateTime;
        //     return tempTime;
        // }).reverse();
        var sortTemp = _.orderBy(temp, ['dateTime'], ['desc']);
        console.log('after filter: ', sortTemp);
        connection.disconnect();

        // console.log(sortTemp);
        return sortTemp;
    }).catch((e) => {
        connection.disconnect();
        return e.message;
    });
}

function getAllCardHistory(myUserId) {
    return connection.connect(cardName).then(function () {
        var statement = "SELECT org.hyperledger.composer.system.HistorianRecord WHERE (transactionType == 'org.dek.network.TransferPoint')"; // ORDER BY transactionTimestamp DESC";
        //'resource:org.hyperledger.composer.system.AssetRegistry#org.dek.network.Card'
        return connection.buildQuery(statement)
    }).then((qry) => {
        return connection.query(qry);
    }).then((result) => {
        var temp = [];
        result.forEach((x) => {
            var item = x['eventsEmitted'][0];
            // console.log(item);
            if (item != null) {
                temp.push({
                    userId: item['userId'],
                    oldCardId: item['oldCardId'],
                    updateCardId: item['updateCardId'],
                    fromPoint: item['oldPoint'],
                    toPoint: item['updatePoint'],
                    dateTime: new moment(item['dateTime']).format('YYYY-MM-DD HH:mm:ss'),
                    fromCompany: item['fromCompany'],
                    toCompany: item['toCompany']
                });
            }
            // temp.push(item);
        });
        console.log('before filter: ', temp);
        temp = temp.filter((x) => {
            // console.log(x);
            return x.userId == myUserId;
        });

        // var sortTemp = _.sortBy(temp, function (x) {
        //     var tempTime = x.dateTime;
        //     return tempTime;
        // }).reverse();
        var sortTemp = _.orderBy(temp, ['dateTime'], ['desc']);
        console.log('after filter: ', sortTemp);
        connection.disconnect();

        // console.log(sortTemp);
        return sortTemp;
    }).catch((e) => {
        connection.disconnect();
        return e.message;
    });
}

module.exports = {
    addNewCard,
    getCard,
    getAllCard,
    getCardHistory,
    getAllCardHistory
}