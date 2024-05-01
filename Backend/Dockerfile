# 
FROM python:3.11.8-slim

# 
WORKDIR /code

# 
COPY ./requirements.txt /code/requirements.txt

# 
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

RUN mkdir /data && chmod 777 /data

EXPOSE  8000
# 
COPY . /code

# 
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]