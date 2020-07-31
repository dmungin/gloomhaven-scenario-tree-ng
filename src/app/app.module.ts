import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ExportTreeComponent, ImportExportDialogComponent } from './export-tree/export-tree.component';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { TreeComponent } from './tree/tree.component';
import { AssetService } from './asset.service';
import { ScenarioInfoComponent, ScenarioInfoDialogComponent } from './scenario-info/scenario-info.component';
import { TreeLogicService } from './tree-logic.service';
import { KeyComponent } from './key/key.component';


@NgModule({
  declarations: [
    AppComponent,
    TreeComponent,
    ScenarioInfoComponent,
    ScenarioInfoDialogComponent,
    ExportTreeComponent,
    ImportExportDialogComponent,
    KeyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ AssetService, TreeLogicService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
