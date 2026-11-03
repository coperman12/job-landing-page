#!/usr/bin/env bash
# Deploys the site to the Hostinger VPS: copies the source, rebuilds the image and restarts the container.
# Usage, from app/: ./deploy/deploy.sh
# Needs the ssh alias "hostinger-vps" (~/.ssh/config) and /docker/landing/.env on the server.
set -euo pipefail
cd "$(dirname "$0")/.."
REMOTE=/docker/landing

# Send exactly what git would track - committed or not - so bin/, obj/ and secrets never leave the Mac
git ls-files -z --cached --others --exclude-standard \
  | COPYFILE_DISABLE=1 tar --null -T - --no-xattrs --no-mac-metadata -czf - \
  | ssh hostinger-vps "set -e
      mkdir -p $REMOTE && rm -rf $REMOTE/src.new && mkdir $REMOTE/src.new
      tar -xzf - -C $REMOTE/src.new
      rm -rf $REMOTE/src && mv $REMOTE/src.new $REMOTE/src
      cp $REMOTE/src/deploy/docker-compose.yml $REMOTE/docker-compose.yml"

ssh hostinger-vps "set -e; cd $REMOTE
  test -f .env || { echo 'Missing $REMOTE/.env (see deploy/env.example)'; exit 1; }
  docker compose up -d --build
  docker image prune -f > /dev/null"

echo "Deployed. Check: https://$(ssh hostinger-vps "grep ^LANDING_HOST= $REMOTE/.env | cut -d= -f2")/health"
