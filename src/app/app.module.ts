import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CytoscapeComponent } from './cytoscape/cytoscape.component';
import { AssetService } from './asset.service';
import { ScenarioInfoComponent } from './scenario-info/scenario-info.component';


@NgModule({
  declarations: [
    AppComponent,
    CytoscapeComponent,
    ScenarioInfoComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [ AssetService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
