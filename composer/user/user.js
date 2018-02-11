const config = require('./../../config/config.js');
const bnUtil = require('./../admin-connection');
const uuid = require('uuid/v1');

var cardStore = require('composer-common').FileSystemCardStore;
var BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

const namespace = config.namespace;
const transactionType = config.transactionAddNewUser;
var cardName = config.cardName;
const myCardStore = new cardStore();
var connection = new BusinessNetworkConnection({
    cardStore: myCardStore
});
// bnUtil.connect(addNewUser);

addNewUser({
    lastName: 'Kitti',
    citizenId: '11034',
    firstName: 'Peace',
    uuid:uuid()
});

function addNewUser(newCard, error) {
    console.log('Invoke addNewUser function');
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

        transaction.setPropertyValue('lastName', newCard.lastName);
        transaction.setPropertyValue('citizenId', newCard.citizenId);
        transaction.setPropertyValue('firstName', newCard.firstName);
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