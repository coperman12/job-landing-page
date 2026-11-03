#!/usr/bin/env bash
# Runs on the server as /docker/landing/receive.sh. Reads a .tar.gz of the site from stdin,
# swaps it into ./src, rebuilds the image and restarts the container.
# The GitHub Actions key can run only this script (forced command in authorized_keys), and it
# always uses the server's own docker-compose.yml - so a leaked CI key can replace the site,
# but cannot mount host folders or get a shell.
set -euo pipefail
cd /docker/landing
test -f .env || { echo "Missing /docker/landing/.env (see deploy/env.example)"; exit 1; }

rm -rf src.new && mkdir src.new
tar -xzf - -C src.new
rm -rf src && mv src.new src

docker compose up -d --build
docker image prune -f > /dev/null
echo "Deployed $(date -u +%FT%TZ)"
