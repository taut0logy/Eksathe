#!/usr/bin/env bash
set -euo pipefail

### Configuration parameters (edit these) ###
GARAGE_CONFIG_PATH="./garage.toml"

echo "=== Generating garage.toml config ==="

cat > garage.toml <<EOF
metadata_dir = "${METADATA_DIR}"
data_dir = "${DATA_DIR}"
db_engine = "${DB_ENGINE}"

replication_factor = ${REPLICATION_FACTOR}

rpc_bind_addr = "[::]:3901"
rpc_public_addr = "${IP}:3901"
rpc_secret = "${RPC_SECRET}"

[s3_api]
s3_region = "${S3_REGION}"
api_bind_addr = "[::]:3900"
root_domain = ".s3.${DOMAIN}"

[s3_web]
bind_addr = "[::]:3902"
root_domain = ".web.${DOMAIN}"
index = "index.html"

[k2v_api]
api_bind_addr = "[::]:3904"

[admin]
api_bind_addr = "[::]:3903"
admin_token = "${admin_token}"
metrics_token = "${metrics_token}"
EOF

echo "Generated config at $GARAGE_CONFIG_PATH"