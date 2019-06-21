rm account
rm From
ls keystore >> account
for line in `cat account`
do 
    account=${line:37:77}
    echo $account >> From
done

