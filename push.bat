@echo off
echo Pushing HelloApply to Google Apps Script...
"%USERPROFILE%\.jetbrains-codegpt\node-v20.11.1-win-x64\node.exe" "%USERPROFILE%\.jetbrains-codegpt\node-v20.11.1-win-x64\node_modules\@google\clasp\build\src\index.js" push -f
echo Done.
pause

