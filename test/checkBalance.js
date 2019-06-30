const api = require('/home/caideyi/evm-lite-js/index.js')
const fs = require('fs');

const URL_dir = '/home/caideyi/evm-lite-js/test/baseURL'
const source__AddressDir = '/home/caideyi/evm-lite-js//test/testAccount/address'
const des_address = '6666666666666666666666666666666666666666'
var baseURL = [];

testBasicAPI()

async function testBasicAPI() {

    baseURL = await getURL(URL_dir);

    let result = await api.getAccount( baseURL[0], des_address ); 
    console.log(result.balance);


}


async function getURL(dir) { 

    var array = fs.readFileSync(dir).toString().split("\n");
    array.splice(array.length-1,1);
    return array;

}
