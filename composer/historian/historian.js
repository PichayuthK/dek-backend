const config = require('./../../config/config.js');
const bnUtil = require('./../admin-connection');
const uuid = require('uuid/v1');
const _ = require('lodash');
const moment = require('moment');

var cardStore = require('composer-common').FileSystemCardStore;
var BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

const namespace = config.namespace;
const transactionType = config.transactionAddNewUser;
var cardName = config.cardName;
const myCardStore = new cardStore();
var connection = new BusinessNetworkConnection({
    cardStore: myCardStore
});

getCardHistory();

function getCardHistory() {
    var myUserId = 1;
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
            temp.push(item);
        });
        temp = temp.filter((x)=>{
            return x.userId = myUserId;
        });
        var sortTemp = _.sortBy(temp, function (x){
            var tempTime = new moment(x.dateTime).format('YYYY-MM-DD HH:mm:ss');
            return tempTime;
        }).reverse();
        connection.disconnect();
        return sortTemp;
    }).catch((e) => {
        connection.disconnect();
        return e.message;
    });
}


// getMyHistorian();
function getMyHistorian() {

    return connection.connect(cardName).then(function () {
        // This is where you would code the app specific stuff
        // Connection is available bnUtil.connection
        // to disconnect use bnUtil.disconnect()

        // 2. Get All asset registries...arg true = include system registry
        connection.getAllAssetRegistries(false).then((registries) => {
            console.log("Registries");
            console.log("==========");
            printRegistry(registries);

            registries.forEach((x) => {
                //  console.log(x.modelManager);
            });
            // 3. Get all the participant registries
            return connection.getAllParticipantRegistries(false);
        }).then((registries) => {
            printRegistry(registries);

            // 4. Get all the transaction Registries
            return connection.getAllTransactionRegistries();
        }).then((registries) => {
            // registries.forEach((x) => {
            //     console.log(x);
            // });
            printRegistry(registries);

            // 5. Get the Historian Registry
            return connection.getHistorian();

        }).then((registry) => {
            console.log("Historian Registry: ", registry.registryType, "   ", registry.id, "   ", registry.toJSON());
            (registry.getAll().then(function (his) {
                // console.log(his);
            }));
            // 6. Get the Identity Registry
            return connection.getIdentityRegistry();

        }).then((registry) => {
            console.log("Identity Registry: ", registry.registryType, "   ", registry.id);

            connection.disconnect();
        }).catch((error) => {
            console.log(error);
            connection.disconnect();
        });
    });
}

// Utility function to print information about the registry
function printRegistry(registryArray) {
    registryArray.forEach((registry) => {
        console.log(registry.registryType, "   ", registry.id);
    });
}