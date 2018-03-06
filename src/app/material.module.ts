import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
@NgModule({
    imports: [
        MatInputModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatDialogModule,
        MatDividerModule
    ],
    exports: [
        MatInputModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatDialogModule,
        MatDividerModule
    ],
    providers: [ ]
  })
  export class MaterialModule { }