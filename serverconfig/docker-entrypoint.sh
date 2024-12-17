#!/bin/bash

set -e

# if the .env file does not exist, create it

if [ ! -f .env ]; then
  cp .env.example .env
fi

# get keys and values from environment variables. if the value exists, replace the key with the value in the .env file. if the value does not exist, add the key and value to the file.

while IFS='=' read -r key value; do
  if [ -n "$value" ]; then
    sed -i "s|${key}=.*|${key}=${value}|g" .env
  else
    echo "${key}=${value}" >> .env
  fi
done < <(env)

// run supervisor

exec /usr/bin/supervisord -c /etc/supervisor/supervisord.conf
