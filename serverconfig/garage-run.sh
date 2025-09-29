#!/usr/bin/env bash
set -euo pipefail

### Configuration parameters (edit these) ###
GARAGE_CONFIG_PATH="./garage.toml"

IP="127.0.0.1"
DOMAIN="garage.localhost"

METADATA_DIR="./garage/meta"
DATA_DIR="./garage/data"

DB_ENGINE="sqlite"

REPLICATION_FACTOR=1

RPC_SECRET="$(openssl rand -hex 32)"

S3_REGION="garage"

admin_token=$(openssl rand -base64 32)
metrics_token=$(openssl rand -base64 32)

# If using Docker, container name and image
GARAGE_CONTAINER_NAME="garaged"
GARAGE_IMAGE="dxflrs/garage:v2.1.0"

# Whether to run as Docker (yes/no). If "no", expects `garage` binary is installed.
USE_DOCKER="yes"

######################################

echo "=== checking Garage server ==="

if [ "$USE_DOCKER" = "yes" ]; then
  if ! docker ps | grep -q "${GARAGE_CONTAINER_NAME}"; then
    echo "Starting Garage server in Docker container..."
    docker run \
      -d \
      --name "${GARAGE_CONTAINER_NAME}" \
      -p 3900:3900 -p 3901:3901 -p 3902:3902 -p 3903:3903 -p 3904:3904 \
      -v "${GARAGE_CONFIG_PATH}:/etc/garage.toml:ro" \
      -v "${METADATA_DIR}:/var/lib/garage/meta" \
      -v "${DATA_DIR}:/var/lib/garage/data" \
      "${GARAGE_IMAGE}"
    echo "Garage server started in Docker container named ${GARAGE_CONTAINER_NAME}"
  else
    echo "Garage server is already running in Docker container ${GARAGE_CONTAINER_NAME}"
  fi
  alias garage="docker exec -ti ${GARAGE_CONTAINER_NAME} /garage" | true
else
  if ! command -v garage &> /dev/null; then
    echo "ERROR: 'garage' command not found. Please install Garage or set USE_DOCKER=yes"
    exit 1
  fi
  if ! pgrep -f 'garage.*-s3_api' > /dev/null; then
    echo "Starting Garage server..."
    garage server --config "$GARAGE_CONFIG_PATH" &
    echo "Garage server started"
  else
    echo "Garage server is already running"
  fi
fi

echo "===Admin API token (save this!):==="
echo "$admin_token"
echo "===Metrics API token (save this!):==="
echo "$metrics_token"