import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colorCode'
})

export class HttpStatusColorCodeTextPipe implements PipeTransform {

  transform(statusCode) {
    if ( statusCode > 199 && statusCode < 299) {
      return true;
    } else {
      return false;
    }
  }
}