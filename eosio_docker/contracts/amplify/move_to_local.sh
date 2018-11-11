#!/bin/bash

eosio-cpp -abigen -o amplify.wasm ./amplify.cpp
cp ./ ~/eos/amplify -r

