import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppModlerComponent } from 'app/appModler/appModler.component';
import { AppModlerResolver } from 'app/appModler/appModler.resolver';
import { AppsComponent } from 'app/apps/apps.component';
import { AppsResolver } from 'app/apps/apps.resolver';
import { runtimeComponent } from './apps/runtime.component'

const appRoutes: Routes = [
  { path: '', redirectTo: 'apps', pathMatch: 'full' },
  { path: 'apps', component: AppsComponent, resolve: { appList: AppsResolver } },
  { path: 'app/:appName', component: AppModlerComponent, resolve: { appData: AppModlerResolver } },
  { path: 'runtime', component: runtimeComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
