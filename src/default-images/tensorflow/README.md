# Example of user image based on deepscheduler tensorflow cuda base image

## Considerations:

- The working directory of the base image is /train
- Base image includes tensorflow, tensorflow-gpu and numpy, but you can add more pip dependencies.
- All the results MUST be saved in /train/results.
- You SHOULD include a signal handler to save the results in case of max time reached.

## Build steps:

Modify your scripts to save the results in /results directory:

```python
birnn_net.save_weights(filepath="results/tfmodel.ckpt")
```

Include a signal handler to save results if the container is stopped:

```python
def handleTimeout(signalNumber, frame):
    print('-' * 89)
    print('TIMEOUT')
    birnn_net.save_weights(filepath="results/tfmodel.ckpt")
    sys.exit() 

signal.signal(signal.SIGTERM, handleTimeout)
```

Copy scripts and data into the working directory:

```docker
FROM oscarvicente/deepscheduler-tensorflow-cuda-base
COPY ./ ./
```

If you have pip requirements create a requirements.txt file, copy it into the container and run pip install:

```docker
RUN pip3 install -r requirements.txt
```

Finally include an entrypoint with the main script execution

```docker
ENTRYPOINT [ "python3", "-u", "main.py"]
```