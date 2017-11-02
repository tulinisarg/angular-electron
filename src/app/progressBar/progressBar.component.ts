import { Component } from '@angular/core';
import { AppOperationService } from '../services/appOperation.service';

@Component({
  selector: 'bh-progressBar',
  templateUrl: './progressBar.template.html',
  styleUrls: ['./progressBar.style.css']
})

export class ProgressBarComponent {
  public isFsInProgress: boolean;
  public export;
  public import;
  constructor(private appOperationService: AppOperationService) {
    appOperationService.progressBarData.subscribe((res) => {
      this.isFsInProgress = res.export || res.import;
      this.export = (res && res.hasOwnProperty('export')) ? res.export : false;
      this.import = (res && res.hasOwnProperty('import')) ? res.import : false;
    });
  }

}