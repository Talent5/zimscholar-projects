# Deployment Helper Script for ScholarXafrica (Windows PowerShell)
# This script helps generate secure credentials and setup environment files

function Show-Menu {
    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host "ScholarXafrica Deployment Helper" -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1) Generate JWT Secret"
    Write-Host "2) Hash Admin Password"
    Write-Host "3) Create Backend .env File"
    Write-Host "4) Create Frontend .env Files"
    Write-Host "5) Install All Dependencies"
    Write-Host "6) Build Project"
    Write-Host "7) Full Setup (Dependencies + Build)"
    Write-Host "0) Exit"
    Write-Host ""
}

function Generate-JWTSecret {
    Write-Host ""
    Write-Host "Generating JWT Secret..." -ForegroundColor Green
    
    # Generate 32 random bytes and convert to hex
    $bytes = New-Object byte[] 32
    [Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
    $jwtSecret = [BitConverter]::ToString($bytes).Replace("-", "").ToLower()
    
    Write-Host "JWT_SECRET=$jwtSecret" -ForegroundColor Green
    Write-Host ""
    Write-Host "Copy this to your backend .env file" -ForegroundColor Yellow
    
    # Copy to clipboard
    $jwtSecret | Set-Clipboard
    Write-Host "JWT Secret copied to clipboard!" -ForegroundColor Green
}

function Hash-Password {
    Write-Host ""
    $password = Read-Host "Enter admin password" -AsSecureString
    $plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
    )
    
    Write-Host "Hashing password..." -ForegroundColor Green
    
    $scriptBlock = "const bcrypt = require('bcryptjs'); bcrypt.hash('$plainPassword', 10).then(console.log)"
    $hashedPassword = node -e $scriptBlock
    
    Write-Host "ADMIN_PASSWORD_HASH=$hashedPassword" -ForegroundColor Green
    Write-Host ""
    Write-Host "Copy this to your backend .env file" -ForegroundColor Yellow
    
    # Copy to clipboard
    $hashedPassword | Set-Clipboard
    Write-Host "Hashed password copied to clipboard!" -ForegroundColor Green
}

function Create-BackendEnv {
    Write-Host ""
    Write-Host "Creating backend .env file..." -ForegroundColor Yellow
    
    # Check if .env exists
    if (Test-Path "backend\.env") {
        $response = Read-Host "backend\.env already exists. Overwrite? (y/n)"
        if ($response -ne "y") {
            Write-Host "Skipping backend .env creation" -ForegroundColor Yellow
            return
        }
    }
    
    # Generate JWT secret
    $bytes = New-Object byte[] 32
    [Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
    $jwtSecret = [BitConverter]::ToString($bytes).Replace("-", "").ToLower()
    
    # Collect information
    $mongoUri = Read-Host "Enter MongoDB URI"
    $adminUsername = Read-Host "Enter admin username (default: admin)"
    if ([string]::IsNullOrWhiteSpace($adminUsername)) { $adminUsername = "admin" }
    
    $adminPassword = Read-Host "Enter admin password" -AsSecureString
    $plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($adminPassword)
    )
    
    Write-Host "Hashing password..." -ForegroundColor Green
    $scriptBlock = "const bcrypt = require('bcryptjs'); bcrypt.hash('$plainPassword', 10).then(console.log)"
    $hashedPassword = node -e $scriptBlock
    
    $emailHost = Read-Host "Enter email host (default: smtp.gmail.com)"
    if ([string]::IsNullOrWhiteSpace($emailHost)) { $emailHost = "smtp.gmail.com" }
    
    $emailUser = Read-Host "Enter email user"
    $emailPassword = Read-Host "Enter email password (app password)" -AsSecureString
    $plainEmailPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($emailPassword)
    )
    
    $adminEmail = Read-Host "Enter admin email"
    $supabaseUrl = Read-Host "Enter Supabase URL"
    $supabaseKey = Read-Host "Enter Supabase service key" -AsSecureString
    $plainSupabaseKey = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($supabaseKey)
    )
    
    $allowedOrigins = Read-Host "Enter allowed origins (comma-separated)"
    
    # Create .env file
    $envContent = @"
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration
MONGODB_URI=$mongoUri

# JWT Authentication
JWT_SECRET=$jwtSecret
ADMIN_USERNAME=$adminUsername
ADMIN_PASSWORD_HASH=$hashedPassword

# Email Configuration
EMAIL_HOST=$emailHost
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=$emailUser
EMAIL_PASSWORD=$plainEmailPassword
ADMIN_EMAIL=$adminEmail
ADMIN_DASHBOARD_URL=https://scholarxafrica.dev/admin

# Supabase Storage
SUPABASE_URL=$supabaseUrl
SUPABASE_SERVICE_KEY=$plainSupabaseKey

# CORS Configuration
ALLOWED_ORIGINS=$allowedOrigins
"@
    
    $envContent | Out-File -FilePath "backend\.env" -Encoding UTF8
    Write-Host "backend\.env created successfully!" -ForegroundColor Green
}

function Create-FrontendEnv {
    Write-Host ""
    Write-Host "Creating frontend .env files..." -ForegroundColor Yellow
    
    $apiUrl = Read-Host "Enter API URL (e.g., https://api.scholarxafrica.dev)"
    
    # Main frontend
    $frontendEnv = @"
# API Configuration
VITE_API_URL=$apiUrl
VITE_APP_NAME=ScholarXafrica
"@
    $frontendEnv | Out-File -FilePath ".env.production.local" -Encoding UTF8
    
    # Admin
    $adminEnv = @"
# API Configuration
VITE_API_URL=$apiUrl
"@
    $adminEnv | Out-File -FilePath "admin\.env.production.local" -Encoding UTF8
    
    Write-Host "Frontend .env files created successfully!" -ForegroundColor Green
}

function Install-AllDependencies {
    Write-Host ""
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    
    # Backend
    Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
    Push-Location backend
    npm install
    Pop-Location
    
    # Frontend
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    npm install
    
    # Admin
    Write-Host "Installing admin dependencies..." -ForegroundColor Cyan
    Push-Location admin
    npm install
    Pop-Location
    
    Write-Host "All dependencies installed!" -ForegroundColor Green
}

function Build-Project {
    Write-Host ""
    Write-Host "Building project..." -ForegroundColor Yellow
    
    # Build frontend
    Write-Host "Building main frontend..." -ForegroundColor Cyan
    npm run build:prod
    
    # Build admin
    Write-Host "Building admin panel..." -ForegroundColor Cyan
    Push-Location admin
    npm run build
    Pop-Location
    
    Write-Host "Build completed!" -ForegroundColor Green
}

function Full-Setup {
    Install-AllDependencies
    Build-Project
}

# Main loop
do {
    Show-Menu
    $choice = Read-Host "Enter choice [0-7]"
    
    switch ($choice) {
        "1" { Generate-JWTSecret }
        "2" { Hash-Password }
        "3" { Create-BackendEnv }
        "4" { Create-FrontendEnv }
        "5" { Install-AllDependencies }
        "6" { Build-Project }
        "7" { Full-Setup }
        "0" { Write-Host "Goodbye!" -ForegroundColor Cyan; break }
        default { Write-Host "Invalid choice" -ForegroundColor Red }
    }
} while ($choice -ne "0")
