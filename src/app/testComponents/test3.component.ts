import {Component, Input} from '@angular/core';

@Component({
    selector: 'test-3-component',
    template: `
    {{routeConfig | json}}
    `
})
export class Test3Component {
    @Input() routeConfig;
}