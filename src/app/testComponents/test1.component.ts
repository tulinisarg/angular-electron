import {Component, Input} from '@angular/core';

@Component({
    selector: 'test-1-component',
    template: `
    {{routeConfig | json}}
    `
})
export class Test1Component {
    @Input() routeConfig;
}