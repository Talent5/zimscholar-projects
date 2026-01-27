@echo off
echo =========================================
echo   ScholarXafrica Project Request System
echo   Quick Start ^& Testing Guide
echo =========================================
echo.

echo Step 1: Verify Environment Setup
echo -----------------------------------
if exist "backend\.env" (
    echo   [OK] Found backend\.env
    findstr "EMAIL_USER" backend\.env
    findstr "ADMIN_EMAIL" backend\.env
) else (
    echo   [ERROR] backend\.env not found! Please create it first.
    pause
    exit /b 1
)
echo.

echo Step 2: Services Required
echo -----------------------------------
echo Please make sure the following are running:
echo   1. MongoDB (local or Atlas^)
echo   2. Backend server (npm start in backend folder^)
echo   3. Frontend dev server (npm run dev in root folder^)
echo   4. Admin panel (npm run dev in admin folder^)
echo.
pause
echo.

echo Step 3: Access Points
echo -----------------------------------
echo   Main Website: http://localhost:3000
echo   Project Request Page: http://localhost:3000/project-request
echo   Admin Portal: http://localhost:5173/admin
echo   Backend API: http://localhost:5000
echo.

echo Step 4: Test Project Request Submission
echo -----------------------------------
echo   1. Open: http://localhost:3000/project-request
echo   2. Fill out the form with test data:
echo      - Name: Test Student
echo      - Email: test@example.com
echo      - Phone: +263 77 123 4567
echo      - University: NUST
echo      - Course: BSc Computer Science
echo      - Category: Ready-Made or Custom
echo      - Project Type: Choose any
echo   3. Submit the form
echo   4. Check your admin email inbox for notification
echo.
echo Opening project request page...
start http://localhost:3000/project-request
echo.
pause
echo.

echo Step 5: Verify Admin Portal
echo -----------------------------------
echo   1. Open: http://localhost:5173/admin
echo   2. Login with:
echo      - Username: admin
echo      - Password: admin123
echo   3. Navigate to 'Project Requests' section
echo   4. Verify your test request appears
echo   5. Try updating the status
echo   6. Click 'Send Project Files' to test reply email
echo.
echo Opening admin portal...
start http://localhost:5173/admin
echo.
pause
echo.

echo Step 6: Check Email Notifications
echo -----------------------------------
echo   Admin should have received an email with:
echo   [OK] Student information
echo   [OK] Project details
echo   [OK] Link to admin dashboard
echo   [OK] WhatsApp quick reply link
echo.

echo.
echo ========================================
echo Testing Complete!
echo ========================================
echo If everything worked, your project request system is ready!
echo.
echo For more information, see PROJECT_REQUEST_SYSTEM.md
echo.

echo.
echo Port Status Check:
echo -----------------------------------
netstat -an | findstr ":5000" >nul 2>&1
if %errorlevel% equ 0 (
    echo   [OK] Backend (5000^): Running
) else (
    echo   [X] Backend (5000^): Not running - Start with: cd backend ^&^& npm start
)

netstat -an | findstr ":3000" >nul 2>&1
if %errorlevel% equ 0 (
    echo   [OK] Frontend (3000^): Running
) else (
    echo   [X] Frontend (3000^): Not running - Start with: npm run dev
)

netstat -an | findstr ":5173" >nul 2>&1
if %errorlevel% equ 0 (
    echo   [OK] Admin (5173^): Running
) else (
    echo   [X] Admin (5173^): Not running - Start with: cd admin ^&^& npm run dev
)
echo.
echo.
pause
