const request = require('request-promise');
const colorStringify = require('node-json-color-stringify');
const sleep = require('sleep');

//const baseURL = 'http://localhost:8080';

/*
 Get node controlled accounts
*/
async function getAccounts( baseURL ) {
    try {
        let result;
        let error;
        let options = {
            url: baseURL + '/accounts',
        };

        await request.get(options, (err, res, body) => {
            if (err) error = err;
            result = res;
        });
        if (error) throw error;

        return JSON.parse(result.body);
    } catch (err) {
        throw err;
    }
}

/*
 Get any account
 Arguments:
    address: account address
*/
async function getAccount( baseURL , address ) {
    try {
        let result;
        let error;
        let options = {
            url: baseURL + '/account/' + address,
        };

        await request.get(options, (err, res, body) => {
            if (err) error = err;
            result = res;
        });
        if (error) throw error;

        return JSON.parse(result.body);
    } catch (err) {
        throw err;
    }
}

/*
 Send transactions from controlled accounts
 Arguments:
    tx: an ethereum transaction object
    ex.
    {
        from: "0x0B2DDDefb001cDD4c2f6Dd94e7b7d7c4dD35964E",
        to: "0x5f306129983998B258B8F145D85ccb650d9EF43A",
        value: "3"
    }
*/
async function sendTx( baseURL , txObject) {
    try {
        let result;
        let error;
        let options = {
            url: baseURL + '/tx',
            body: txObject,
            json: true
        };

        await request.post(options, (err, res, body) => {
            if (err) error = err;
            result = res;
        });
        if (error) throw error;

        return result.body;
    } catch (err) {
        throw err;
    }
}

/*
 Get Transaction receipt
 Arguments:
    txHash: transaction hash
*/
async function getTxReceipt(baseURL , txHash) {
    try {
        let result;
        let error;  
        let options = {
            url: baseURL + '/tx/' + txHash,
        };

        await request.get(options, (err, res, body) => {
            if (err) error = err;
            result = res;
        });
        if (error) throw error;

        return JSON.parse(result.body);
    } catch (err) {
        throw err;
    }
}

/*
 * Send raw signed transactions
 * Arguments:
 *  rawTx: raw transaction which has been signed by sender
 */
async function sendRawTx(baseURL , rawTx) {
    try {
        let result;
        let error;
        let options = {
            url: baseURL + '/rawtx',
            body: rawTx,
        };

        await request.post(options, (err, res, body) => {
            if (err) error = err;
            result = res;
        });
        if (error) throw error;

        return JSON.parse(result.body);
    } catch (err) {
        throw err;
    }
}

/*
 Send transactions from controlled accounts
 Arguments:
    tx: an ethereum transaction object
*/
async function call( baseURL , txObject) {
    try {
        let result;
        let error;
        let options = {
            url: baseURL + '/call',
            body: txObject,
            json: true
        };

        await request.post(options, (err, res, body) => {
            if (err) error = err;
            result = res;
        });
        if (error) throw error;

        return result.body;
    } catch (err) {
        throw err;
    }
}
module.exports = {
    getAccounts: getAccounts,
    getAccount: getAccount,
    sendTx: sendTx,
    getTxReceipt: getTxReceipt,
    sendRawTx: sendRawTx,
    call: call
}
