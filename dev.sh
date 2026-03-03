#!/bin/bash

# Zetta Orchestrator Script by Kai
echo "=========================================================="
echo "          WELCOME TO WEB-RNAWA: ZETTA CORE SYSTEM          "
echo "=========================================================="

# 1. Port Configuration
export WEB_PORT=3000
export AGENT_PORT=3001 

# 2. Check & Run Ollama Serve in background
# Kita pake port check (11434) biar scriptnya cerdas
if lsof -Pi :11434 -sTCP:LISTEN -t >/dev/null ; then
    echo "Status: Ollama service is already active. Skipping serve..."
else
    echo "Status: Starting Ollama service in background..."
    ollama serve > /dev/null 2>&1 &
    sleep 5 # Kasih waktu Ollama buat warm up
fi

# 3. Running concurrently
# Tambahin pengecekan model biar Zetta nggak 'blank' pas start
echo "Status: Verifying Local Brain (Qwen2:0.5b)..."
ollama list | grep -q "qwen2:0.5b" || echo "Warning: qwen2:0.5b not found. Ensure you have pulled it."

echo "Starting Orchestrator..."
echo "----------------------------------------------------------"

concurrently \
  --names "WEB,AGENT" \
  --prefix-colors "cyan,magenta" \
  --kill-others \
  "cd web && npm run dev -- -p $WEB_PORT" \
  "sleep 10 && cd agent/rnawa-agent && bun run start --port $AGENT_PORT"