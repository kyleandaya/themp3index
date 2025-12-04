#!/bin/bash
echo "Starting The MP3 Index server..."
echo ""
echo "Open your browser and go to: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
cd dist
python3 -m http.server 3000

