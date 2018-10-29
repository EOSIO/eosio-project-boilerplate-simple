#!/usr/bin/env bash

# # make sure everything is clean and well setup
./first_time_setup.sh

# # start blockchain and put in background
./start_eosio_docker.sh --nolog

# start frontend react app
./start_frontend.sh &
P1=$!

# start backend demux and express process
./start_backend.sh &
P2=$!

# wait $P1 $P2
wait $P1 $P2
