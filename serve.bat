@echo off
cd /d "%~dp0"
echo Starting local server at http://localhost:8080
echo Open that URL in your browser to test SN lookup.
echo Press Ctrl+C to stop.
python -m http.server 8080
