@echo off
echo ====================================
echo   Kitchen Stock Manager - Starting
echo ====================================
echo.

echo [1/2] Starting Backend (http://localhost:5000)...
start "Backend" cmd /k "cd /d %~dp0backend\KitchenManager.API && dotnet run"

timeout /t 8 /nobreak >nul

echo [2/2] Starting Frontend (http://localhost:3000)...
start "Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ====================================
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo ====================================
echo.
echo   Default login:
echo     Username: admin
echo     Password: password123
echo.
echo   Also available: user1 / password123
echo                    user2 / password123
echo.
echo   Press any key to stop all servers...
echo ====================================
pause

taskkill /f /fi "WINDOWTITLE eq Backend" >nul 2>&1
taskkill /f /fi "WINDOWTITLE eq Frontend" >nul 2>&1
