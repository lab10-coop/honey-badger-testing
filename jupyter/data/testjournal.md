




# Performance Tests


starting with Block: #10703


14 Times
{
  "networkUrl" : "ws://185.244.194.56:9542",
  "continuousSenderIntervalMin": 14,
  "continuousSenderIntervalMax": 14,
  "testDurationMs" :  300000,
  "calcNonceEveryTurn" : false,
  "trackPerformance" : true,
  "logToTerminal" : false,
  "logToFile" : true,
  "maximumPoolSize": 50
}


result: 
Observed: Blocks are not filled this time. Trying again with bigger Bool Size: 14*200. Therefore we have more than 3 Blocks in the Queue.


## Test 14x200

problem: The last test that not push the Chain to the limits, we did not get full blocks.
Thesis: higher Pool Size helps to fill up the chain with 14 parallel senders.
But not with enought transactions in order.

block: #11010


config: 
{
  "networkUrl" : "ws://185.244.194.53:9541",
  "continuousSenderIntervalMin": 14,
  "continuousSenderIntervalMax": 14,
  "testDurationMs" :  300000,
  "calcNonceEveryTurn" : false,
  "trackPerformance" : true,
  "logToTerminal" : false,
  "logToFile" : true,
  "maximumPoolSize": 200
}

end Block: #11316


## Test Tx350

Targeting 350 tx/s
Network is configured to target 400 tx/seconds.


Anfang: 11364
Ende: 11641


## Test tx538

Erwartung

Ergebniss: 
Gegen Ende wurde einige Transaktionen abgelehnt, weil TX Queue Voll war.

Ende: 11806


## test tx952

Target: 952 Transaktionen pro Sekunde

Erwarung: 
Chain schafft die 952 TXs pro Sekunde nicht (Hardware Limit),
rejecting transactions happens much earlier.

