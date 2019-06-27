start=0
end=500

for ((i=0 ; i< 20 ; i++)){
	rm $i
}

for ((i=0 ; i< 20 ; i++)){
	echo "Generate $start to $end account PrivKey.... to $i"
	node genPKey.js $start $end $i &
	let start=start+500
	let end=end+500
	sleep 1
}

