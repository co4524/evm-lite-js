path_CommitTime = '/home/caideyi/TendermintOnEvm_benchmark/data/blockCommitTime.txt'
path_txRequestTime = '/home/caideyi/evm-lite-js/test/txRequestTime'
path_blockTxNum = '/home/caideyi/TendermintOnEvm_benchmark/data/blockTxNum.txt'
path_report = '/home/caideyi/TendermintOnEvm_benchmark/report/report'
path_tps = '/home/caideyi/TendermintOnEvm_benchmark/report/tps.txt'
path_latency = '/home/caideyi/TendermintOnEvm_benchmark/report/latency.txt'
path_txRate = '/home/caideyi/TendermintOnEvm_benchmark/report/txRate.txt'

fp_blockTxNum = open(path_blockTxNum, "r")
fp_txRequestTime = open(path_txRequestTime, "r")
fp_preCommitTime = open(path_CommitTime, "r")

blockTxNum = fp_blockTxNum.readlines()
txRequestTime = fp_txRequestTime.readlines()
commitTime = fp_preCommitTime.readlines()

def detetFail():
    suc = 0 
    total_send = len(txRequestTime)
    for i in range(len(blockTxNum)):
        suc += int(blockTxNum[i])
    fail = total_send - suc
    return fail 

def txRate():
    start = txRequestTime[0]
    end = txRequestTime[len(txRequestTime)-1]
    dur = (float(end) - float(start)) / 1000
    txRate = float(len(txRequestTime)) / float(dur)
    return txRate

def tps():
    start = txRequestTime[0]
    end = commitTime[len(commitTime)-1]
    dur = (float(end) - float(start)) / 1000
    tps = float(len(txRequestTime)) / float(dur)
    return tps


def latency():
    index = 0
    total_latency= 0
    for i in range(len(blockTxNum)):
        for j in range(int(blockTxNum[i])):
            la = (float(commitTime[i])-float(txRequestTime[index])) / 1000
            total_latency += la
            index+=1

    avg_latency = float(total_latency) / float(len(txRequestTime))
    return avg_latency

def cal():

    f = open(path_report, "a")
    ftps = open(path_tps, "a")
    flatency = open(path_latency, "a")
    ftxRate = open(path_txRate, "a")
    failTx = detetFail()
    _txRate = txRate()
    _tps = tps()
    _latency = latency()
    f.write("-----------Report---------------\n")
    f.write("txRate: " +str(_txRate)+ "\n")
    f.write("tps: " +str(_tps)+ "\n")
    f.write("latency: " +str(_latency)+ "\n")
    f.write("failNum: " + str(failTx) + "\n" )
    ftps.write(str(_tps)+ "\n")
    ftxRate.write(str(_txRate)+ "\n")
    flatency.write(str(_latency)+ "\n")
    print( "txRate: " , _txRate)
    print( "tps" , _tps)
    print( "Latency" , _latency)
    print( "failNum" , failTx)
    f.close()

cal()