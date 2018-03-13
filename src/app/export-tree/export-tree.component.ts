import { Component, OnInit, Input, EventEmitter, Output, Inject } from '@angular/core';
import { AssetService } from '../asset.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-export-tree',
  templateUrl: './export-tree.component.html',
  styleUrls: ['./export-tree.component.css']
})
export class ExportTreeComponent implements OnInit {
  @Input() scenarios: any;
  @Output() importScenarios = new EventEmitter();
  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }
  public showImportExportModal() {
    let dialogRef = this.dialog.open(ImportExportDialog, {
      width: '600px',
      height: '60vh',
      data: { scenarios: this.scenarios }
    });
    dialogRef.afterClosed().subscribe((scenarios) => {
      if (scenarios) {
        this.importScenarios.emit(scenarios);
      }
    });
  }
  

}

@Component({
  selector: 'app-import-export-dialog',
  templateUrl: './import-export-dialog.html',
  styles: [`
  mat-form-field {
    width: 100%;
  }
  mat-form-field textarea {
    height: 150px;
  }
  mat-dialog-actions {
    position: absolute;
    bottom: 20px;
    margin-bottom: 0;
  }
  `]
})
export class ImportExportDialog {
  public scenarios: any;
  public encodedScenarios: String;
  constructor(
    public dialogRef: MatDialogRef<ImportExportDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public assetService: AssetService) { 
      this.scenarios = data.scenarios;
      this.encodedScenarios = this.exportEncodedScenarios();
    }
  public importEncodedScenarios() {
    return this.assetService.getDecodedScenarios(this.encodedScenarios);
  }
  public exportEncodedScenarios() {
    return this.assetService.getEncodedScenarios(this.scenarios);
  }
  // close(): void {
  //   this.dialogRef.close();
  // }

}