@echo off
echo ========================================
echo Packaging Extension for Chrome Web Store
echo ========================================
echo.

REM Create package folder
if exist "package" rmdir /s /q "package"
mkdir "package"

echo Copying required files...

REM Copy all required extension files
copy "manifest.json" "package\" >nul
copy "content.js" "package\" >nul
copy "background.js" "package\" >nul
copy "popup.html" "package\" >nul
copy "popup.js" "package\" >nul
copy "2023_Facebook_icon.svg.png" "package\" >nul

echo.
echo Files copied to 'package' folder:
dir /b package

echo.
echo Creating ZIP file...
cd package
powershell -Command "Compress-Archive -Path * -DestinationPath ..\fb-invite-automator-v2.1.0.zip -Force"
cd ..

echo.
echo ========================================
echo Package created successfully!
echo ========================================
echo.
echo ZIP file: fb-invite-automator-v2.1.0.zip
echo.
echo Next steps:
echo 1. Go to: https://chrome.google.com/webstore/devconsole
echo 2. Click "New Item"
echo 3. Upload the ZIP file
echo 4. Fill in store listing information
echo 5. Submit for review
echo.
pause

