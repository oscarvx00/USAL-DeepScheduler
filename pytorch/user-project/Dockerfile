FROM ds-pytorch:latest
WORKDIR /app
COPY ./ ./
RUN ls -l
RUN ls -l data/
ENTRYPOINT [ "python3", "-u", "main.py", "--cuda" ]