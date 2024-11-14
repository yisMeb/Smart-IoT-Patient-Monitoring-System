
sudo apt update -y
sudo apt upgrade -y

# Install necessary dependencies for Python and FastAPI app
sudo apt install -y python3.12 python3.12-venv python3.12-dev build-essential libpq-dev
sudo apt install -y git

# Navigate to your backend app directory
cd /home/ubuntu/Smart-IoT-Patient-Monitoring-System/backend

# Set up a Python virtual environment
python3.12 -m venv venv
source venv/bin/activate

# Install Python dependencies from requirements.txt
pip install --upgrade pip
pip install -r requirements.txt

cp /home/ubuntu/Smart-IoT-Patient-Monitoring-System/backend/.env /home/ubuntu/Smart-IoT-Patient-Monitoring-System/backend/.env
cp /home/ubuntu/Smart-IoT-Patient-Monitoring-System/backend/iot-patient-monitoring-s-8a328-firebase-adminsdk-w8gnl-e08f5c2d89.json /home/ubuntu/Smart-IoT-Patient-Monitoring-System/backend/iot-patient-monitoring-s-8a328-firebase-adminsdk-w8gnl-e08f5c2d89.json

# Copy the .pem file for SSH connection to the jump server
cp /home/ubuntu/Smart-IoT-Patient-Monitoring-System/backend/private-subnet-patient-management.pem /home/ubuntu/.ssh/private-subnet-patient-management.pem

# Set the proper permissions for the .pem file
chmod 600 /home/ubuntu/.ssh/private-subnet-patient-management.pem

# Run the FastAPI app with Uvicorn
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
