#!/usr/bin/env bash

source constant.sh

echo "=== start of first time setup ==="

# change to script's directory
cd "$(dirname "$0")"
SCRIPTPATH="$( pwd -P )"

# make sure Docker and Node.js is installed
if [ ! -x "$(command -v docker)" ] ||
   [ ! -x "$(command -v npm)" ]; then
  echo ""
  echo -e "\033[0;31m[Error with Exception]\033[0m"
  echo "Please make sure Docker and Node.js are installed"
  echo ""
  echo "Install Docker: https://docs.docker.com/docker-for-mac/install/"
  echo "Install Node.js: https://nodejs.org/en/"
  echo ""
  exit
fi

# build docker image, if necessary
if [[ "$(docker images -q $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG)" == "" ]]; then
  echo "=== Build docker image $DOCKER_IMAGE_NAME version $DOCKER_IMAGE_TAG, this will take some time for the first time run ==="
  docker build -t $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG .
else
  echo "=== Docker image already exists, skip building ==="
fi

# force remove the perivous container if any
# create a clean data folder in eosio_docker to preserve block data
echo "=== setup/reset data for eosio_docker ==="
docker rm --force eosio_notechain_container
rm -rf "./eosio_docker/data"
mkdir -p "./eosio_docker/data"

# set up node_modules for frontend
echo "=== npm install package for frontend react app ==="
# change directory to ./frontend
cd "$SCRIPTPATH/frontend"
npm install
