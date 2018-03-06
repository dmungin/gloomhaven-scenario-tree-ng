import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule }   from '@angular/forms';

import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { TreeComponent } from './tree/tree.component';
import { AssetService } from './asset.service';
import { ScenarioInfoComponent, ScenarioInfoDialog } from './scenario-info/scenario-info.component';


@NgModule({
  declarations: [
    AppComponent,
    TreeComponent,
    ScenarioInfoComponent,
    ScenarioInfoDialog
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule
  ],
  entryComponents: [
    ScenarioInfoDialog
  ],
  providers: [ AssetService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
