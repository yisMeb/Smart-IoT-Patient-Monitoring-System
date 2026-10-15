# EC2 backend deployment

The `Deploy backend to EC2` workflow deploys the backend after a push to
`main` that changes `backend/`. It can also be started manually from the
GitHub Actions page.

Create a GitHub environment named `production`, then add these environment
secrets:

| Secret | Value |
| --- | --- |
| `EC2_HOST` | EC2 hostname or IP address |
| `EC2_USER` | SSH user on the EC2 instance |
| `EC2_PORT` | SSH port, normally `22` |
| `EC2_SSH_PRIVATE_KEY` | Complete private SSH key |
| `EC2_KNOWN_HOSTS` | Output from `ssh-keyscan -H <EC2_HOST>` after verifying the host fingerprint |
| `EC2_APP_DIR` | Absolute destination directory for the backend |
| `EC2_SERVICE_NAME` | Name of the systemd service running Gunicorn or Uvicorn |

Application secrets such as database and Firebase credentials stay on EC2.
Configure them in the systemd service with an `EnvironmentFile`; the workflow
does not copy an application `.env` file from GitHub.

The EC2 user must be able to write to `EC2_APP_DIR` and run these commands
without an interactive password:

```text
sudo systemctl restart <service-name>
sudo systemctl is-active --quiet <service-name>
```

The instance also needs Python 3 with the `venv` module installed. Its systemd
service should run the application from this virtual environment:

```text
<EC2_APP_DIR>/.venv/bin/gunicorn -k uvicorn.workers.UvicornWorker app.main:app
```
