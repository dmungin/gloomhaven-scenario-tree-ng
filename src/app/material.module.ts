import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
@NgModule({
    imports: [
        MatInputModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatDialogModule
    ],
    exports: [
        MatInputModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatDialogModule
    ],
    providers: [ ]
  })
  export class MaterialModule { }