# Example of user image based on deepscheduler pytorch cuda base image

## Considerations:

- The working directory of the base image is /train
- Base image includes torch, torchvision and numpy, but you can add more pip dependencies.
- All the results MUST be saved in /train/results.
- You SHOULD include a signal handler to save the results in case of max time reached.

## Build steps:

Modify your scripts to save the results in /results directory:

```python
parser.add_argument('--save', type=str, default='results/model.pt',
                    help='path to save the final model')

```

Include a signal handler to save results if the container is stopped:

```python
def handleTimeout(signalNumber, frame):
    print('-' * 89)
    print('TIMEOUT')
    with open(args.save, 'wb+') as f:
        torch.save(model, f)
    sys.exit() 

signal.signal(signal.SIGTERM, handleTimeout)
```

Copy scripts and data into the working directory:

```docker
FROM oscarvicente/deepscheduler-pytorch-920m-cuda-base
COPY ./ ./
```

If you have pip requirements create a requirements.txt file, copy it into the container and run pip install:

```docker
RUN pip3 install -r requirements.txt
```

Finally include an entrypoint with the main script execution (include cuda parameter)

```docker
ENTRYPOINT [ "python3", "-u", "main.py", "--cuda" ]
```