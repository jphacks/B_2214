FROM python:3.8

RUN apt update && \
    apt upgrade -y && \
    apt install libgl1-mesa-dev -y

# Install libraries
COPY ./requirements.txt ./
RUN pip install -r requirements.txt && \
    rm ./requirements.txt

# Setup container directories
RUN mkdir /app

# Copy local code to the container
COPY ./app /app

# launch server with gunicorn
WORKDIR /app
EXPOSE 8080
CMD ["gunicorn", "main:app", "--timeout=0", "--preload", \
     "--workers=1", "--threads=4", "--bind=0.0.0.0:8080"]
