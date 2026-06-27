@echo off
cd /d "%~dp0"
echo Pushing to origin/main ...
git push
if %ERRORLEVEL% EQU 0 (
  echo Push succeeded.
) else (
  echo Push failed. Check the error above.
)
pause
