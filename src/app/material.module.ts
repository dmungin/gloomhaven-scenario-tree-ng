import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
    imports: [
        MatInputModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatDialogModule,
        MatDividerModule,
        MatIconModule
    ],
    exports: [
        MatInputModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatDialogModule,
        MatDividerModule,
        MatIconModule
    ],
    providers: [ ]
  })
  export class MaterialModule { }