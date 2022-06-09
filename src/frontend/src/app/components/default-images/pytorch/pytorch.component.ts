import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pytorch',
  templateUrl: './pytorch.component.html',
  styleUrls: ['./pytorch.component.scss']
})
export class PytorchComponent implements OnInit {

  constructor() { }
  
  codeStep1 = `parser.add_argument('--save', type=str, default='results/model.pt',
  help='path to save the final model')`;

  codeStep2 = `def handleTimeout(signalNumber, frame):
  print('-' * 89)
  print('TIMEOUT')
  with open(args.save, 'wb+') as f:
      torch.save(model, f)
  sys.exit() 

  signal.signal(signal.SIGTERM, handleTimeout)`

  codeStep3_1 = `FROM oscarvicente/deepscheduler-pytorch-cuda-base
COPY ./ ./`
  codeStep3_2 = `RUN pip3 install -r requirements.txt`
  codeStep3_3 = `tensorboard --logdir=/train/results/ --host 0.0.0.0 &
python3 -u main.py --cuda`

  ngOnInit(): void {
  }

  tabSelected(event : any){
    console.log(event)
  }

}
