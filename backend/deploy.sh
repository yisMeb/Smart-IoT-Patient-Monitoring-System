#!/bin/bash

# Update system packages
sudo apt update -y
sudo apt upgrade -y

# Install necessary dependencies
sudo apt install -y python3.12 python3.12-venv python3.12-dev build-essential libpq-dev git nginx

# Set up project directories
PROJECT_DIR="/home/ubuntu/Smart-IoT-Patient-Monitoring-System"
BACKEND_DIR="$PROJECT_DIR/backend"

# Remove existing directory if it exists
echo "Cleaning up existing directory..."
rm -rf $PROJECT_DIR

# Clone the repository fresh
echo "Cloning repository..."
cd /home/ubuntu
git clone https://github.com/yisMeb/Smart-IoT-Patient-Monitoring-System.git
cd $PROJECT_DIR

# Create backend directory structure if it doesn't exist
mkdir -p $BACKEND_DIR/app/config

# Navigate to backend directory
cd $BACKEND_DIR
echo "Current directory: $(pwd)"

# Create and activate virtual environment
echo "Setting up Python virtual environment..."
python3.12 -m venv venv
source venv/bin/activate

# Verify Python environment
which python
python --version

# Install dependencies
echo "Installing dependencies..."
pip install --upgrade pip
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

# Copy configuration files from temp directory
echo "Copying configuration files..."
cp /home/ubuntu/temp/.env $BACKEND_DIR/app/config/.env || echo ".env file copy failed"
cp /home/ubuntu/temp/iot-patient-monitoring-s-8a328-firebase-adminsdk-w8gnl-e08f5c2d89 $BACKEND_DIR/app/config/iot-patient-monitoring-s-8a328-firebase-adminsdk-w8gnl-e08f5c2d89 || echo "Firebase config copy failed"
cp /home/ubuntu/temp/private-subnet-patient-management.pem /home/ubuntu/.ssh/ || echo "PEM file copy failed"
chmod 600 /home/ubuntu/.ssh/private-subnet-patient-management.pem || echo "PEM file permission change failed"

# Create a basic FastAPI app if it doesn't exist
if [ ! -f "$BACKEND_DIR/app/main.py" ]; then
    echo "Creating basic FastAPI app..."
    cat > $BACKEND_DIR/app/main.py << EOF
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
EOF
fi

# Configure Nginx
echo "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/fastapi_app << EOF
server {
    listen 80 default_server;
    server_name _;

    access_log /var/log/nginx/fastapi_access.log;
    error_log /var/log/nginx/fastapi_error.log;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site and remove default
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/fastapi_app /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Stop any existing uvicorn processes
echo "Stopping any existing uvicorn processes..."
pkill -f uvicorn || true

# Start the FastAPI app with Uvicorn
echo "Starting the FastAPI application..."
cd $BACKEND_DIR
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 > nohup.out 2>&1 &

# Restart Nginx
sudo systemctl restart nginx

# Wait for services to start
sleep 5

# Verify services
echo "Verifying services..."
if curl -s http://localhost:8000/ > /dev/null; then
    echo "FastAPI is running!"
else
    echo "FastAPI failed to start!"
    echo "Checking logs..."
    tail -n 50 nohup.out
    exit 1
fi

if sudo systemctl is-active --quiet nginx; then
    echo "Nginx is running!"
else
    echo "Nginx failed to start!"
    echo "Checking Nginx logs..."
    sudo tail -n 50 /var/log/nginx/error.log
    exit 1
fi

echo "Checking Nginx configuration and logs..."
sudo cat /etc/nginx/sites-enabled/fastapi_app
sudo tail -n 50 /var/log/nginx/fastapi_error.log

echo "Deployment completed! Try accessing http://$(curl -s ifconfig.me)/health"