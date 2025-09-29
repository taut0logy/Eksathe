BUCKET_NAME="eksathe"
KEY_NAME="eksathe-key"

echo "Waiting for Garage API to become ready..."
# Wait a bit for the server to start
sleep 5


echo "=== Checking Garage status / node id ==="
NODE_ID_FULL=$(garage status | awk '/HEALTHY NODES/ {getline; print $1}')
if [ -z "$NODE_ID_FULL" ]; then
  echo "ERROR: Could not detect node ID from garage status"
  exit 1
fi
echo "Detected node id: $NODE_ID_FULL"

# Optionally shorten node id prefix
NODE_ID_PREFIX=${NODE_ID_FULL:0:8}
echo "Using node prefix: $NODE_ID_PREFIX"

echo "=== Assign layout to this node ==="
garage layout assign -z dc1 -c 1 "${NODE_ID_PREFIX}"
echo "Layout assigned"

echo "=== Apply layout ==="
garage layout apply
echo "Layout applied"

echo "=== Creating bucket: $BUCKET_NAME ==="
garage bucket create "$BUCKET_NAME"

echo "=== Listing buckets (for check) ==="
garage bucket list

echo "=== Creating API key: $KEY_NAME ==="
KEY_JSON=$(garage key create "$KEY_NAME")
echo "Key creation output:"
echo "$KEY_JSON"

# Parse the key id and secret from CLI output
KEY_ID=$(echo "$KEY_JSON" | awk '/Key ID:/ {print $3}')
SECRET_KEY=$(echo "$KEY_JSON" | awk '/Secret key:/ {print $3}')
echo "Parsed Key ID = $KEY_ID"
echo "Parsed Secret Key = $SECRET_KEY"

echo "=== Granting permissions to key on bucket ==="
garage bucket allow --read --write --owner "$BUCKET_NAME" --key "$KEY_NAME"

echo "=== Done ==="
echo "Bucket:    $BUCKET_NAME"
echo "Key name:  $KEY_NAME"
echo "Key ID:    $KEY_ID"
echo "Secret key: $SECRET_KEY"
