import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AppModlerService } from './appModler.service';


@Injectable()
export class AppModlerResolver implements Resolve<Object[]>{
  constructor(private appModlerService: AppModlerService){}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    let appName = route.params['appName'];
    return this.appModlerService.getAppData(appName);
  }
}
