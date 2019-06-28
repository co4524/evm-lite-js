const URL_dir = '/home/caideyi/evm-lite-js/test/baseURL'
const fs = require('fs');
testBasicAPI()
async function testBasicAPI() {
    let arr = await getURL(URL_dir);
    console.log(arr);
}
async function getURL(dir) { 

    var array = fs.readFileSync(dir).toString().split("\n");
    array.splice(array.length-1,1);
    return array;

}