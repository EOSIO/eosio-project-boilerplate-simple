# Overview
NoteChain demonstrates the eosio platform running a blockchain as a local single node test net with a simple DApp, NoteChain. NoteChain allows users to create and update notes. This guide uses scripts, containing relevant commands, which will show you how to install, build and run NoteChain, and by doing so will demonstrate:

- Downloading and running eosio in docker;
- Managing your docker container;
- Setting up and running a local single node testnet;
- Setting up wallets, keys, and accounts;
- Writing and deploying a smart contract;
- Implementing a web based UI using React;
- Connecting the UI to the blockchain using eosjs;
- Styling the UI using Material-UI.

Github eosio-project-boilerplate-simple (https://github.com/EOSIO/eosio-project-boilerplate-simple) contains the UI and Smart Contract code, as well as setup scripts which will initialise and start all the necessary components.

The sample DApp demonstrates storing data in multi index table and retreiving this data into the web based UI. NoteChain is a simple note taking application, where notes are tied to user accounts. For this example, all accounts are pre-created by scripts and the account details are displayed at the bottom of the NoteChain UI.

Each account can then be used to add a note to the blockchain. The individual notes are saved in a multi-index table and for simplicity are of fixed width. Each account may have one note attached to it, adding a note to an account with an existing note will replace the existing note with a new note.

**Any private keys you see in this repository are for demo purposes only. For a real DApp NEVER expose the private keys.**

# Prerequisites

Make sure Docker and Node.js are installed

* Install Docker: https://docs.docker.com/docker-for-mac/install/
* Install Node.js: https://nodejs.org/en/

The DApp and eosio will occupy the ports 3000, 8888 and 9876. Make sure nothing else is already running on these ports.

Download the repository:
```sh
curl -sL https://github.com/EOSIO/eosio-project-boilerplate-simple/archive/master.tar.gz | tar xz
```

The following guide assumes you are using macOS.

# Quick start - Run the DApp

In this section we provide a single command script to run all the commands needed to start for both blockchain and UI. For more detail on each component see the `Detailed guide` below.

**To start**
```sh
./quick_start.sh
```

The above command will execute the following in sequence:

1. `first_time_setup.sh`
2. `start_eosio_docker.sh`
3. `start_frontend.sh`

**To stop**, press `ctrl+c` on your keyboard, and execute:
```sh
docker stop eosio_notechain_container
```

# Detailed guide

In this section we will describe in detail each script used to run the NoteChain environment in details.

## Initial setup

```sh
./first_time_setup.sh
```

Executing the above shell script verifies that docker and node.js are installed. It then downloads the `eosio/eos-dev` docker image (which contains a full version of the eosio blockchain), removes any previous instances of this docker container and installs node packages for the frontend react app.

## Initialise and start blockchain and DApp

After the initialisation, two terminal windows are required, both opened in the repository directory

- The **first terminal window** is for **blockchain** process.
- The **second terminal window** is for **frontend** react app.

**running the blockchain**

For the first (blockchain) terminal window, running
```sh
./start_eosio_docker.sh
```
will:

- Start the eosio blockchain
- Create smart contract owner account,
- Deploy smart contract
- Pre-create 7 user accounts with hard coded keys.

The log of blockchain will be displayed on your screen. eosio is now running and starts producing blocks.

**running the DApp**

For the second (frontend) terminal window, running
```sh
./start_frontend.sh
```
will open a browser session connecting to http://localhost:3000/ showing the react app. You can try to add or remove notes using one of the pre-created accounts with its key on the website. This react app will interact with the smart contract, performing transactions, which are written to the blockchain, which stores note data in the multi index table of the smart contract running on your local nodeos.

## Stopping blockchain or DApp

**stopping the blockchain**

In the first (blockchain) terminal window, press `ctrl+c` on your keyboard, the log will stop printing. And then execute:
```sh
docker stop eosio_notechain_container
```

This action will take a few seconds. The blockchain will be stopped.

**stopping the DApp**

In the second (frontend) terminal window, press `ctrl+c` on your keyboard. The frontend react app will be stopped.

## Restarting blockchain or DApp

**restarting the blockchain**

In the first (blockchain) terminal window, execute this command:
```sh
./start_eosio_docker.sh
```

The blockchain will be resumed automatically. And the log will be output to the terminal.

**restarting the DApp**

In the second (frontend) terminal window, you can restart the frontend react app by executing:
```sh
./start_frontend.sh
```

## Reset blockchain data

First, you need to stop the blockchain (as above). And then execute:
```sh
./first_time_setup.sh
```

This removes all data on the blockchain, including accounts, deployed smart contracts, etc... The block count will be reset when you start the blockchain again.

## Project structure

```js
noteChain // project directory
├── eosio_docker
│   ├── * contracts // this folder will be mounted into docker
│   │   └── notechain
│   │       └── notechain.cpp // the main smart contract
│   ├── * data // blockchain data, generated after first_time_setup.sh
│   │   ├── blocks
│   │   ├── state
│   │   └── initialized // to indicate whether the blockchain has been initialized or not
│   └── * scripts // scripts and utilities for docker container
│       ├── accounts.json // pre-create account names, public and private keys (for demo only)
│       ├── continue_blockchain.sh // continue the stopped blockchain
│       ├── create_accounts.sh // create account data
│       ├── deploy_contract.sh // deploy contract
│       └── init_blockchain.sh // script for creating accounts and deploying contract inside docker container
└── frontend
    ├── node_modules // generated after npm install
    ├── public
    │   └── index.html // html skeleton for create react app
    ├── src
    │   ├── pages
    │   │   └── index.jsx // an one-pager jsx, include react component and Material-UI
    │   └── index.js // for react-dom to render the app
    ├── package-lock.json // generated after npm install
    └── package.json // for npm packages

* means the directory will be mount to the docker container. whenever the file changes on local machine, it will be automatically reflected in the docker environment.
```

## DApp development

The DApp consists of two parts. eosio blockchain and frontend react app. These can be found in:

- eosio_docker
    - eosio block producing node (local node) wrapped in a docker container
        - 1 smart contract
        - auto smart contract deployment
        - auto create 7 user accounts
- frontend
    - node.js development environment
        - create-react-app: http://localhost:3000/

Users interact with the UI in client and sign the transaction in frontend. The signed transaction (which is an `update` action in this demo DApp) is sent to the blockchain directly. After the transaction is accepted in blockchain, the note is added into the multi index table in blockchain.

The UI, index.jsx, reads the notes data directly from nodeos using 'getTableRows()'. The smart contract, notechain.cpp, stores these notes in the multi index table using 'emplace()'' and 'modify()'.

## Docker usage

Docker is used to wrap the eosio software inside and run a container (instance) from an image (eosio/eos-dev v1.1.0). To work with the blockchain directly, by running the scripts or using a cleos command line, you need to go into the container bash.

Go into container bash:
```sh
docker exec -it eosio_notechain_container bash
```
We have already set the container working directory to `/opt/eosio/bin/`, you could run cleos command in this directory directly. For documentation of cleos: https://developers.eos.io/eosio-nodeos/docs/cleos-overview

You can also look at the `init_blockchain.sh` or `deploy_contract.sh` scripts for examples of cleos command lines.

To exit from inside the container bash:
```sh
exit
```

## Smart contract (Blockchain):

The smart contract can be found at `eosio_docker/contracts/notechain/notechain.cpp`, you can edit this smart contract. You will then need to compile and deploy the contract to the blockchain.

To save time, we prepared some scripts for you. Execute the scripts in the container bash (see above.)

The following script will help you to unlock the wallet, compile the modified contract and deploy to blockchain. 1st parameter is the contract name; 2nd parameter is the account name of the contract owner, 3rd and 4th parameter references  wallet related information that was created during the `Initial setup`:
```sh
./scripts/deploy_contract.sh notechain notechainacc notechainwal $(cat notechain_wallet_password.txt)
```

After running this script the modified smart contract will be deployed on the blockchain.

Remember to redeploy the NoteChain contract each time you modify it using!

## Frontend:

The UI code can be found  at noteChain/frontend/src/pages/index.jsx), once you have edited this code the frontend react app compile automatically and the page on browser will be automatically refreshed. You can see the change on the browser once the browser finishes loading.

## Docker commands

If you are more familiar with docker, you could use below docker command to have better control with the whole environment. Below is the explanation of each of the command

**Execute below command in `/eosio_docker`:**

Run container from eosio/eos-dev image by mounting contracts / scripts to the container with running the init_blockchain.sh script as the process.
The init_blockchain.sh script run the local node of the blockchain and initializes wallets / contract / data.
```sh
docker run --rm --name eosio_notechain_container \
-p 8888:8888 -p 9876:9876 \
--mount type=bind,src="$(pwd)"/contracts,dst=/opt/eosio/bin/contracts \
--mount type=bind,src="$(pwd)"/scripts,dst=/opt/eosio/bin/scripts \
--mount type=bind,src="$(pwd)"/data,dst=/mnt/dev/data \
-w "/opt/eosio/bin/" eosio/eos-dev:v1.1.0 /bin/bash -c "./scripts/init_blockchain.sh"
```

Output and follow docker console logs:
```sh
docker logs eosio_notechain_container --follow
```

Remove the container (will remove all wallets / contracts / data), useful if you want to re-init the whole DApp.
```sh
docker rm -f eosio_notechain_container
```

Stop the container (see below troubleshoot section to see how to pause and continue the blockchain):
```sh
docker stop eosio_notechain_container
```
