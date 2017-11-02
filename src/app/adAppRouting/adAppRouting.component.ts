import { Utility } from './../util/util';
import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AdAppRoutingService } from './adAppRouting.service';
import { AppConfigService } from '../services/appConfig.service';
import { AppRoute } from '@jatahworx/bhive-core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgForm } from '@angular/forms';
import { DialogService } from 'app/services/dialog.service';
import { AdAppRoutingDialogComponent } from 'app/adAppRouting/adAppRoutingDialog.component';

/**
 * A Routing Editor is a Route Config Editor UI which lets the user
 * editor the base routes, and the child routes and so on.
 * The AdAppRoutingComponent is a recursive component which has the 
 * following functionalities:
 * 1. When the page loads it should display two default routes.
 *    a. An Empty route '' (Can be redirected to any other component) 
 *       and '**' (PageNotFoundComponent).
 *    b. The default routes cannot have children.
 *    c. '' component selection should be disabled.
 *    d. '**' redirectTo selection should be disabled.
 * 2. Each route field has three buttons to support various editing
 *    features.
 *    a. Add: To add a route to the current array.
 *    b. AddChild: To add a child to the children array.
 *    c. Delete: To delete the current route from the route/children array.
 * 3. In each route field if component is selected redirectTo should be
 *    emptied and vice versa. Before emptying redirectTo the user should
 *    be prompted whether he wants to save the changes.
 * 4. If a certain route is going to be deleted and it has children
 *    the user should be prompted whether he wants to continue with
 *    the changes.
 * 5. If redirectTo field is written then User can't make children
 *    for that specific route. If children array were already made
 *    and User changes the route to redirectTo then the User should
 *    prompted whether he wants to continue with the changes.
 * 6. Each route should have a path && component || path && redirectTo
 *    to make the whole Route Form valid.
 */

@Component({
  selector: 'ad-app-routing',
  templateUrl: './adAppRouting.template.html',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ transform: 'translateY(100%)', opacity: 0 }),
          animate('100ms', style({ transform: 'translateY(0)', opacity: 1 }))
        ]),
        transition(':leave', [
          style({ transform: 'translateY(0)', opacity: 1 }),
          animate('100ms', style({ transform: 'translateY(100%)', opacity: 0 }))
        ])
      ]
    )
  ],
  styleUrls: ['./adAppRouting.style.css']
})
export class AdAppRoutingComponent implements OnInit, OnDestroy {

  @Input('config') config; // getting config from the editor component
  @Input('isCldrnArr') isCldrnArr; // important to give [isChild]="'child'" assignment so that all the configuration assignment for the children array be done when this condition is satisfied.  
  @Input() appPages; // app pages list array
  @Input() appRoutes; // assign the appRoutes array to be iterated inside the template (Since it is a recursive component, the children array is also an appRoutes array)
  viewIndex = -1; // every new route that is created should have a animation of enter from down bellow this index stores the index of the route field that currently being animated
  util: Utility;
  dialogRef;
  appConfigSub;
  appName;

  constructor(private adAppRoutingService: AdAppRoutingService, private appConfigService: AppConfigService, private dialogService: DialogService) {
    this.appRoutes = [];
    this.util = new Utility();
  }

  /**
   * If it the first AdAppRoutingComponent getting loaded the first time for 
   * appRoutes array view then, gAppConfig should be subscribed and page list
   * should be assigned in the apppages.
   * 1. Check if it's the first the time the component is running
   *    a. If it's the first time the component is running save the index of the
   *    default route and the pagenotfoundcomponent in two separate variable
   *    (Save the index according to how the routes will be displayed in the UI).
   *    b. subscribe to gAppConfig, assign from appRoutes from it and appPages
   *       too.
   *    c. Since the default routes are supposed to be displayed at the top in UI
   *       and be at the bottom during write operation. We perfrom an array rotation
   *       for the starting two index during Init and during save.
   *    d. Convert the array of object of routes to type AppRoutes.
   *    e. Setting button visibility: 
   *       * Default routes: No buttons except add button is visible only if there are no
   *         other routes
   *       * Add Route Button for Adding routes, should be visible on the last index
   *       * Add Child Route button for every valid route
   *       
   */
  ngOnInit() {
    if (!this.isCldrnArr) {
      this.appName = this.appConfigService.getGAppName();
      this.appConfigSub = this.appConfigService.gAppConfigObservable.subscribe(result => {
        if (this.appRoutes.length == 0 && result && result.appRoutes) {
          result.appRoutes[0]['default'] = true;
          this.appRoutes = this.convertToAppRoutesArray(this.rotate(result['appRoutes'], -2, 2));
        }
        this.appPages = this.util.generateArrayOfKeys(result['appPages']);
      });
    }
  }

  addRoute(index) {
    const tempRoute = new AppRoute('');
    this.appRoutes.push(tempRoute);
  }

  addChildRoute(index) {
    if (this.appRoutes[index] instanceof AppRoute) {
      this.appRoutes[index].addChildRoute(new AppRoute(''));
    } else {
      console.error('Invalid form');
      this.dialogService.openSnackBar('Invalid form');
    }
  }

  deleteRoute(i) {
    if (this.appRoutes[i] instanceof AppRoute) {
      this.appRoutes.splice(i, 1);
    }
  }

  save(config) {
    if (this.appRoutes && this.checkIfEmpty(this.appRoutes)) {
      this.adAppRoutingService.setAppRoutes(this.appName, this.rotate(this.appRoutes, 0, 2)).then(result => {
        // console.info(result);
      });
      this.appConfigService.updateConfigTypeOfGAppConfig('appRoutes', this.rotate(this.appRoutes, 0, 2));
    } else if (!this.checkIfEmpty(this.appRoutes)) {
      console.error('Invalid form.');
      this.dialogService.openSnackBar('Invalid form');
    } else {
      console.error('Invalid config.');
      this.dialogService.openSnackBar('Invalid config');
    }
  }

  convertToAppRoutesArray(routes) {
    for (let i = 0; i < routes.length; i++) {
      routes[i] = this.convertObjectToRoute(routes[i]);
      if (routes[i].children && routes[i].children.length > 0) {
        this.convertToAppRoutesArray(routes[i].children);
      }
    }
    return routes;
  }

  convertObjectToRoute(route) {
    const tempRoute = new AppRoute(route.path ? route.path : '');
    tempRoute.setComponent(route.component ? route.component : '');
    tempRoute.setPathMatch(route.pathMatch ? route.pathMatch : '');
    tempRoute.setRedirectTo(route.redirectTo ? route.redirectTo : '');
    tempRoute.setResolve(route.resolve ? route.resolve : '');
    tempRoute.setData(route.data ? route.data : '');
    tempRoute.setCanActivate(route.canActivate ? route.canActivate : '');
    if (route.children && route.children.length > 0) {
      tempRoute.children = route.children.slice(0);
    }
    return tempRoute;
  }

  checkIfEmpty(arr) {
    for (let i = 0; i < arr.length; i++) {
      if ((arr[i].hasOwnProperty('default') && arr[i].default)) {
        if (arr[i].children && arr[i].children.length !== 0) {
          return this.checkIfEmpty(arr[i].children);
        } else if (arr[i].children && arr[i].children.length === 0) {
          delete arr[i].children;
        } else {
          continue;
        }
      } else if ((!arr[i].hasOwnProperty('path') || arr[i].path === '') || ((!arr[i].hasOwnProperty('component') || arr[i].component === '') && (!arr[i].hasOwnProperty('redirectTo') || arr[i].redirectTo === ''))) {
        return false;
      } else if (arr[i].children && arr[i].children.length !== 0) {
        return this.checkIfEmpty(arr[i].children);
      } else if (arr[i].children && arr[i].children.length === 0) {
        delete arr[i].children;
      }
    }
    return true;
  }

  rotate(array: Array<any>, start: number, n: number) {
    const arr: Array<any> = array.map(x => Object.assign({}, x));
    while (arr.length && n < 0) {
      n += arr.length;
    }
    if (start < 0) {
      arr.unshift.apply(arr, arr.splice(start, n));
    } else {
      arr.push.apply(arr, arr.splice(start, n));
    }
    return arr;
  }

  assignRedirectToCheck(index) {
    let createDialog = false;
    if (this.appRoutes[index]) {
      if (this.appRoutes[index].component && this.appRoutes[index].component != '' && !this.appRoutes[index].children) {
        createDialog = true;
        AdAppRoutingDialogComponent.message = "A route can't have 'redirectTo' and 'page' simultaneously. Do you want to continue with the changes?";
      } else if (this.appRoutes[index].component && this.appRoutes[index].component != '' && this.appRoutes[index].children) {
        createDialog = true;
        AdAppRoutingDialogComponent.message = "A route can't have 'redirectTo' and 'page' with children simultaneously. Do you want to continue with the changes? All children will be removed.";
      }
      if (!this.dialogRef && createDialog) {
        this.dialogRef = this.dialogService.createDialog(AdAppRoutingDialogComponent);
        this.dialogRef.afterClosed().subscribe(result => {
          this.dialogRef = undefined;
          if (result) {
            this.appRoutes[index].component = '';
            if (this.appRoutes[index].children) {
              delete this.appRoutes[index].children;
            }
          } else {
            this.appRoutes[index].redirectTo = '';
          }
        });
      }
    }
  }

  assignComponentCheck(index) {
    if (this.appRoutes[index]) {
      if (this.appRoutes[index].redirectTo && this.appRoutes[index].redirectTo != '') {
        AdAppRoutingDialogComponent.message = "A route can't have 'redirectTo' and 'page' simultaneously. Do you want to continue with the changes?";
        if (!this.dialogRef) {
          this.dialogRef = this.dialogService.createDialog(AdAppRoutingDialogComponent);
          this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = undefined;
            if (result) this.appRoutes[index].redirectTo = '';
            else this.appRoutes[index].component = '';
          });
        }
      }
    }
  }

  removeDuplicatePath(path, index) {
    for (let i = 0; i < this.appRoutes.length; i++) {
      if (path == this.appRoutes[i].path && i != index) {
        AdAppRoutingDialogComponent.message = "Warning! A route path should be unique to the Routes array.";
        AdAppRoutingDialogComponent.close = false;
        if (!this.dialogRef) {
          this.dialogRef = this.dialogService.createDialog(AdAppRoutingDialogComponent);
          this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = undefined;
            this.appRoutes[index].path = '';
            AdAppRoutingDialogComponent.close = true;
          });
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.appConfigSub) this.appConfigSub.unsubscribe();
  }
}
