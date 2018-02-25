const config = require('./../../config/config.js');
const bnUtil = require('./../admin-connection');
const uuid = require('uuid/v1');

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

var addNewCard = function (newCard, error) {
    console.log('Invoke addNewCard function');
    console.log(newCard);
    if (error) {
        console.log('--- error ----');
        console.log(error);
        process.exit(1);
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
        
        transaction.setPropertyValue('cardNumber',newCard.cardNumber);

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
                point: x.point
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

var getCardHistory = function () {
    return connection.connect(cardName).then(function () {
        var statement = "SELECT org.hyperledger.composer.system.HistorianRecord WHERE (transactionType == 'org.dek.network.TransferPoint')";// ORDER BY (transactionTimestamp DESC)";
        //'resource:org.hyperledger.composer.system.AssetRegistry#org.dek.network.Card'
        return connection.buildQuery(statement)
    }).then((qry) => {
        return connection.query(qry);
    }).then((result) => {
        //console.log(result);
        var filteredResult = result.filter((x) => {
            return (x.eventsEmitted);
        }); 
        filteredResult.forEach((x) => {
            console.log('----------------------------------->');
            console.log(x);
            console.log();
            console.log();
        });
        connection.disconnect();
        return result;
    }).catch((e) => {
        connection.disconnect();
        return e.message;
    });
}

module.exports = {
    addNewCard,
    getCard,
    getAllCard,
    getCardHistory
}