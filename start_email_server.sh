#!/usr/bin/env bash

# change to script's directory
cd "$(dirname "$0")/email_server"

echo "=== flask start ==="
./application.py

ngrok http 5000