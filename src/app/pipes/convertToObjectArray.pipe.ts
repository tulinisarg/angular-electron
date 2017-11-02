import { Pipe, PipeTransform } from '@angular/core';
import { Utility } from '../util/util';
@Pipe({name: 'toobjectarray'})
export class ConvertToObjectArrayPipe implements PipeTransform {
  transform(object: Object): Array<any> {
    let util = new Utility();
    return util.generateArray(object);
  }
}