#!/usr/bin/env bash
# Manual deploy from the Mac (GitHub Actions does the same on every push to main).
# Also installs the server-side files that CI is not allowed to change: docker-compose.yml and receive.sh.
# Usage, from app/: ./deploy/deploy.sh
# Needs the ssh alias "hostinger-vps" (~/.ssh/config) and /docker/landing/.env on the server.
set -euo pipefail
cd "$(dirname "$0")/.."
REMOTE=/docker/landing

ssh hostinger-vps "mkdir -p $REMOTE && cat > $REMOTE/docker-compose.yml" < deploy/docker-compose.yml
ssh hostinger-vps "cat > $REMOTE/receive.sh && chmod 700 $REMOTE/receive.sh" < deploy/receive.sh

# Send exactly what git would track - committed or not - so bin/, obj/ and secrets never leave the Mac
git ls-files -z --cached --others --exclude-standard \
  | COPYFILE_DISABLE=1 tar --null -T - --no-xattrs --no-mac-metadata -czf - \
  | ssh hostinger-vps "$REMOTE/receive.sh"

echo "Check: https://$(ssh hostinger-vps "grep ^LANDING_HOST= $REMOTE/.env | cut -d= -f2")/health"
