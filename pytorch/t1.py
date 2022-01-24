import torch
import torchvision.models as models

model = models.vgg16(pretrained=True)
torch.save(model.state_dict(), '/home/oscar/Escritorio/TFG/usal-deepscheduler/pytorch/model_weights.pth')
