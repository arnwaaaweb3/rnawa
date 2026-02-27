#!/bin/bash

# Zetta Orchestrator Script by Kai
echo "Welcome to webrnawa. Starting the initialization process..."

# Port Configuration
export WEB_PORT=3000
export AGENT_PORT=3001 

concurrently \
  --names "WEB,ZETTA" \
  --prefix-colors "cyan,magenta" \
  --kill-others \
  "cd web && npm run dev -- -p $WEB_PORT" \
  "sleep 10 && cd agent/rnawa-agent && bun run dev"