import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tensorflow',
  templateUrl: './tensorflow.component.html',
  styleUrls: ['./tensorflow.component.scss']
})
export class TensorflowComponent implements OnInit {

  constructor() { }

  backgroundTranslate = -45

  codeStep1 = `birnn_net.save_weights(filepath="results/tfmodel.ckpt")`;

  codeStep2 = `def handleTimeout(signalNumber, frame):
  print('-' * 89)
  print('TIMEOUT')
  birnn_net.save_weights(filepath="results/tfmodel.ckpt")
  sys.exit() 

signal.signal(signal.SIGTERM, handleTimeout)`

  codeStep3_1 = `FROM oscarvicente/deepscheduler-pytorch-cuda-base
COPY ./ ./`
  codeStep3_2 = `RUN pip3 install -r requirements.txt`
  codeStep3_3 = `ENTRYPOINT [ "python3", "-u", "main.py"]`

  ngOnInit(): void {
  }

  tabSelected(event : any){
    console.log(event)
  }

}
