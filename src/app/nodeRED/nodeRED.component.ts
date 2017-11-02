import { PubSubService } from 'app/services/pubSub.service';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'node-RED',
  templateUrl: './nodeRED.template.html'
})

export class NodeREDComponent implements OnInit {
  @Input('tabConfig') tabConfig;
  @Input('currentlyActive') currentlyActive;

  private url;
  constructor(private pubsub: PubSubService) {
  }

  ngOnInit() {
    this.url = this.tabConfig.nrUrl;
  }

  ngOnChanges(changes: SimpleChanges) {
    let isTabActive = changes['currentlyActive'];
    if (isTabActive && this.currentlyActive) {
      this.pubsub.$pub('tabListner', []);
    }
  }

}