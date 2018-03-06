import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { CytoscapeComponent } from './cytoscape/cytoscape.component';
import { AssetService } from './asset.service';
import { ScenarioInfoComponent, ScenarioInfoDialog } from './scenario-info/scenario-info.component';


@NgModule({
  declarations: [
    AppComponent,
    CytoscapeComponent,
    ScenarioInfoComponent,
    ScenarioInfoDialog
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  entryComponents: [
    ScenarioInfoDialog
  ],
  providers: [ AssetService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
