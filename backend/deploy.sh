echo "delete old app"
sudo rm -rf /var/www/

echo "creating app folder"
sudo mkdir -p /var/www/smart-iot-patient-monitoring-system

echo "moving files to app folder"
sudo mv * /var/www/smart-iot-patient-monitoring-system

cd /var/www/smart-iot-patient-monitoring-system/
sudo mv env .env

sudo apt-get update
echo "install python and pip"
sudo pip3 install -r requirements.txt

if ! command -v nginx > /dev/null; then
    echo "installing Nginx"
    sudo apt-get update
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


sudo pkill gunicorn
sudo rm -rf myapp.sock


echo "starting gunicorn"
sudo gunicorn --workers 3 --bind unix:myapp.sock backend.app.main:app --user www-data  --group www-data --daemon
echo "started gunicorn"
