#!/bin/bash

docker exec -it eosio-dev /opt/eosio/bin/cleos --url http://127.0.0.1:7777 --wallet-url http://127.0.0.1:5555 set contract amplify /home/deon/eos/amplify -p amplify@active
