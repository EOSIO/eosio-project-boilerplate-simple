#!/usr/bin/env bash

# change to executable directory
cd "/opt/eosio/bin"

CONTRACTSPATH="$( pwd -P )/contracts"

# make new directory for compiled contract files
mkdir -p ./compiled_contracts
mkdir -p ./compiled_contracts/$1

COMPILEDCONTRACTSPATH="$( pwd -P )/compiled_contracts"

# unlock the wallet
if [ ! -z $3 ]; then ./cleos wallet unlock -n $3 --password $4; fi

# compile smart contract to wast and abi files
(
  ./eosiocpp -o "$COMPILEDCONTRACTSPATH/$1/$1.wast" "$CONTRACTSPATH/$1/$1.cpp" &&
  ./eosiocpp -g "$COMPILEDCONTRACTSPATH/$1/$1.abi" "$CONTRACTSPATH/$1/$1.cpp"
) &&

# set (deploy) compiled contract to blockchain
./cleos set contract $2 "$COMPILEDCONTRACTSPATH/$1/" --permission $2
