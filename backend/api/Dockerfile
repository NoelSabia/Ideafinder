FROM python:3.13-alpine3.21

COPY  requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD [ "fastapi", "run", "main.py" ]
