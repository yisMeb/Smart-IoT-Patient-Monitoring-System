echo "Deleting old app"
sudo rm -rf /var/www/smart-iot-patient-monitoring-system

echo "Creating app folder"
sudo mkdir -p /var/www/smart-iot-patient-monitoring-system

echo "Moving files to app folder"
sudo cp -r * /var/www/smart-iot-patient-monitoring-system

cd /var/www/smart-iot-patient-monitoring-system
#sudo mv ./backend/env .env

sudo apt-get update

echo "Installing Python, pip, and virtual environment tools"
sudo apt-get install -y python3-pip python3-venv

echo "Setting up virtual environment in the home directory"

python3 -m venv ~/smart-iot-venv
source ~/smart-iot-venv/bin/activate

echo "Installing dependencies in the virtual environment"
pip install -r requirements.txt

if ! command -v nginx > /dev/null; then
    echo "Installing Nginx"
    sudo apt-get install -y nginx
fi

if [ ! -f /etc/nginx/sites-available/myapp ]; then
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo bash -c 'cat > /etc/nginx/sites-available/myapp <<EOF
server {
    listen 80;
    server_name _;

    location / {
        include proxy_params;
        proxy_pass http://unix:/var/www/smart-iot-patient-monitoring-system/myapp.sock;
    }
}
EOF'

    sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled
    sudo systemctl restart nginx
else
    echo "Nginx reverse proxy configuration already exists."
fi

sudo pkill gunicorn || true
sudo rm -f /var/www/smart-iot-patient-monitoring-system/myapp.sock

echo "Starting Gunicorn"
~/smart-iot-venv/bin/gunicorn --workers 3 --bind unix:/var/www/smart-iot-patient-monitoring-system/myapp.sock backend.main:app --user www-data --group www-data --daemon
echo "Gunicorn started"
