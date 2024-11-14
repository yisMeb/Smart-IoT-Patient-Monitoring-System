#!/bin/bash

echo "Deleting old app"
sudo rm -rf /var/www/

echo "Creating app folder"
sudo mkdir -p /var/www/patient-app 

echo "Moving files to app folder"
sudo mv * /var/www/patient-app

# Navigate to the app directory
cd /var/www/patient-app/

# Create a virtual environment
echo "Creating virtual environment"
python3 -m venv venv

# Activate the virtual environment
echo "Activating virtual environment"
source venv/bin/activate

# Move the env file to .env
sudo mv env .env

# Update package list
sudo apt-get update

# Install Python and pip if not already installed
echo "Installing Python and pip"
sudo apt-get install -y python3 python3-pip

# Install application dependencies from requirements.txt
echo "Installing application dependencies from requirements.txt"
pip install -r requirements.txt

# Update and install Nginx if not already installed
if ! command -v nginx > /dev/null; then
    echo "Installing Nginx"
    sudo apt-get update
    sudo apt-get install -y nginx
fi

# Configure Nginx to act as a reverse proxy if not already configured
if [ ! -f /etc/nginx/sites-available/myapp ]; then
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo bash -c 'cat > /etc/nginx/sites-available/myapp <<EOF
server {
    listen 80;
    server_name _;

    location / {
        include proxy_params;
        proxy_pass http://unix:/var/www/patient-app/myapp.sock;
    }
}
EOF'

    sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled
    sudo systemctl restart nginx
else
    echo "Nginx reverse proxy configuration already exists."
fi

# Stop any existing Gunicorn process
sudo pkill gunicorn || true  # Ignore if no process is found
sudo rm -f myapp.sock

# Install Gunicorn in the virtual environment if not already installed
echo "Installing Gunicorn"
pip install gunicorn

# Start Gunicorn using the virtual environment's Python interpreter
echo "Starting Gunicorn"
gunicorn --workers 3 --bind unix:myapp.sock app.main:app --user www-data --group www-data --daemon
echo "Started Gunicorn 🚀"