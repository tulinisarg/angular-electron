import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';

import { AppRoutingModule } from './appRouting.module';

import { BKeeperComponent } from './bKeeper/bKeeper.component';
import { AppModlerComponent } from './appModler/appModler.component';
import { AdRootComponent } from './adRoot/adRoot.component';
import { AppsComponent } from './apps/apps.component';
import { CreateAppComponent } from './apps/createApp.component';
import { CreatePageComponent } from './pages/createPage.component';
import { PageDesignerComponent } from './pages/pageDesigner.component';
import { AdAppRoutingComponent } from './adAppRouting/adAppRouting.component';
import { ADActionBarComponent } from './adActionBar/adActionBar.component';
import { BPaletteKeyDirective } from './bKeeper/bPalettekey.directive';
import { TsEditorComponent } from './tsEditor/tsEditor.component';
import { AdAppRoutingWrapperComponent } from './adAppRouting/adAppRoutingWrapper.component';
import { CreateDataModelComponent } from './dataModel/createDataModel.component';
import { DataModelEditorComponent } from './dataModelEditor/dataModelEditor.component';
import { AdAppRoutingDialogComponent } from './adAppRouting/adAppRoutingDialog.component';
import { XmlEditorComponent } from './xmlEditor/xmlEditor.component';
import { cssEditorComponent } from './cssEditor/cssEditor.component';
import { NodeREDComponent } from './nodeRED/nodeRED.component';
import { ConsoleWindowComponent } from './consoleWindow/consoleWindow.component';
import { EnvironmentComponent } from './environments/environment.component';
import { CreateEnvironmentComponent } from './environments/createEnvironment/createEnvironment.component';
import { AppAssetsEditorComponent } from './appAssetsEditor/appAssetsEditor.component';
import { TreeComponent } from './appAssetsEditor/treeComponent/makeTree.component';
import { ImageSliderComponent } from './appAssetsEditor/imageSlider/imageSlider.component';
import { ImageDeleteDialogComponent } from './appAssetsEditor/imageSlider/imageDeleteDialog.component';
import { CreateNgServiceComponent } from './ngServices/createNgService/createNgService.component';
import { NgServiceTsEditorComponent } from './ngServices/ngServiceTsEditor/ngServiceTsEditor.component';
import { DeleteAppComponent } from './apps/deleteApp.component';
import { ImportAppComponent } from './apps/importApp/importApp.component';
import { ProgressBarComponent } from './progressBar/progressBar.component';

import { TestComponent } from './testComponents/test.component';
import { Test1Component } from './testComponents/test1.component';
import { Test2Component } from './testComponents/test2.component';
import { Test3Component } from './testComponents/test3.component';

import { AppsService } from './apps/apps.service';
import { AppModlerService } from './appModler/appModler.service';
import { DialogService } from './services/dialog.service';
import { AppTabService } from './services/appTab.service';
import { AdAppRoutingService } from './adAppRouting/adAppRouting.service';
import { AppConfigService } from './services/appConfig.service';
import { BKeeperService } from './bKeeper/bKeeper.service';
import { PubSubService } from './services/pubSub.service';
import { TsEditorService } from './tsEditor/tsEditor.service';
import { DataModelService } from './dataModel/dataModel.service';
import { DataModelEditorService } from './dataModelEditor/dataModelEditor.service';
import { PagesService } from './pages/pages.service';
import { XmlEditorService } from './xmlEditor/xmlEditor.service';
import { cssEditorService } from './cssEditor/cssEditor.service';
import { AppOperationService } from './services/appOperation.service';
import { EnvironmentService } from './environments/environment.service';
import { ConvertToObjectArrayPipe } from './pipes/convertToObjectArray.pipe';
import { LoadExternalURlPipe } from './pipes/loadExternalURL.pipe';
import { NgServicesService } from './ngServices/ngService.service';
import { HttpStatusColorCodeTextPipe } from './pipes/httpStatusColorCode.pipe';

import { AppModlerResolver } from './appModler/appModler.resolver';
import { AppsResolver } from './apps/apps.resolver';
import { runtimeComponent } from './apps/runtime.component';
import { AdRootService } from './adRoot/adRoot.service';

export function adRootFactory(adRootService: AdRootService) {
  return () => adRootService.updateWorkspace();
}

@NgModule({
  declarations: [
    BKeeperComponent,
    AppModlerComponent,
    AdRootComponent,
    AppsComponent,
    AppModlerComponent,
    CreateAppComponent,
    CreatePageComponent,
    AdAppRoutingComponent,
    BPaletteKeyDirective,
    TestComponent,
    Test1Component,
    Test2Component,
    Test3Component,
    PageDesignerComponent,
    ConvertToObjectArrayPipe,
    AdAppRoutingWrapperComponent,
    ADActionBarComponent,
    TsEditorComponent,
    CreateDataModelComponent,
    DataModelEditorComponent,
    AdAppRoutingDialogComponent,
    XmlEditorComponent,
    NodeREDComponent,
    LoadExternalURlPipe,
    ConsoleWindowComponent,
    EnvironmentComponent,
    CreateEnvironmentComponent,
    AppAssetsEditorComponent,
    TreeComponent,
    ImageSliderComponent,
    ImageDeleteDialogComponent,
    cssEditorComponent,
    CreateNgServiceComponent,
    NgServiceTsEditorComponent,
    HttpStatusColorCodeTextPipe,
    DeleteAppComponent,
    runtimeComponent,
    ImportAppComponent,
    ProgressBarComponent,
  ],

  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    NoopAnimationsModule,
    FlexLayoutModule,
    AppRoutingModule,
  ],

  providers: [
    AdRootService,
    {
      provide: APP_INITIALIZER,
      useFactory: adRootFactory,
      deps: [AdRootService],
      multi: true
    },
    AppModlerService,
    AppModlerResolver,
    AppsResolver,
    DialogService,
    AppTabService,
    AppsService,
    AdAppRoutingService,
    AppConfigService,
    BKeeperService,
    PubSubService,
    TsEditorService,
    DataModelService,
    PagesService,
    DataModelEditorService,
    XmlEditorService,
    Title,
    AppOperationService,
    EnvironmentService,
    cssEditorService,
    NgServicesService
  ],

  entryComponents: [
    CreateAppComponent,
    CreatePageComponent,
    CreateDataModelComponent,
    AdAppRoutingDialogComponent,
    CreateEnvironmentComponent,
    ImageDeleteDialogComponent,
    CreateNgServiceComponent,
    DeleteAppComponent,
    runtimeComponent,
    ImportAppComponent
  ],
  bootstrap: [AdRootComponent]
})
export class AppModule { }
