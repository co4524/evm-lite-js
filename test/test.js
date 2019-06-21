var fs = require('fs');
var readline = require('readline');

function forloop(){

    for (var i =0 ; i < 500 ; i++){
        fs.appendFileSync( 'test' ,  i  + "\n" , function (err) {
            if (err)
                console.log(err);
            else
                console.log('Write operation complete.');
        });
    }

}


function readfile(){
    
    var fs = require('fs');
    var array = fs.readFileSync('test').toString().split("\n");
    for(i in array) {
        console.log(array[i]);
    }

}

async function main(){

    //await forloop()
    await readfile()

}

main()