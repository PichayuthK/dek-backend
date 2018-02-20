const config = require('./../../config/config.js');
const bnUtil = require('./../admin-connection');
const uuid = require('uuid/v1');

var cardStore = require('composer-common').FileSystemCardStore;
var BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

const namespace = config.namespace;
const transactionType = config.transactionTransferPoint;
var cardName = config.cardName;
const myCardStore = new cardStore();
var connection = new BusinessNetworkConnection({
    cardStore: myCardStore
});
// bnUtil.connect(addNewUser);

// // addNewUser({
// //     lastName: 'Kitti',
// //     citizenId: '11034',
// //     firstName: 'Peace',
// //     uuid: uuid()
// // });

var transferPoint = function(info, error) {
    console.log('Invoke transferPoint function');
    console.log(info);
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

        transaction.setPropertyValue('fromCardId', info.fromCardId);
        transaction.setPropertyValue('toCardId', info.toCardId);
        transaction.setPropertyValue('fromPoint', info.fromPoint);
        transaction.setPropertyValue('toPoint', info.toPoint);
        transaction.setPropertyValue('userId', info.userId);
        transaction.setPropertyValue('toCompany', info.toCompany);

        return connection.submitTransaction(transaction).then(() => {
            console.log("Transaction Submitted/Processed Successfully!!")

            connection.disconnect();

        });
    }).catch((error) => {
        console.log(error);

        connection.disconnect();
    });
}

// var getUser = function(id) {

//     return connection.connect(cardName).then(function () {

//     var statement = 'SELECT  org.dek.network.User';

//     // #3 Build the query object
//     var query = connection.buildQuery(statement);

//     // #4 Execute the query
//     return connection.query(query) //,{id:'CRAFT01'});
//         .then((result) => {
//             var reUser = [];
//             console.log('Received card count:', result.length);
//             if (result.length > 0) {
//                 result.forEach( (u) => {
//                     reUser.push(u.userId);
//                 });
//             }
//             connection.disconnect();
//             console.log(reUser);
//             return reUser;
//         }).catch((error) => {
//             console.log(error);
//             connection.disconnect();
//             return(error);
//         });
//     });
// }

// // getUser(1);


module.exports = {
    transferPoint
}