#!/bin/bash

# Update system packages
sudo apt update -y
sudo apt upgrade -y

# Install necessary dependencies for Python and FastAPI app
sudo apt install -y python3.12 python3.12-venv python3.12-dev build-essential libpq-dev
sudo apt install -y git

# Create project directory if it doesn't exist
PROJECT_DIR="/home/ubuntu/Smart-IoT-Patient-Monitoring-System"
mkdir -p $PROJECT_DIR

# Clone or pull the repository
if [ -d "$PROJECT_DIR/.git" ]; then
    echo "Repository exists, pulling latest changes..."
    cd $PROJECT_DIR
    git fetch origin
    git reset --hard origin/main
else
    echo "Cloning repository..."
    cd /home/ubuntu
    git clone https://github.com/yisMeb/Smart-IoT-Patient-Monitoring-System.git
    cd Smart-IoT-Patient-Monitoring-System
fi

cd $PROJECT_DIR/backend
pwd
ls -la

# Set up a Python virtual environment
echo "Setting up Python virtual environment..."
python3.12 -m venv venv
source venv/bin/activate

which python
python --version

# Install Python dependencies from requirements.txt
echo "Installing dependencies..."
pip install --upgrade pip
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    echo "requirements.txt not found! Creating one..."
    echo "
    gunicorn
    pytest
    fastapi 
    uvicorn
    firebase-admin
    asyncpg
    python-dotenv
    asyncssh
    phonenumbers
    python-multipart
    httpx
    " > requirements.txt
    pip install -r requirements.txt
fi
# Create necessary directories
mkdir -p app/config

# Copy configuration files from temp directory
echo "Copying configuration files..."
if [ -f "/home/ubuntu/temp/.env" ]; then
    cp /home/ubuntu/temp/.env ./app/config/.env
    echo ".env file copied successfully"
else
    echo ".env file not found in temp directory"
fi

if [ -f "/home/ubuntu/temp/iot-patient-monitoring-s-8a328-firebase-adminsdk-w8gnl-e08f5c2d89.json" ]; then
    cp /home/ubuntu/temp/iot-patient-monitoring-s-8a328-firebase-adminsdk-w8gnl-e08f5c2d89.json ./app/config/iot-patient-monitoring-s-8a328-firebase-adminsdk-w8gnl-e08f5c2d89.json
    echo "Firebase config file copied successfully"
else
    echo "Firebase config file not found in temp directory"
fi

if [ -f "/home/ubuntu/temp/private-subnet-patient-management.pem" ]; then
    mkdir -p /home/ubuntu/.ssh
    cp /home/ubuntu/temp/private-subnet-patient-management.pem /home/ubuntu/.ssh/
    chmod 600 /home/ubuntu/.ssh/private-subnet-patient-management.pem
    echo "PEM file copied successfully"
else
    echo "PEM file not found in temp directory"
fi

# Kill any existing uvicorn processes
echo "Stopping any existing uvicorn processes..."
pkill -f uvicorn || true

# Start the FastAPI app with Uvicorn
echo "Starting the FastAPI application..."
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > nohup.out 2>&1 &

# Verify the application is running
sleep 5
if pgrep -f uvicorn > /dev/null; then
    echo "Application started successfully!"
else
    echo "Failed to start application!"
    exit 1
fi

echo "Deployment completed!"