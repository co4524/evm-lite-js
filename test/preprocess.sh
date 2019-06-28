#  [0]: localhost
#  [1~]: remote
URL_path=$HOME/evm-lite-js/test/baseURL
rm $URL_path
nodeNum=$1
base=$2
ip=$3
remoteURL(){
    for ((i=0 ; i<$nodeNum ; i++)) {
        echo "http://$base.$ip:8080" >> $URL_path
        let ip=ip+1	
    }
}

if [ -z "$1" ]
then
    echo "http://localhost:8080" >> $URL_path
else
    remoteURL
fi

node giveMoney.js