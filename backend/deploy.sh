#!/bin/bash

# Update system packages
sudo apt update -y
sudo apt upgrade -y

# Install necessary dependencies for Python and FastAPI app
sudo apt install -y python3.12 python3.12-venv python3.12-dev build-essential libpq-dev
sudo apt install -y git

# Create project directory if it doesn't exist
mkdir -p /home/ubuntu/Smart-IoT-Patient-Monitoring-System

# Clone or pull the repository
if [ -d "/home/ubuntu/Smart-IoT-Patient-Monitoring-System/.git" ]; then
    cd /home/ubuntu/Smart-IoT-Patient-Monitoring-System
    git pull origin main
else
    cd /home/ubuntu
    # Replace with your actual repository URL
    git clone https://github.com/yisMeb/Smart-IoT-Patient-Monitoring-System.git
    cd Smart-IoT-Patient-Monitoring-System
fi

# Navigate to backend directory
cd backend

# Set up a Python virtual environment
python3.12 -m venv venv
source venv/bin/activate

# Install Python dependencies from requirements.txt
pip install --upgrade pip
pip install -r requirements.txt

# Create necessary directories
mkdir -p app/config

# Copy configuration files from temp directory
if [ -f "/home/ubuntu/temp/.env" ]; then
    cp /home/ubuntu/temp/.env ./app/config/.env
fi

if [ -f "/home/ubuntu/temp/iot-patient-monitoring-s-8a328-firebase-adminsdk-w8gnl-e08f5c2d89.json" ]; then
    cp /home/ubuntu/temp/iot-patient-monitoring-s-8a328-firebase-adminsdk-w8gnl-e08f5c2d89.json ./app/config/iot-patient-monitoring-s-8a328-firebase-adminsdk-w8gnl-e08f5c2d89.json
fi

if [ -f "/home/ubuntu/temp/private-subnet-patient-management.pem" ]; then
    mkdir -p /home/ubuntu/.ssh
    cp /home/ubuntu/temp/private-subnet-patient-management.pem /home/ubuntu/.ssh/
    chmod 600 /home/ubuntu/.ssh/private-subnet-patient-management.pem
fi

# Kill any existing uvicorn processes
pkill -f uvicorn || true

# Start the FastAPI app with Uvicorn
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > nohup.out 2>&1 &