#!/bin/bash

# Update system packages
sudo apt update -y
sudo apt upgrade -y

# Install necessary dependencies
sudo apt install -y python3.12 python3.12-venv python3.12-dev build-essential libpq-dev git nginx

# Define project directories
PROJECT_DIR="/home/ubuntu/Smart-IoT-Patient-Monitoring-System"
BACKEND_DIR="$PROJECT_DIR/backend"
USERNAME=yismeb
TOKEN=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
REPO=yisMeb/Smart-IoT-Patient-Monitoring-System

# Remove existing project directory and clone fresh
if [ -d "$PROJECT_DIR" ]; then
    echo "Removing existing project directory..."
    if rm -rf "$PROJECT_DIR"; then
        echo "Project directory removed successfully."
    else
        echo "Failed to remove the project directory. Check permissions."
        exit 1
    fi
else
    echo "Project directory does not exist. No removal needed."
fi


echo "Cloning repository..."
git clone https://$USERNAME:$TOKEN@github.com/$REPO.git $PROJECT_DIR || { echo "Git clone failed"; exit 1; }

# Set up the backend
cd $BACKEND_DIR || { echo "Backend directory not found"; exit 1; }

# Set up the Python virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3.12 -m venv venv
fi

source venv/bin/activate
which python
python --version

# Install dependencies
if [ -f "requirements.txt" ]; then
    echo "Installing dependencies..."
    pip install --upgrade pip
    pip install -r requirements.txt
else
    echo "requirements.txt not found!"
    exit 1
fi

# Copy configuration files
echo "Copying configuration files..."
cp /home/ubuntu/temp/.env $BACKEND_DIR/.env || echo ".env file copy failed"
cp /home/ubuntu/temp/iot-patient-monitoring-s-8a328-firebase-adminsdk-w8gnl-e08f5c2d89.json $BACKEND_DIR/app/config/ || echo "Firebase config copy failed"

# Configure Nginx
if [ ! -f /etc/nginx/sites-available/fastapi_app ]; then
    echo "Configuring Nginx..."
    sudo tee /etc/nginx/sites-available/fastapi_app << EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
    }
}
EOF
    sudo ln -sf /etc/nginx/sites-available/fastapi_app /etc/nginx/sites-enabled/
fi

sudo nginx -t || { echo "Nginx configuration test failed"; exit 1; }
sudo systemctl restart nginx

# Start the FastAPI app
pkill -f uvicorn || true
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 > nohup.out 2>&1 &
sleep 5

if curl -s http://localhost:8000/ > /dev/null; then
    echo "FastAPI is running!"
else
    echo "FastAPI failed to start!"
    tail -n 50 nohup.out
    exit 1
fi

echo "Deployment completed!"
