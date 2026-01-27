#!/bin/bash

# Project Request System - Quick Start Script
# This script helps you quickly test the project request system

echo "========================================="
echo "  ScholarXafrica Project Request System"
echo "  Quick Start & Testing Guide"
echo "========================================="
echo ""

echo "📋 Step 1: Verify Environment Setup"
echo "-----------------------------------"
echo "✓ Checking if .env file exists in backend..."
if [ -f "backend/.env" ]; then
    echo "  ✓ Found backend/.env"
    echo "  📧 Email configured: $(grep EMAIL_USER backend/.env | cut -d '=' -f2)"
    echo "  📬 Admin email: $(grep ADMIN_EMAIL backend/.env | cut -d '=' -f2)"
else
    echo "  ✗ backend/.env not found! Please create it first."
    exit 1
fi
echo ""

echo "📋 Step 2: Services Required"
echo "-----------------------------------"
echo "Please make sure the following are running:"
echo "  1. MongoDB (local or Atlas)"
echo "  2. Backend server (npm start in backend folder)"
echo "  3. Frontend dev server (npm run dev in root folder)"
echo "  4. Admin panel (npm run dev in admin folder)"
echo ""
read -p "Press Enter when all services are running..."
echo ""

echo "📋 Step 3: Access Points"
echo "-----------------------------------"
echo "  🌐 Main Website: http://localhost:3000"
echo "  📦 Project Request Page: http://localhost:3000/project-request"
echo "  🔐 Admin Portal: http://localhost:5173/admin"
echo "  🔧 Backend API: http://localhost:5000"
echo ""

echo "📋 Step 4: Test Project Request Submission"
echo "-----------------------------------"
echo "  1. Open: http://localhost:3000/project-request"
echo "  2. Fill out the form with test data:"
echo "     - Name: Test Student"
echo "     - Email: test@example.com"
echo "     - Phone: +263 77 123 4567"
echo "     - University: NUST"
echo "     - Course: BSc Computer Science"
echo "     - Category: Ready-Made or Custom"
echo "     - Project Type: Choose any"
echo "  3. Submit the form"
echo "  4. Check your admin email inbox for notification"
echo ""
read -p "Press Enter after submitting a test request..."
echo ""

echo "📋 Step 5: Verify Admin Portal"
echo "-----------------------------------"
echo "  1. Open: http://localhost:5173/admin"
echo "  2. Login with:"
echo "     - Username: admin"
echo "     - Password: admin123"
echo "  3. Navigate to 'Project Requests' section"
echo "  4. Verify your test request appears"
echo "  5. Try updating the status"
echo "  6. Click 'Send Project Files' to test reply email"
echo ""

echo "📋 Step 6: Check Email Notifications"
echo "-----------------------------------"
echo "  Admin should have received an email with:"
echo "  ✓ Student information"
echo "  ✓ Project details"
echo "  ✓ Link to admin dashboard"
echo "  ✓ WhatsApp quick reply link"
echo ""

echo "✅ Testing Complete!"
echo "-----------------------------------"
echo "If everything worked, your project request system is ready!"
echo ""
echo "📚 For more information, see PROJECT_REQUEST_SYSTEM.md"
echo ""

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

echo "🔍 Port Status Check:"
echo "-----------------------------------"
if check_port 5000; then
    echo "  ✓ Backend (5000): Running"
else
    echo "  ✗ Backend (5000): Not running - Start with: cd backend && npm start"
fi

if check_port 3000; then
    echo "  ✓ Frontend (3000): Running"
else
    echo "  ✗ Frontend (3000): Not running - Start with: npm run dev"
fi

if check_port 5173; then
    echo "  ✓ Admin (5173): Running"
else
    echo "  ✗ Admin (5173): Not running - Start with: cd admin && npm run dev"
fi
echo ""
