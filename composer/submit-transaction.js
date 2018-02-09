'use strict';
/**
 * Part of a course on Hyperledger Fabric: 
 * http://ACloudFan.com
 * 
 * Demostrates the use of factory received in the BN connection using
 * the getFactory( ) method to submit a transaction
 * 
 * Pre-Req
 * 1. Start the fabric
 * 2. Deploy & start airlinev7
 * 3. Start the REST Server
 * 4. Make sure there is no Flight resource with id="AE101-05-12-2018"
 *    Delete it if you find one - Remember the code for CreateFlight
 *    Transaction has the flightId hardcoded :-)
 * 
 * Demo Steps
 * 1. Use the bn-connection-util to create the connection to airlinev7
 * 2. Get the Busines Network Definition from Runtime
 * 3. Get the factory from the Business Network definition
 * 4. Create a new Transaction instance
 * 5. Set the property values in the transaction object
 * 6. Submit the transaction
 */

const config = require('./../config/config.js');
const bnUtil = require('./admin-connection');

// Constant values - change as per your needs
const namespace = config.namespace;
const transactionType = config.transactionAddNewCard;
const uuid = require('uuid/v1');



bnUtil.connect(addNewCard);

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

    let bnDef = bnUtil.connection.getBusinessNetwork();
    
    console.log("Received Definition from Runtime: ",
        bnDef.getName(), "  ", bnDef.getVersion());

    let factory = bnDef.getFactory();

    let transaction = factory.newTransaction(namespace, transactionType);

    transaction.setPropertyValue('participantId', newCard.participantId);
    transaction.setPropertyValue('issuedCompany', newCard.issuedCompany);
    transaction.setPropertyValue('point', newCard.point);
    transaction.setPropertyValue('uuid', newCard.uuid);

    return bnUtil.connection.submitTransaction(transaction).then(() => {
        console.log("Transaction Submitted/Processed Successfully!!")

        bnUtil.disconnect();

    }).catch((error) => {
        console.log(error);

        bnUtil.disconnect();
    });
}



// function main(error) {

//     if (error) {
//         console.log(error);
//         process.exit(1);
//     }

//     return bnUtil.connection.submitTransaction(transaction).then(() => {
//         console.log("6. Transaction Submitted/Processed Successfully!!")

//         bnUtil.disconnect();

//     }).catch((error) => {
//         console.log(error);

//         bnUtil.disconnect();
//     });
// }