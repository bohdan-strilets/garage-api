#!/usr/bin/env sh
set -e

EXPECTED_NODE=$(node -e "try{console.log(require('./package.json').volta.node)}catch(e){process.exit(0)}")
EXPECTED_YARN=$(node -e "try{console.log(require('./package.json').volta.yarn)}catch(e){process.exit(0)}")

CURRENT_NODE="$(node -v | sed 's/^v//')"
CURRENT_YARN="$(yarn -v 2>/dev/null || true)"

if [ -n "$EXPECTED_NODE" ] && [ "$CURRENT_NODE" != "$EXPECTED_NODE" ]; then
  echo "❌ Node version mismatch: expected $EXPECTED_NODE, got $CURRENT_NODE"
  echo "   Fix: volta install node@$EXPECTED_NODE && (reopen terminal)"
  exit 1
fi

if [ -n "$EXPECTED_YARN" ] && [ "$CURRENT_YARN" != "$EXPECTED_YARN" ]; then
  echo "❌ Yarn version mismatch: expected $EXPECTED_YARN, got $CURRENT_YARN"
  echo "   Fix: volta install yarn@$EXPECTED_YARN && (reopen terminal)"
  exit 1
fi
