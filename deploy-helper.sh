#!/bin/bash

# Deployment Helper Script for ScholarXafrica
# This script helps generate secure credentials and setup environment files

echo "=================================================="
echo "ScholarXafrica Deployment Helper"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to generate JWT secret
generate_jwt_secret() {
    echo ""
    echo -e "${GREEN}Generating JWT Secret...${NC}"
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    echo -e "${GREEN}JWT_SECRET=${JWT_SECRET}${NC}"
    echo ""
}

# Function to hash password
hash_password() {
    echo ""
    echo -e "${YELLOW}Enter admin password:${NC}"
    read -s password
    echo ""
    echo -e "${GREEN}Hashing password...${NC}"
    HASHED_PASSWORD=$(node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('$password', 10).then(console.log)")
    echo -e "${GREEN}ADMIN_PASSWORD_HASH=${HASHED_PASSWORD}${NC}"
    echo ""
}

# Function to create backend .env
create_backend_env() {
    echo ""
    echo -e "${YELLOW}Creating backend .env file...${NC}"
    
    # Check if .env already exists
    if [ -f "backend/.env" ]; then
        echo -e "${RED}backend/.env already exists. Do you want to overwrite it? (y/n)${NC}"
        read -r response
        if [ "$response" != "y" ]; then
            echo "Skipping backend .env creation"
            return
        fi
    fi
    
    # Generate JWT secret
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    
    # Prompt for values
    echo "Enter MongoDB URI:"
    read MONGODB_URI
    
    echo "Enter admin username (default: admin):"
    read ADMIN_USERNAME
    ADMIN_USERNAME=${ADMIN_USERNAME:-admin}
    
    echo "Enter admin password:"
    read -s ADMIN_PASSWORD
    echo ""
    HASHED_PASSWORD=$(node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('$ADMIN_PASSWORD', 10).then(console.log)")
    
    echo "Enter email host (default: smtp.gmail.com):"
    read EMAIL_HOST
    EMAIL_HOST=${EMAIL_HOST:-smtp.gmail.com}
    
    echo "Enter email user:"
    read EMAIL_USER
    
    echo "Enter email password (app password):"
    read -s EMAIL_PASSWORD
    echo ""
    
    echo "Enter admin email:"
    read ADMIN_EMAIL
    
    echo "Enter Supabase URL:"
    read SUPABASE_URL
    
    echo "Enter Supabase service key:"
    read -s SUPABASE_SERVICE_KEY
    echo ""
    
    echo "Enter allowed origins (comma-separated):"
    read ALLOWED_ORIGINS
    
    # Create .env file
    cat > backend/.env << EOF
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration
MONGODB_URI=$MONGODB_URI

# JWT Authentication
JWT_SECRET=$JWT_SECRET
ADMIN_USERNAME=$ADMIN_USERNAME
ADMIN_PASSWORD_HASH=$HASHED_PASSWORD

# Email Configuration
EMAIL_HOST=$EMAIL_HOST
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=$EMAIL_USER
EMAIL_PASSWORD=$EMAIL_PASSWORD
ADMIN_EMAIL=$ADMIN_EMAIL
ADMIN_DASHBOARD_URL=https://scholarxafrica.dev/admin

# Supabase Storage
SUPABASE_URL=$SUPABASE_URL
SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY

# CORS Configuration
ALLOWED_ORIGINS=$ALLOWED_ORIGINS
EOF
    
    echo -e "${GREEN}backend/.env created successfully!${NC}"
}

# Function to create frontend .env
create_frontend_env() {
    echo ""
    echo -e "${YELLOW}Creating frontend .env file...${NC}"
    
    echo "Enter API URL (e.g., https://api.scholarxafrica.dev):"
    read API_URL
    
    cat > .env.production.local << EOF
# API Configuration
VITE_API_URL=$API_URL
VITE_APP_NAME=ScholarXafrica
EOF
    
    # Create admin .env
    cat > admin/.env.production.local << EOF
# API Configuration
VITE_API_URL=$API_URL
EOF
    
    echo -e "${GREEN}Frontend .env files created successfully!${NC}"
}

# Function to test MongoDB connection
test_mongodb_connection() {
    echo ""
    echo -e "${YELLOW}Testing MongoDB connection...${NC}"
    echo "Enter MongoDB URI to test:"
    read MONGODB_URI
    
    node -e "
        const mongoose = require('mongoose');
        mongoose.connect('$MONGODB_URI')
            .then(() => {
                console.log('✓ MongoDB connection successful!');
                process.exit(0);
            })
            .catch((err) => {
                console.error('✗ MongoDB connection failed:', err.message);
                process.exit(1);
            });
    "
}

# Function to install dependencies
install_dependencies() {
    echo ""
    echo -e "${YELLOW}Installing dependencies...${NC}"
    
    # Backend
    echo "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    # Frontend
    echo "Installing frontend dependencies..."
    npm install
    
    # Admin
    echo "Installing admin dependencies..."
    cd admin
    npm install
    cd ..
    
    echo -e "${GREEN}All dependencies installed!${NC}"
}

# Function to build project
build_project() {
    echo ""
    echo -e "${YELLOW}Building project...${NC}"
    
    # Build frontend
    echo "Building main frontend..."
    npm run build:prod
    
    # Build admin
    echo "Building admin panel..."
    cd admin
    npm run build
    cd ..
    
    echo -e "${GREEN}Build completed!${NC}"
}

# Function to seed database
seed_database() {
    echo ""
    echo -e "${YELLOW}Seeding database...${NC}"
    
    cd backend
    
    echo "Seeding services..."
    npm run seed:services
    
    echo "Seeding pricing..."
    npm run seed:pricing
    
    echo "Seeding customers..."
    npm run seed:customers
    
    cd ..
    
    echo -e "${GREEN}Database seeded successfully!${NC}"
}

# Main menu
while true; do
    echo ""
    echo "What would you like to do?"
    echo "1) Generate JWT Secret"
    echo "2) Hash Admin Password"
    echo "3) Create Backend .env File"
    echo "4) Create Frontend .env Files"
    echo "5) Test MongoDB Connection"
    echo "6) Install All Dependencies"
    echo "7) Build Project"
    echo "8) Seed Database"
    echo "9) Full Setup (Dependencies + Build)"
    echo "0) Exit"
    echo ""
    echo -n "Enter choice [0-9]: "
    read choice
    
    case $choice in
        1) generate_jwt_secret ;;
        2) hash_password ;;
        3) create_backend_env ;;
        4) create_frontend_env ;;
        5) test_mongodb_connection ;;
        6) install_dependencies ;;
        7) build_project ;;
        8) seed_database ;;
        9) install_dependencies && build_project ;;
        0) echo "Goodbye!"; exit 0 ;;
        *) echo -e "${RED}Invalid choice${NC}" ;;
    esac
done
