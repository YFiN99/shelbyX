@echo off
echo === ShelbyX Dev ===
echo.

REM Cek .env
if not exist .env (
    if exist .env.local (
        echo [OK] Menggunakan .env.local
    ) else (
        echo [!] Buat file .env dulu dari .env.example
        echo     copy .env.example .env
        pause
        exit /b 1
    )
)

REM Install deps jika belum ada
if not exist node_modules (
    echo [..] Installing dependencies...
    npm install
)

REM Install express + multer + dotenv untuk dev server jika belum ada
node -e "require('express')" 2>nul || npm install --save-dev express multer dotenv

echo.
echo [1/2] Menjalankan API server di port 3000...
start "ShelbyX API" cmd /k "node api/server-dev.js"

echo [2/2] Menjalankan Vite di port 5173...
echo.
echo Buka: http://localhost:5173
echo.
npm run dev
