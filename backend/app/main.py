from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart IoT Patient Monitoring System Backend"}

#-- this is for windows machine with vscode editor - run those commands in the terminal
#python -m venv venv
#venv\Scripts\activate
#pip install -r requirements.txt
#uvicorn app.main:app --reload
