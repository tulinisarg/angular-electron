import {Component, Input} from '@angular/core';

@Component({
    selector: 'test-component',
    template: `
    {{routeConfig | json}}
    `
})
export class TestComponent {
    @Input() routeConfig;
}