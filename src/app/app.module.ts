import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ExportTreeComponent, ImportExportDialog } from './export-tree/export-tree.component';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { TreeComponent } from './tree/tree.component';
import { AssetService } from './asset.service';
import { ScenarioInfoComponent, ScenarioInfoDialog } from './scenario-info/scenario-info.component';
import { TreeLogicService } from './tree-logic.service';


@NgModule({
  declarations: [
    AppComponent,
    TreeComponent,
    ScenarioInfoComponent,
    ScenarioInfoDialog,
    ExportTreeComponent,
    ImportExportDialog
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
  ],
  entryComponents: [
    ScenarioInfoDialog,
    ImportExportDialog
  ],
  providers: [ AssetService, TreeLogicService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
