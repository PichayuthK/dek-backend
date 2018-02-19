
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

// addNewUser({
//     lastName: 'Kitti',
//     citizenId: '11034',
//     firstName: 'Peace',
//     uuid: uuid()
// });

var addNewUser = function (newUser, error) {
    console.log('Invoke addNewUser function');
    console.log(newUser);
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

        transaction.setPropertyValue('lastName', newUser.lastName);
        transaction.setPropertyValue('citizenId', newUser.citizenId);
        transaction.setPropertyValue('firstName', newUser.firstName);
        transaction.setPropertyValue('uuid', newUser.uuid);

        return connection.submitTransaction(transaction).then(() => {
            console.log("Transaction Submitted/Processed Successfully!!")

            connection.disconnect();

            return getUser(newUser.citizenId);
        });
    }).catch((error) => {
        console.log(error);

        connection.disconnect();
    });
}

var getUser = function (citizenId) {

    return connection.connect(cardName).then(function () {

        var statement = 'SELECT  org.dek.network.User WHERE (citizenId == _$id)';
        // #3 Build the query object
        console.log('call query');
        return connection.buildQuery(statement);

        // #4 Execute the query
    }).then((qry) => {
        console.log('execute query');
        return connection.query(qry, {id: citizenId});
    }).then((result)=> { 
        console.log('Received user count:', result.length);
        if (!result) {
            throw new Error('User not found with citizenId: ', citizenId);
        }
        console.log(`result: ${result[0].userId}`);
       // var serializer = connection.getSerializer();
       // var userString = serializer.toJSON(result);

        connection.disconnect();
        return result[0].userId;
    }).catch((e)=>{
        connection.disconnect();
        return e.message;
    });
}

// getUser(1);


module.exports = {
    addNewUser,
    getUser
}
// var addNewUser = function (newUser, error) {
//     console.log('Invoke addNewUser function');
//     console.log(newUser);
//     if (error) {
//         console.log('--- error ----');
//         console.log(error);
//         process.exit(1);
//     }

//     console.log('b4 connect');
//     console.log(cardName);
//     return connection.connect(cardName).then(function () {

//         let bnDef = connection.getBusinessNetwork();

//         console.log("Received Definition from Runtime: ",
//             bnDef.getName(), "  ", bnDef.getVersion());

//         let factory = bnDef.getFactory();

//         let transaction = factory.newTransaction(namespace, transactionType);

//         transaction.setPropertyValue('lastName', newUser.lastName);
//         transaction.setPropertyValue('citizenId', newUser.citizenId);
//         transaction.setPropertyValue('firstName', newUser.firstName);
//         transaction.setPropertyValue('uuid', newUser.uuid);

//         return connection.submitTransaction(transaction).then(() => {
//             console.log("Transaction Submitted/Processed Successfully!!")

//             connection.disconnect();

//             return getUser(newUser.citizenId);
//         });
//     }).catch((error) => {
//         console.log(error);

//         connection.disconnect();
//     });
// }

// return connection.query(query, {
//     id: citizenId
// })
// .then((result) => {
//     // var reUser = [];
//     console.log('Received user count:', result.length);
//     if (!result) {
//         throw new Error('User not found with citizenId: ', citizenId);
//     }
//     connection.disconnect();
//     var serializer = connection.getSerializer();
//     return serializer.toJSON(result);
// }).catch((error) => {
//     console.log(error);
//     connection.disconnect();
//     return (error);
// });