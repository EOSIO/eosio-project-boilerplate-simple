
script_dir="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
quick_start_path="$script_dir/../quick_start.sh"
blockchain_data="$script_dir/../eosio_docker/data"
screen_name=eosio_boilerplate
docker_container_name=eosio_notechain_container

# Helper function to clean webserver, docker container, and docker data
cleanup() {
  echo "Clean up the webserver"
  pid=`screen -ls | awk '/\.'$screen_name'\t/ {print strtonum($1)}'`
  kill $pid
  echo "Change permission of blockchain data so it can be removed later"
  docker exec $docker_container_name /bin/sh -c "chown -R $(id -u):$(id -g) /mnt/dev/data"
  echo "Clean up the docker container"
  docker stop $docker_container_name
  echo "Remove blockchain data"
  rm -rf $blockchain_data
}

# Start boilerplate in screen
echo "Start boilerplate in screen"
screen -d -m -S $screen_name "$quick_start_path"

# Wait until eosio blockchain to be started
echo "Wait for the blockchain to start"
wait_for_blockchain_to_start='{
  while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost:8888/v1/chain/get_info)" != "200" ]]; 
  do
    echo "Blockchain is not ready yet" 
    sleep 1; 
  done
   echo "Blockchain is ready" 
}'
timeout 300 bash -c "$wait_for_blockchain_to_start" || false
if [ $? -ne 0 ]; then
echo "Fail to start the blockchain"
cleanup
exit 1
fi

# Wait until webserver is started
echo "Wait for the webserver to start"
wait_for_webserver_to_start='{
  while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost:3000)" != "200" ]]; 
  do
    echo "Webserver is not ready yet" 
    sleep 1; 
  done
  echo "Webserver is ready" 
}'
timeout 300 bash -c "$wait_for_webserver_to_start" || false
if [ $? -ne 0 ]; then
echo "Fail to start the webserver"
cleanup
exit 1
fi

# No problem
echo "Successfully start the boilerplate"
cleanup