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

addNewCard({
    participantId: '1',
    issuedCompany: 'PTT',
    point: 999
});

function addNewCard(card, error) {
    console.log('Invoke addNewCard function');
    var newCard = {
        participantId: card.participantId,
        issuedCompany: card.issuedCompany,
        point: card.point,
        uuid: uuid()
    };

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

        transaction.setPropertyValue('participantId', newCard.participantId);
        transaction.setPropertyValue('issuedCompany', newCard.issuedCompany);
        transaction.setPropertyValue('point', newCard.point);
        transaction.setPropertyValue('uuid', newCard.uuid);

        return connection.submitTransaction(transaction).then(() => {
            console.log("Transaction Submitted/Processed Successfully!!")

            connection.disconnect();

        });
    }).catch((error) => {
        console.log(error);

        connection.disconnect();
    });
}