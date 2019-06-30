mkdir account10000-$1

for ((i = 0 ; i < 20 ; i ++)){
    cat $i >> account
}

mv account account10000-$1
cp ~/.ethereum/From account10000-$1/.

