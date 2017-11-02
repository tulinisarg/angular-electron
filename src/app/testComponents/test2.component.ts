import {Component, Input} from '@angular/core';

@Component({
    selector: 'test-2-component',
    template: `
    {{routeConfig | json}}
    `
})
export class Test2Component {
    @Input() routeConfig;
}